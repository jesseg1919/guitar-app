import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

const APP_NAME = "GuitarApp";
const APP_DESCRIPTION =
  "A free, structured guitar learning platform with interactive lessons, practice tools, chord library, and 500+ songs. Go from your first chord to playing full songs.";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Learn Guitar, One Chord at a Time`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "guitar",
    "learn guitar",
    "guitar lessons",
    "chord library",
    "guitar practice",
    "guitar chords",
    "beginner guitar",
    "guitar songs",
    "guitar tuner",
    "metronome",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  metadataBase: new URL("https://guitarapp.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    title: `${APP_NAME} - Learn Guitar, One Chord at a Time`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Learn Guitar Online`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Learn Guitar, One Chord at a Time`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
