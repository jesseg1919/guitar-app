"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Guitar,
  BookOpen,
  Music,
  Wrench,
  ChevronRight,
  Flame,
  Award,
  Target,
  Play,
  Headphones,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-amber-950/20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-800/10" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-800/10" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            >
              <Guitar className="h-4 w-4" />
              Free guitar lessons for everyone
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl"
            >
              Learn Guitar,{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                One Chord at a Time
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              A structured, step-by-step curriculum that takes you from picking
              up the guitar for the first time to playing your favorite songs.
              Practice tools, chord library, and 500+ songs included.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-600/25 transition-all hover:bg-amber-700 hover:shadow-xl hover:shadow-amber-600/30"
              >
                Start Learning &mdash; It&apos;s Free
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/lessons"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-8 py-4 text-lg font-semibold text-neutral-700 transition-all hover:border-amber-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-amber-600 dark:hover:bg-neutral-700"
              >
                <Play className="h-5 w-5" />
                Browse Lessons
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500"
            >
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Works on any device
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Track your progress
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl"
            >
              How it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400"
            >
              A proven path from zero to playing your favorite songs
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                step: "01",
                title: "Follow the Curriculum",
                description:
                  "Work through graded lessons at your own pace. Each lesson introduces new chords, techniques, and songs.",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "Practice Daily",
                description:
                  "Use guided practice routines with built-in tools — metronome, tuner, chord trainer, and more.",
                icon: Headphones,
              },
              {
                step: "03",
                title: "Play Real Songs",
                description:
                  "Apply what you've learned by playing 500+ songs with chord charts and strumming patterns.",
                icon: Music,
              },
            ].map(({ step, title, description, icon: Icon }, i) => (
              <motion.div
                key={step}
                variants={fadeUp}
                custom={i}
                className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <span className="absolute -top-4 left-6 rounded-full bg-amber-600 px-3 py-1 text-sm font-bold text-white">
                  {step}
                </span>
                <div className="mb-4 mt-2 inline-flex rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                  <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl"
            >
              Everything you need to learn guitar
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400"
            >
              Built by guitar players, for guitar players. No fluff, just a
              clear path from beginner to confident player.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: BookOpen,
                title: "Structured Lessons",
                description:
                  "Progressive grades from complete beginner to intermediate. Each lesson builds on the last.",
              },
              {
                icon: Wrench,
                title: "Practice Tools",
                description:
                  "Metronome, tuner, chord trainer, strumming patterns, and ear training — all built in.",
              },
              {
                icon: Music,
                title: "500+ Songs",
                description:
                  "Learn real songs with chord charts, strumming patterns, and play-along at your own tempo.",
              },
              {
                icon: Target,
                title: "Daily Practice",
                description:
                  "Auto-generated practice routines that focus on your weak spots and keep you progressing.",
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-4 inline-flex rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                  <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden border-t border-amber-700/20 bg-gradient-to-r from-amber-600 to-orange-600 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4"
        >
          {[
            { icon: BookOpen, value: "100+", label: "Video Lessons" },
            { icon: Music, value: "500+", label: "Songs" },
            { icon: Flame, value: "50K+", label: "Practice Sessions" },
            { icon: Award, value: "30+", label: "Badges to Earn" },
          ].map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <Icon className="mx-auto mb-3 h-8 w-8 text-amber-200" />
              <div className="text-4xl font-bold text-white">{value}</div>
              <div className="mt-1 text-sm font-medium text-amber-200">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-neutral-950">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl"
          >
            Ready to start your guitar journey?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
          >
            Join thousands of learners. No credit card required. Just pick up
            your guitar and let&apos;s go.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/signup"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-600/25 transition-all hover:bg-amber-700 hover:shadow-xl hover:shadow-amber-600/30"
            >
              Create Free Account
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-8 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-white">
            <Guitar className="h-5 w-5 text-amber-600" />
            GuitarApp
          </div>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link href="/lessons" className="hover:text-amber-600">
              Lessons
            </Link>
            <Link href="/chords" className="hover:text-amber-600">
              Chords
            </Link>
            <Link href="/songs" className="hover:text-amber-600">
              Songs
            </Link>
            <Link href="/practice" className="hover:text-amber-600">
              Practice
            </Link>
          </div>
          <div className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} GuitarApp
          </div>
        </div>
      </footer>
    </div>
  );
}
