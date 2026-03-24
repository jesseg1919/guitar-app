import Link from "next/link";
import {
  Wrench,
  Timer,
  Mic,
  RefreshCw,
  ArrowDownUp,
  Ear,
  ListChecks,
} from "lucide-react";

export const metadata = { title: "Practice | GuitarApp" };

const tools = [
  {
    href: "/practice/routine",
    icon: ListChecks,
    title: "Daily Practice Routine",
    description: "Follow a structured routine with timed steps and progress tracking.",
    featured: true,
  },
  {
    href: "/practice/metronome",
    icon: Timer,
    title: "Metronome",
    description: "Keep time with an adjustable BPM metronome with tap tempo.",
  },
  {
    href: "/practice/tuner",
    icon: Mic,
    title: "Guitar Tuner",
    description: "Tune your guitar with a microphone-based chromatic tuner.",
  },
  {
    href: "/practice/chord-trainer",
    icon: RefreshCw,
    title: "Chord Change Trainer",
    description: "Practice switching between chords and track your speed.",
  },
  {
    href: "/practice/strumming",
    icon: ArrowDownUp,
    title: "Strumming Patterns",
    description: "Learn and practice strumming patterns synced to a beat.",
  },
  {
    href: "/practice/ear-training",
    icon: Ear,
    title: "Ear Training",
    description: "Train your ear to identify notes, intervals, and chords.",
  },
];

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white">
          <Wrench className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          Practice Toolbox
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Essential tools to level up your playing. Pick a tool and start practicing.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ href, icon: Icon, title, description, featured }) => (
          <Link
            key={href}
            href={href}
            className={`group rounded-2xl border p-6 transition-all hover:shadow-md ${
              featured
                ? "border-amber-300 bg-amber-50 hover:border-amber-400 dark:border-amber-700 dark:bg-amber-900/20 dark:hover:border-amber-600 sm:col-span-2 lg:col-span-1"
                : "border-neutral-200 bg-white hover:border-amber-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
            }`}
          >
            <div className={`mb-4 inline-flex rounded-xl p-3 transition-colors ${
              featured
                ? "bg-amber-200 group-hover:bg-amber-300 dark:bg-amber-800/50 dark:group-hover:bg-amber-800/70"
                : "bg-amber-100 group-hover:bg-amber-200 dark:bg-amber-900/30 dark:group-hover:bg-amber-900/50"
            }`}>
              <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
