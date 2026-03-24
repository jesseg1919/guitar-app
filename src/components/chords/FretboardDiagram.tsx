"use client";

import { cn } from "@/lib/utils";

/**
 * Fretboard data format:
 * {
 *   strings: [fret, fret, fret, fret, fret, fret]  // low E to high E, -1 = muted, 0 = open
 *   fingers: [f, f, f, f, f, f]                     // 0 = no finger, 1-4 = finger number
 *   barres: [{ from: 1, to: 6, fret: 1 }]          // optional barre indicators
 *   baseFret: 1                                     // starting fret (1 = nut position)
 * }
 */

export interface FretboardData {
  strings: number[];  // 6 values: fret for each string (low E first), -1 = muted, 0 = open
  fingers: number[];  // 6 values: finger number (0 = none, 1-4)
  barres?: { from: number; to: number; fret: number }[];
  baseFret: number;
}

interface FretboardDiagramProps {
  data: FretboardData;
  name?: string;
  size?: "sm" | "md" | "lg";
  showFingers?: boolean;
  className?: string;
}

// Dimensions
const STRING_COUNT = 6;
const FRET_COUNT = 5;

export function FretboardDiagram({
  data,
  name,
  size = "md",
  showFingers = true,
  className,
}: FretboardDiagramProps) {
  const dimensions = {
    sm: { width: 80, height: 100, dotR: 5, fontSize: 8, topPad: 18, nameFontSize: 10 },
    md: { width: 120, height: 150, dotR: 7, fontSize: 11, topPad: 24, nameFontSize: 14 },
    lg: { width: 180, height: 220, dotR: 10, fontSize: 15, topPad: 32, nameFontSize: 18 },
  };

  const d = dimensions[size];
  const padX = d.width * 0.18;
  const padBottom = 12;
  const fretboardWidth = d.width - padX * 2;
  const fretboardHeight = d.height - d.topPad - padBottom;
  const stringSpacing = fretboardWidth / (STRING_COUNT - 1);
  const fretSpacing = fretboardHeight / FRET_COUNT;

  const stringX = (i: number) => padX + i * stringSpacing;
  const fretY = (f: number) => d.topPad + f * fretSpacing;

  const isNut = data.baseFret === 1;

  return (
    <svg
      viewBox={`0 0 ${d.width} ${d.height}`}
      className={cn("select-none", className)}
      style={{ width: d.width, height: d.height }}
      aria-label={name ? `${name} chord diagram` : "Chord diagram"}
    >
      {/* Chord name */}
      {name && (
        <text
          x={d.width / 2}
          y={d.topPad - (isNut ? 10 : 10)}
          textAnchor="middle"
          className="fill-neutral-900 dark:fill-white"
          fontSize={d.nameFontSize}
          fontWeight="bold"
        >
          {name}
        </text>
      )}

      {/* Base fret indicator (if not at nut) */}
      {!isNut && (
        <text
          x={padX - d.dotR - 4}
          y={fretY(0) + fretSpacing / 2 + d.fontSize / 3}
          textAnchor="end"
          className="fill-neutral-500 dark:fill-neutral-400"
          fontSize={d.fontSize * 0.85}
        >
          {data.baseFret}fr
        </text>
      )}

      {/* Nut (thick line at top) or thin line */}
      <line
        x1={padX}
        y1={fretY(0)}
        x2={padX + fretboardWidth}
        y2={fretY(0)}
        stroke="currentColor"
        strokeWidth={isNut ? 3.5 : 1}
        className="text-neutral-800 dark:text-neutral-200"
      />

      {/* Fret lines */}
      {Array.from({ length: FRET_COUNT }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={padX}
          y1={fretY(i + 1)}
          x2={padX + fretboardWidth}
          y2={fretY(i + 1)}
          stroke="currentColor"
          strokeWidth={1}
          className="text-neutral-300 dark:text-neutral-600"
        />
      ))}

      {/* String lines */}
      {Array.from({ length: STRING_COUNT }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={stringX(i)}
          y1={fretY(0)}
          x2={stringX(i)}
          y2={fretY(FRET_COUNT)}
          stroke="currentColor"
          strokeWidth={1 + (5 - i) * 0.15}
          className="text-neutral-400 dark:text-neutral-500"
        />
      ))}

      {/* Barre indicators */}
      {data.barres?.map((barre, idx) => {
        const fromX = stringX(barre.from - 1);
        const toX = stringX(barre.to - 1);
        const y = fretY(barre.fret - 1) + fretSpacing / 2;
        return (
          <rect
            key={`barre-${idx}`}
            x={Math.min(fromX, toX) - d.dotR}
            y={y - d.dotR}
            width={Math.abs(toX - fromX) + d.dotR * 2}
            height={d.dotR * 2}
            rx={d.dotR}
            className="fill-neutral-800 dark:fill-neutral-200"
          />
        );
      })}

      {/* Finger dots, open strings (O), and muted strings (X) */}
      {data.strings.map((fret, i) => {
        const x = stringX(i);

        // Muted string
        if (fret === -1) {
          const y = fretY(0) - d.dotR - 2;
          const s = d.dotR * 0.55;
          return (
            <g key={`mute-${i}`}>
              <line
                x1={x - s} y1={y - s} x2={x + s} y2={y + s}
                stroke="currentColor" strokeWidth={1.5}
                className="text-neutral-400 dark:text-neutral-500"
              />
              <line
                x1={x + s} y1={y - s} x2={x - s} y2={y + s}
                stroke="currentColor" strokeWidth={1.5}
                className="text-neutral-400 dark:text-neutral-500"
              />
            </g>
          );
        }

        // Open string
        if (fret === 0) {
          const y = fretY(0) - d.dotR - 2;
          return (
            <circle
              key={`open-${i}`}
              cx={x}
              cy={y}
              r={d.dotR * 0.55}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-neutral-500 dark:text-neutral-400"
            />
          );
        }

        // Fretted note
        const adjustedFret = fret;
        const y = fretY(adjustedFret - 1) + fretSpacing / 2;
        const finger = data.fingers[i];

        // Skip rendering if this position is covered by a barre
        const coveredByBarre = data.barres?.some(
          (b) => b.fret === adjustedFret && i >= b.from - 1 && i <= b.to - 1 && finger === 0
        );
        if (coveredByBarre) return null;

        return (
          <g key={`dot-${i}`}>
            <circle
              cx={x}
              cy={y}
              r={d.dotR}
              className="fill-neutral-800 dark:fill-neutral-200"
            />
            {showFingers && finger > 0 && (
              <text
                x={x}
                y={y + d.fontSize * 0.35}
                textAnchor="middle"
                fontSize={d.fontSize * 0.75}
                fontWeight="bold"
                className="fill-white dark:fill-neutral-900"
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
