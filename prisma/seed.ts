/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GuitarApp - Database Seed Script
 *
 * Seeds the database with:
 * - 3 Grades with 5 modules each (15 lessons total)
 * - 30 chords (beginner → advanced)
 * - 25 songs across multiple genres/difficulties
 * - 22 badges across 5 categories
 *
 * Usage:
 *   npx prisma db seed
 *   npx tsx prisma/seed.ts
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── Grades & Modules ──────────────────────────────────────────────────────────

const grades = [
  {
    number: 1,
    title: "Grade 1 — The Beginner's Journey",
    description:
      "Start here! Learn your first chords, basic strumming, and play simple songs within your first week. No prior experience needed.",
    modules: [
      {
        order: 1,
        title: "Getting Started: Your Guitar & Posture",
        description:
          "Learn to hold your guitar correctly, name the parts, and establish good habits from day one.",
        durationMinutes: 12,
        contentMarkdown:
          "# Getting Started\n\nBefore playing your first note, let's make sure you're set up for success.\n\n## Holding the Guitar\n\nSit upright with the guitar resting on your right thigh (left thigh for lefties). The neck should angle slightly upward at about 45 degrees. Keep your shoulders relaxed.\n\n## Parts of the Guitar\n\nFrom top to bottom: **headstock** (with tuning pegs), **nut**, **neck** with **frets**, **body** with the **sound hole**, and the **bridge**.\n\n## Your Fretting Hand\n\nPress strings with your fingertips, just behind (not on top of) the frets. Keep your thumb behind the neck for support. Curl your fingers so they don't mute adjacent strings.\n\n## Your Strumming Hand\n\nHold a pick between your thumb and index finger. Strum from the wrist, not the elbow. Keep your arm relaxed and let gravity help on downstrokes.",
        keyTakeaways: [
          "Proper sitting posture with guitar on right thigh",
          "Name the main parts: headstock, nut, neck, frets, body, bridge",
          "Fretting hand: fingertips behind frets, thumb behind neck",
          "Strumming hand: pick grip, strum from wrist",
        ],
        practiceChecklist: [
          "Hold guitar in correct position for 2 minutes",
          "Name all 6 strings (E A D G B E)",
          "Practice placing fingers on frets without buzzing",
          "Practice basic downstroke strumming on open strings",
        ],
        chordsIntroduced: [],
        chordProgression: null,
        bpm: 60,
      },
      {
        order: 2,
        title: "Your First Chords: A & D",
        description:
          "Learn two essential open chords that appear in hundreds of popular songs. Start switching between them.",
        durationMinutes: 15,
        contentMarkdown:
          "# Your First Chords: A & D\n\nThese two chords are the foundation of countless songs. Let's learn them properly.\n\n## A Major\n\nPlace your 1st, 2nd, and 3rd fingers on the 2nd fret of the D, G, and B strings. Strum from the A string (5th) down. The low E should be muted.\n\n## D Major\n\nPlace your 1st finger on the 2nd fret of the G string, 2nd finger on the 2nd fret of the high E string, and 3rd finger on the 3rd fret of the B string. Strum from the D string (4th) down.\n\n## Chord Changes\n\nThe key to smooth chord changes is the **One Minute Change** exercise. Set a timer, and switch between A and D as many times as you can in 60 seconds. Count each successful change. Aim for 30+ changes per minute.",
        keyTakeaways: [
          "A Major: 3 fingers on 2nd fret, strum from A string",
          "D Major: triangle shape starting from G string",
          "Practice One Minute Changes between A and D",
          "Aim for clean sound on every string",
        ],
        practiceChecklist: [
          "Play A Major chord clearly (no buzzing)",
          "Play D Major chord clearly",
          "One Minute Changes: A to D (aim for 20+)",
          "Strum A-D-A-D pattern with steady rhythm",
        ],
        chordsIntroduced: ["A", "D"],
        chordProgression: [
          { chord: "A", beats: 4 },
          { chord: "D", beats: 4 },
          { chord: "A", beats: 4 },
          { chord: "D", beats: 4 },
        ],
        bpm: 70,
      },
      {
        order: 3,
        title: "Adding E Major & Your First Song",
        description:
          "Learn E Major and combine all three chords to play your first complete song.",
        durationMinutes: 15,
        contentMarkdown:
          "# E Major & Your First Song\n\n## E Major\n\nPlace your 1st finger on the 1st fret of the G string, 2nd finger on the 2nd fret of the A string, and 3rd finger on the 2nd fret of the D string. Strum all 6 strings!\n\nE Major is the only beginner chord where you strum all 6 strings, giving it a full, rich sound.\n\n## Combining A, D & E\n\nThese three chords form a **I-IV-V progression** in the key of A — the most common chord progression in rock, blues, country, and pop.\n\n## Your First Song\n\nTry playing:\n```\n| A    | A    | D    | D    |\n| A    | A    | E    | E    |\n```\n\nStrum each chord 4 times with all downstrokes. This pattern works for dozens of songs!",
        keyTakeaways: [
          "E Major uses all 6 strings — the fullest beginner chord",
          "A, D, E form a I-IV-V progression",
          "Downstroke strumming on every beat",
          "First complete chord progression under your fingers",
        ],
        practiceChecklist: [
          "Play E Major chord clearly on all 6 strings",
          "One Minute Changes: A to E, D to E",
          "Play the A-D-A-E progression with steady timing",
          "Try strumming along with a metronome at 70 BPM",
        ],
        chordsIntroduced: ["E"],
        chordProgression: [
          { chord: "A", beats: 4 },
          { chord: "A", beats: 4 },
          { chord: "D", beats: 4 },
          { chord: "D", beats: 4 },
          { chord: "A", beats: 4 },
          { chord: "A", beats: 4 },
          { chord: "E", beats: 4 },
          { chord: "E", beats: 4 },
        ],
        bpm: 75,
      },
      {
        order: 4,
        title: "Minor Chords: Am & Em",
        description:
          "Discover the emotional sound of minor chords and learn how they contrast with major chords.",
        durationMinutes: 14,
        contentMarkdown:
          "# Minor Chords: Am & Em\n\nMinor chords have a sadder, moodier quality compared to bright major chords.\n\n## E Minor (Em)\n\nThe easiest chord on guitar! Place your 2nd finger on the 2nd fret of the A string and your 3rd finger on the 2nd fret of the D string. Strum all 6 strings.\n\nNotice it's just E Major with one finger removed.\n\n## A Minor (Am)\n\nPlace your 1st finger on the 1st fret of the B string, 2nd finger on the 2nd fret of the D string, and 3rd finger on the 2nd fret of the G string. Strum from the A string down.\n\nNotice the shape is similar to E Major but moved over one string.\n\n## Major vs. Minor\n\nPlay A Major, then A Minor. Hear the difference? That one-note change shifts the entire emotion. This contrast is the heart of music.",
        keyTakeaways: [
          "Em is the easiest chord — two fingers, all 6 strings",
          "Am is like E Major shifted over one string",
          "Minor chords sound sadder/moodier than major",
          "You now know 5 chords — enough for hundreds of songs",
        ],
        practiceChecklist: [
          "Play Em clearly on all 6 strings",
          "Play Am clearly from the A string",
          "One Minute Changes: Am to Em, Am to E, Am to D",
          "Play Am-Em-Am-Em progression with steady rhythm",
        ],
        chordsIntroduced: ["Em", "Am"],
        chordProgression: [
          { chord: "Am", beats: 4 },
          { chord: "Em", beats: 4 },
          { chord: "Am", beats: 4 },
          { chord: "Em", beats: 4 },
        ],
        bpm: 72,
      },
      {
        order: 5,
        title: "Strumming Patterns & Rhythm",
        description:
          "Move beyond all-downstrokes and learn your first up-down strumming patterns.",
        durationMinutes: 16,
        contentMarkdown:
          "# Strumming Patterns & Rhythm\n\nStrumming is what makes guitar playing sound like music rather than just chords.\n\n## The Down-Up Pattern\n\nThe most fundamental pattern: **D D U U D U** (Down Down Up Up Down Up). Count along: **1 2 & 3 & 4 &**.\n\nKeep your arm moving in a constant up-down motion like a pendulum. Sometimes you hit the strings, sometimes you miss on purpose.\n\n## The Folk Pattern\n\nAlso called the campfire strum: **D  D U  U D**. This waltz-like feel works perfectly for slower songs.\n\n## Practice Tips\n\n1. Start SLOW — use a metronome at 60 BPM\n2. Keep your strumming arm moving even during rests\n3. Practice the pattern on a single chord before adding changes\n4. Tap your foot on beats 1, 2, 3, 4",
        keyTakeaways: [
          "D DU UDU is the universal beginner strumming pattern",
          "Keep your arm moving like a pendulum constantly",
          "Start slow at 60 BPM and gradually increase",
          "Master the pattern on one chord before adding changes",
        ],
        practiceChecklist: [
          "Practice D DU UDU pattern on Em at 60 BPM",
          "Apply the pattern to an Am-Em chord change",
          "Try the folk strumming pattern on D-A",
          "Play a full verse: Am-G-C-Em with D DU UDU",
        ],
        chordsIntroduced: [],
        chordProgression: [
          { chord: "Am", beats: 4 },
          { chord: "G", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "Em", beats: 4 },
        ],
        bpm: 80,
      },
    ],
  },
  {
    number: 2,
    title: "Grade 2 — Building Confidence",
    description:
      "Expand your chord vocabulary, learn the pentatonic scale, and tackle more complex strumming patterns. You'll be playing real songs with confidence.",
    modules: [
      {
        order: 1,
        title: "C Major & G Major — The Power Pair",
        description:
          "Learn two more essential chords and the most popular chord progression in pop music.",
        durationMinutes: 18,
        contentMarkdown:
          "# C Major & G Major\n\n## C Major\n\nOne of the most important chords in all of music. Place your 1st finger on the 1st fret of the B string, 2nd finger on the 2nd fret of the D string, and 3rd finger on the 3rd fret of the A string. Strum from the A string down.\n\nThe stretch to the 3rd fret can be tough at first — that's normal!\n\n## G Major\n\nPlace your 2nd finger on the 3rd fret of the low E string, 1st finger on the 2nd fret of the A string, and 3rd finger on the 3rd fret of the high E string. Strum all 6 strings.\n\n## The G-C-D Progression\n\nThese three chords form a I-IV-V in the key of G. This progression powers countless pop and rock songs:\n```\n| G    | C    | G    | D    |\n```",
        keyTakeaways: [
          "C Major: anchor your 3rd finger on the 3rd fret of A string",
          "G Major: spans across all 6 strings for a full sound",
          "G-C-D is the most common pop chord progression",
          "Practice the stretch between 1st and 3rd frets",
        ],
        practiceChecklist: [
          "Play C Major clearly (no buzz on B or high E)",
          "Play G Major clearly on all 6 strings",
          "One Minute Changes: G to C, C to D, G to D",
          "Play G-C-G-D progression with D DU UDU pattern",
        ],
        chordsIntroduced: ["C", "G"],
        chordProgression: [
          { chord: "G", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "G", beats: 4 },
          { chord: "D", beats: 4 },
        ],
        bpm: 85,
      },
      {
        order: 2,
        title: "Dm, F (Easy), and Minor Progressions",
        description:
          "Learn D minor, an easy version of F, and explore the emotional world of minor key songs.",
        durationMinutes: 16,
        contentMarkdown:
          "# Dm, F (Easy), and Minor Progressions\n\n## D Minor (Dm)\n\nPlace your 1st finger on the 1st fret of the high E string, 2nd finger on the 2nd fret of the G string, and 3rd finger on the 3rd fret of the B string. Strum from the D string down.\n\n## F Major (Easy Version)\n\nThe full F barre chord is a challenge for later. For now, play Fmaj7: 1st finger barring the 1st fret of the B and high E strings, 2nd finger on the 2nd fret of the G string, and 3rd finger on the 3rd fret of the D string.\n\n## Minor Progressions\n\nTry this haunting progression:\n```\n| Am   | F    | C    | G    |\n```\nThis is the famous \"Axis of Awesome\" progression used in dozens of hit songs!",
        keyTakeaways: [
          "Dm: triangle shape from the 1st fret of high E",
          "Fmaj7 is a great stepping stone to the full F barre chord",
          "Am-F-C-G appears in countless pop hits",
          "Minor key songs convey sadness, longing, intensity",
        ],
        practiceChecklist: [
          "Play Dm clearly from the D string down",
          "Play Fmaj7 with a clean mini-barre on B and E",
          "One Minute Changes: Am to F, C to Dm",
          "Play Am-F-C-G progression at 80 BPM",
        ],
        chordsIntroduced: ["Dm", "Fmaj7"],
        chordProgression: [
          { chord: "Am", beats: 4 },
          { chord: "F", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "G", beats: 4 },
        ],
        bpm: 80,
      },
      {
        order: 3,
        title: "The Pentatonic Scale — Your First Solo",
        description:
          "Learn the minor pentatonic scale pattern and play your first guitar solo.",
        durationMinutes: 20,
        contentMarkdown:
          "# The Minor Pentatonic Scale\n\nThe pentatonic scale is the foundation of rock, blues, and pop solos. It uses just 5 notes and sounds great over almost anything.\n\n## Pattern 1 (A Minor Pentatonic)\n\n```\ne|---5---8---\nB|---5---8---\nG|---5---7---\nD|---5---7---\nA|---5---7---\nE|---5---8---\n```\n\n## How to Practice\n\n1. Play each note individually, ascending then descending\n2. Use alternate picking (down-up-down-up)\n3. Start at 60 BPM, increase by 5 BPM when comfortable\n4. Try bending the notes on the G string for a bluesy feel\n\n## Your First Lick\n\nTry this classic blues lick:\n```\ne|----------\nB|---8b10---\nG|---7------\nD|----------\n```\nBend the 8th fret of B string up a whole step!",
        keyTakeaways: [
          "The minor pentatonic uses 5 notes in a box pattern",
          "Pattern 1 is the most common starting position",
          "Alternate picking: down-up-down-up for speed",
          "Bends add expression and emotion to your playing",
        ],
        practiceChecklist: [
          "Play the A minor pentatonic ascending and descending",
          "Practice with alternate picking at 60 BPM",
          "Try bending on the G and B strings",
          "Play the blues lick 10 times cleanly",
        ],
        chordsIntroduced: [],
        chordProgression: [
          { chord: "Am", beats: 4 },
          { chord: "Am", beats: 4 },
          { chord: "Am", beats: 4 },
          { chord: "Am", beats: 4 },
        ],
        bpm: 70,
      },
      {
        order: 4,
        title: "Fingerpicking Basics",
        description:
          "Put down the pick and learn fingerpicking patterns that add beauty and subtlety to your playing.",
        durationMinutes: 18,
        contentMarkdown:
          "# Fingerpicking Basics\n\nFingerpicking opens up a whole new world of guitar sound. Instead of strumming all strings at once, you pluck individual strings with your fingers.\n\n## Finger Assignment\n\n- **Thumb (p)**: Covers E, A, D strings\n- **Index (i)**: G string\n- **Middle (m)**: B string\n- **Ring (a)**: high E string\n\n## Pattern 1: The Travis Pick\n\nThe most important fingerpicking pattern:\n```\nThumb - Index - Thumb - Middle - Thumb - Index - Thumb - Ring\np     - i     - p     - m     - p     - i     - p     - a\n```\n\nStart on a simple Em chord and let each note ring.\n\n## Pattern 2: Arpeggios\n\nSimply pluck strings in order: p-i-m-a (bass to treble), then a-m-i-p (treble to bass). This creates beautiful cascading sounds.",
        keyTakeaways: [
          "Thumb handles the bass strings (E, A, D)",
          "Index, middle, ring handle G, B, high E",
          "The Travis pick is the foundation pattern",
          "Let notes ring out — don't lift fingers too early",
        ],
        practiceChecklist: [
          "Practice p-i-m-a arpeggio on Em chord",
          "Learn the Travis picking pattern at slow tempo",
          "Apply Travis pick to C and G chords",
          "Play a fingerpicked Am-Em progression",
        ],
        chordsIntroduced: [],
        chordProgression: [
          { chord: "Em", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "G", beats: 4 },
          { chord: "Am", beats: 4 },
        ],
        bpm: 65,
      },
      {
        order: 5,
        title: "Putting It All Together — Song Medley",
        description:
          "Combine everything from Grades 1 and 2 to play a medley of songs with different techniques.",
        durationMinutes: 22,
        contentMarkdown:
          "# Putting It All Together\n\nYou now have a solid foundation. Let's put all your skills together.\n\n## Your Chord Vocabulary\n\nYou know: A, D, E, Em, Am, C, G, Dm, Fmaj7 — that's 9 chords! With these chords, you can play literally thousands of songs.\n\n## Techniques You've Learned\n\n- Strumming patterns (downstrokes, D DU UDU, folk)\n- Basic fingerpicking (Travis pick, arpeggios)\n- The minor pentatonic scale\n- Chord changes at tempo\n\n## Challenge: The 4-Song Medley\n\nPlay each progression for 8 bars:\n1. **Rock**: A - D - E - A (all downstrokes, 100 BPM)\n2. **Pop**: G - C - Em - D (D DU UDU, 90 BPM)\n3. **Folk**: Am - F - C - G (fingerpicked, 70 BPM)\n4. **Blues**: Am pentatonic solo over Am - Dm - Am - E (free tempo)\n\nTransition between each without stopping!",
        keyTakeaways: [
          "9 chords unlocks thousands of songs",
          "Different techniques suit different genres",
          "Smooth transitions between songs build performance skills",
          "You're ready for Grade 3 and intermediate territory",
        ],
        practiceChecklist: [
          "Play the 4-song medley without stopping",
          "Record yourself and listen back",
          "Identify which chord changes still need work",
          "Practice your weakest changes for 5 minutes each",
        ],
        chordsIntroduced: [],
        chordProgression: [
          { chord: "A", beats: 4 },
          { chord: "D", beats: 4 },
          { chord: "E", beats: 4 },
          { chord: "A", beats: 4 },
          { chord: "G", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "Em", beats: 4 },
          { chord: "D", beats: 4 },
        ],
        bpm: 90,
      },
    ],
  },
  {
    number: 3,
    title: "Grade 3 — The Intermediate Leap",
    description:
      "Take on barre chords, 7th chords, and more advanced techniques. Start sounding like a real guitarist with power chords, palm muting, and beyond.",
    modules: [
      {
        order: 1,
        title: "The F Barre Chord — Conquering the Beast",
        description:
          "The full F barre chord is every guitarist's rite of passage. Master it here with proven techniques.",
        durationMinutes: 20,
        contentMarkdown:
          "# The F Barre Chord\n\nThe F barre chord is famously difficult — but once you master it, you unlock every chord on the fretboard.\n\n## The Shape\n\nLay your 1st finger flat across all 6 strings at the 1st fret. Then add:\n- 2nd finger: 2nd fret, G string\n- 3rd finger: 3rd fret, A string\n- 4th finger: 3rd fret, D string\n\n## Tips for Success\n\n1. **Roll your index finger slightly** onto its side (toward the nut). The bony edge creates a better bar.\n2. **Place your thumb directly behind your index finger** on the back of the neck.\n3. **Start with just the barre** — get all 6 strings ringing before adding other fingers.\n4. **Build strength gradually** — your hand WILL get tired. Take breaks.\n5. **Check each string individually** — find and fix any buzzing.\n\n## The Moveable Shape\n\nHere's the magic: move the F shape up the neck and you get:\n- 1st fret: F Major\n- 3rd fret: G Major\n- 5th fret: A Major\n- 7th fret: B Major\n\nOne shape, every major chord!",
        keyTakeaways: [
          "F barre chord unlocks every major chord on the neck",
          "Roll index finger onto its side for cleaner barre",
          "Thumb placement behind the barre is critical",
          "Build strength gradually — take breaks when hand tires",
        ],
        practiceChecklist: [
          "Hold F barre chord and check each string rings clearly",
          "Switch between F and C 20 times slowly",
          "Move the F shape to 3rd fret (G) and 5th fret (A)",
          "Play F-C-G-Am progression with barre F",
        ],
        chordsIntroduced: ["F"],
        chordProgression: [
          { chord: "F", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "G", beats: 4 },
          { chord: "Am", beats: 4 },
        ],
        bpm: 75,
      },
      {
        order: 2,
        title: "Power Chords & Palm Muting",
        description:
          "Learn the backbone of rock and punk guitar — power chords with palm muting for that driving, aggressive sound.",
        durationMinutes: 16,
        contentMarkdown:
          "# Power Chords & Palm Muting\n\nPower chords are neither major nor minor — they're pure energy.\n\n## The Power Chord Shape\n\nJust two notes:\n- Root note (1st finger) on the E or A string\n- Fifth (3rd or 4th finger) two frets up, one string higher\n\nExample: G5 power chord\n- 1st finger: 3rd fret, low E\n- 3rd finger: 5th fret, A string\n\n## Palm Muting\n\nRest the fleshy part of your strumming hand (pinky side) lightly on the strings near the bridge. This creates a chunky, muted sound. The closer to the bridge, the less muted; closer to the neck, more muted.\n\n## The Classic Rock Riff\n\n```\n|: G5  G5  | C5  C5  | D5  D5  | G5  G5  :|\n```\nPlay with palm muting on verses and open (unmuted) on choruses. Instant rock song!",
        keyTakeaways: [
          "Power chords use only root and fifth — no major/minor",
          "Two-note shape is moveable anywhere on the neck",
          "Palm muting adds chunk and control to your sound",
          "Alternate between muted and open for dynamics",
        ],
        practiceChecklist: [
          "Play G5, A5, C5, D5 power chords cleanly",
          "Practice palm muting at various positions near the bridge",
          "Play the G5-C5-D5-G5 riff with palm muting",
          "Try accenting beats 2 and 4 with harder strums",
        ],
        chordsIntroduced: ["G5", "A5", "C5", "D5"],
        chordProgression: [
          { chord: "G5", beats: 4 },
          { chord: "G5", beats: 4 },
          { chord: "C5", beats: 4 },
          { chord: "C5", beats: 4 },
          { chord: "D5", beats: 4 },
          { chord: "D5", beats: 4 },
          { chord: "G5", beats: 4 },
          { chord: "G5", beats: 4 },
        ],
        bpm: 110,
      },
      {
        order: 3,
        title: "7th Chords — Adding Color",
        description:
          "Learn dominant 7th and minor 7th chords that add jazz, blues, and soul to your playing.",
        durationMinutes: 18,
        contentMarkdown:
          "# 7th Chords — Adding Color\n\n7th chords add an extra note that creates tension, sophistication, and a bluesy feel.\n\n## Dominant 7th Chords\n\n**A7**: Like A Major, but lift your 3rd finger. The open G string adds the 7th.\n\n**E7**: Like E Major, but lift your 3rd finger. The open D string adds the 7th.\n\n**B7**: 2nd finger on 2nd fret of A, 1st finger on 1st fret of D, 3rd finger on 2nd fret of G, 4th finger on 2nd fret of high E. Strum from A string.\n\n## Minor 7th Chords\n\n**Am7**: Like Am, but lift your 3rd finger from the G string. Simpler and jazzier.\n\n**Em7**: Like Em, but lift your 2nd finger. Just ONE finger on the 2nd fret of A!\n\n## The 12-Bar Blues\n\n```\n| A7   | A7   | A7   | A7   |\n| D7   | D7   | A7   | A7   |\n| E7   | D7   | A7   | E7   |\n```\nThis is THE blues progression. Shuffle strumming optional!",
        keyTakeaways: [
          "7th chords add one note for a bluesy, jazzy color",
          "A7 and E7 are simplified versions of A and E Major",
          "The 12-bar blues is the foundation of blues and rock",
          "Shuffle rhythm makes the blues groove swing",
        ],
        practiceChecklist: [
          "Play A7, E7, D7, B7, Am7, Em7 clearly",
          "One Minute Changes between 7th chords",
          "Play the 12-bar blues in A at 90 BPM",
          "Try adding a shuffle rhythm to the blues progression",
        ],
        chordsIntroduced: ["A7", "E7", "D7", "B7", "Am7", "Em7"],
        chordProgression: [
          { chord: "A7", beats: 4 },
          { chord: "A7", beats: 4 },
          { chord: "A7", beats: 4 },
          { chord: "A7", beats: 4 },
          { chord: "D7", beats: 4 },
          { chord: "D7", beats: 4 },
          { chord: "A7", beats: 4 },
          { chord: "A7", beats: 4 },
          { chord: "E7", beats: 4 },
          { chord: "D7", beats: 4 },
          { chord: "A7", beats: 4 },
          { chord: "E7", beats: 4 },
        ],
        bpm: 90,
      },
      {
        order: 4,
        title: "Barre Chord Variations & the CAGED System",
        description:
          "Unlock the fretboard with the CAGED system and learn minor barre chords.",
        durationMinutes: 22,
        contentMarkdown:
          "# The CAGED System\n\nThe CAGED system shows how 5 open chord shapes (C, A, G, E, D) connect across the entire fretboard.\n\n## Minor Barre Chords\n\nThe Em shape moved up gives minor barre chords:\n- **Fm**: Barre at 1st fret + Em shape = F minor\n- **Gm**: Barre at 3rd fret + Em shape = G minor\n- **Bm**: Barre at 2nd fret + Am shape = B minor\n\n## The CAGED Concept\n\nEvery chord can be played in 5 positions using the C-A-G-E-D shapes:\n- C shape at open = C Major\n- A shape at 3rd fret = C Major\n- G shape at 5th fret = C Major\n- E shape at 8th fret = C Major\n- D shape at 10th fret = C Major\n\nSame chord, 5 positions! This is how you truly learn the fretboard.\n\n## Practical Application\n\nFor now, focus on the E-shape and A-shape barre chords. These two shapes cover every major and minor chord.",
        keyTakeaways: [
          "CAGED: 5 open shapes connect across the fretboard",
          "E-shape barre chords: major and minor versions",
          "A-shape barre chords: major and minor versions",
          "Any chord can be played in at least 5 positions",
        ],
        practiceChecklist: [
          "Play Bm using A-shape barre chord",
          "Play Fm and Gm using E-shape barre chord",
          "Move a major barre chord chromatically up the neck",
          "Play Am-Dm-Bm-E progression using barre chords",
        ],
        chordsIntroduced: ["Bm", "Fm"],
        chordProgression: [
          { chord: "Am", beats: 4 },
          { chord: "Dm", beats: 4 },
          { chord: "Bm", beats: 4 },
          { chord: "E", beats: 4 },
        ],
        bpm: 85,
      },
      {
        order: 5,
        title: "Intermediate Song Workshop",
        description:
          "Apply all your intermediate skills to play challenging, rewarding songs with advanced techniques.",
        durationMinutes: 25,
        contentMarkdown:
          "# Intermediate Song Workshop\n\nCongratulations — you've reached the intermediate level! Let's put everything together.\n\n## Your Complete Toolkit\n\n- **Open chords**: A, D, E, Em, Am, C, G, Dm, Fmaj7\n- **Barre chords**: F, Bm, Fm, plus moveable shapes\n- **Power chords**: G5, A5, C5, D5\n- **7th chords**: A7, E7, D7, B7, Am7, Em7\n- **Techniques**: Strumming, fingerpicking, palm muting, bends, pentatonic scale\n\n## Challenge Songs\n\n### Acoustic Ballad\n```\n| Am   | F    | C    | G    |\n| Am   | F    | C    | Em   |\n```\nFingerpick the verse, strum the chorus.\n\n### Rock Song\n```\nVerse (palm muted): | G5  | C5  | D5  | G5  |\nChorus (open):      | G   | C   | Em  | D   |\n```\n\n### Blues in A\n```\n| A7   | D7   | A7   | A7   |\n| D7   | D7   | A7   | A7   |\n| E7   | D7   | A7   | E7   |\n```\nAdd pentatonic licks between phrases!\n\n## What's Next?\n\nYou have a solid intermediate foundation. Keep exploring new songs, techniques, and styles. The journey never stops!",
        keyTakeaways: [
          "You now have 20+ chords and multiple techniques",
          "Mixing techniques within songs adds dynamics",
          "Fingerpicking for verses, strumming for choruses is classic",
          "Keep learning songs — that's how you truly improve",
        ],
        practiceChecklist: [
          "Play all three challenge songs start to finish",
          "Add pentatonic fills between chord changes in the blues",
          "Record yourself playing and compare to last month",
          "Pick 3 favorite songs and learn them fully",
        ],
        chordsIntroduced: [],
        chordProgression: [
          { chord: "Am", beats: 4 },
          { chord: "F", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "G", beats: 4 },
          { chord: "Am", beats: 4 },
          { chord: "F", beats: 4 },
          { chord: "C", beats: 4 },
          { chord: "Em", beats: 4 },
        ],
        bpm: 88,
      },
    ],
  },
];

// ─── Chords ──────────────────────────────────────────────────────────────────

const chords: any[] = [
  // BEGINNER - Open Chords
  {
    name: "A Major",
    shortName: "A",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, 0, 2, 2, 2, 0],
      fingers: [0, 0, 1, 2, 3, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "Keep your fingers arched so the open high E string rings clearly. All three fingers sit on the 2nd fret — try to keep them close together. Strum from the A string (5th) down, avoiding the low E.",
    commonSongs: [
      "Horse With No Name",
      "Three Little Birds",
      "Knockin' on Heaven's Door",
    ],
  },
  {
    name: "D Major",
    shortName: "D",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, -1, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
      baseFret: 1,
      barres: [],
      muted: [true, true, false, false, false, false],
    },
    tips: "The D chord forms a triangle shape. Make sure your 3rd finger on the 3rd fret of the B string doesn't accidentally mute the high E string. Only strum the thinnest 4 strings.",
    commonSongs: ["Sweet Home Alabama", "Brown Eyed Girl", "Let It Be"],
  },
  {
    name: "E Major",
    shortName: "E",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [],
    },
    tips: "E Major is one of the fullest sounding open chords because you strum all 6 strings. Keep your 1st finger close to the 1st fret wire for a clean sound.",
    commonSongs: [
      "Back in Black",
      "Sunshine of Your Love",
      "Purple Haze",
    ],
  },
  {
    name: "E Minor",
    shortName: "Em",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [],
    },
    tips: "The easiest chord on guitar! Just two fingers on the 2nd fret of the A and D strings. Strum all 6 strings. Great for building confidence with a full sound.",
    commonSongs: ["Wish You Were Here", "Nothing Else Matters", "Hey Ya"],
  },
  {
    name: "A Minor",
    shortName: "Am",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "A Minor is similar to E Major but shifted over one string. Keep your 1st finger arched so the open high E string can ring. Strum from the A string down.",
    commonSongs: ["Stairway to Heaven", "House of the Rising Sun", "Zombie"],
  },
  {
    name: "C Major",
    shortName: "C",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "The stretch to the 3rd fret on the A string can be challenging. Press with your fingertip and keep your thumb behind the neck. Make sure the open G and high E strings ring clearly.",
    commonSongs: [
      "Let It Be",
      "No Woman No Cry",
      "Imagine",
    ],
  },
  {
    name: "G Major",
    shortName: "G",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
      baseFret: 1,
      barres: [],
      muted: [],
    },
    tips: "G Major uses all 6 strings for a big, full sound. The stretch between the 3rd fret of the low E and the 3rd fret of the high E takes practice. Some players use fingers 2-1 on the bass side and pinky on the high E.",
    commonSongs: ["Wonderwall", "Sweet Child O' Mine", "Country Roads"],
  },
  {
    name: "D Minor",
    shortName: "Dm",
    type: "OPEN",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, -1, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      baseFret: 1,
      barres: [],
      muted: [true, true, false, false, false, false],
    },
    tips: "D Minor has a melancholy sound. Make sure your 1st finger on the 1st fret of the high E is right behind the fret wire. Only strum the top 4 strings.",
    commonSongs: ["Losing My Religion", "Scarborough Fair", "Hotel California"],
  },
  // INTERMEDIATE
  {
    name: "F Major (easy)",
    shortName: "Fmaj7",
    type: "OPEN",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, -1, 3, 2, 1, 1],
      fingers: [0, 0, 3, 2, 1, 1],
      baseFret: 1,
      barres: [{ fromString: 4, toString: 5, fret: 1 }],
      muted: [true, true, false, false, false, false],
    },
    tips: "This Fmaj7 voicing is a great stepping stone to the full F barre chord. Mini-barre the 1st fret on the B and high E strings with your index finger laid flat.",
    commonSongs: ["Have You Ever Seen the Rain", "Riptide", "Hey There Delilah"],
  },
  {
    name: "F Major",
    shortName: "F",
    type: "BARRE",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [1, 1, 2, 3, 3, 1],
      fingers: [1, 1, 2, 3, 4, 1],
      baseFret: 1,
      barres: [{ fromString: 0, toString: 5, fret: 1 }],
      muted: [],
    },
    tips: "The F barre chord is every guitarist's rite of passage. Roll your index finger slightly onto its bony side. Place your thumb directly behind your index finger. Check each string individually and fix any buzzing.",
    commonSongs: ["No Woman No Cry", "Stand By Me", "Creep"],
  },
  {
    name: "B Minor",
    shortName: "Bm",
    type: "BARRE",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, 2, 4, 4, 3, 2],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 1,
      barres: [{ fromString: 1, toString: 5, fret: 2 }],
      muted: [true, false, false, false, false, false],
    },
    tips: "B Minor uses the Am barre shape at the 2nd fret. Barre from the A string to the high E. Your 3rd and 4th fingers handle the 4th fret on D and G strings.",
    commonSongs: ["Hotel California", "Creep", "Someone Like You"],
  },
  {
    name: "F Minor",
    shortName: "Fm",
    type: "BARRE",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [1, 1, 1, 3, 3, 1],
      fingers: [1, 1, 1, 3, 4, 1],
      baseFret: 1,
      barres: [{ fromString: 0, toString: 5, fret: 1 }],
      muted: [],
    },
    tips: "F Minor is the Em barre shape at the 1st fret. Barre all 6 strings, then add your 3rd and 4th fingers on the A and D strings at the 3rd fret.",
    commonSongs: ["Ain't No Sunshine", "Creep", "Radioactive"],
  },
  {
    name: "A7",
    shortName: "A7",
    type: "SEVENTH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, 0, 2, 0, 2, 0],
      fingers: [0, 0, 2, 0, 1, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "A7 is an easy modification of A Major — just lift your 3rd finger off the G string. The open G creates the dominant 7th sound. Very bluesy!",
    commonSongs: ["Hey Jude", "Brown Sugar", "Red House"],
  },
  {
    name: "E7",
    shortName: "E7",
    type: "SEVENTH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [0, 2, 0, 1, 0, 0],
      fingers: [0, 2, 0, 1, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [],
    },
    tips: "E7 is E Major with your 3rd finger removed. The open D string adds the 7th. Great for blues turnarounds and adding tension before resolving to A.",
    commonSongs: ["Purple Haze", "Red House", "Folsom Prison Blues"],
  },
  {
    name: "D7",
    shortName: "D7",
    type: "SEVENTH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, -1, 0, 2, 1, 2],
      fingers: [0, 0, 0, 2, 1, 3],
      baseFret: 1,
      barres: [],
      muted: [true, true, false, false, false, false],
    },
    tips: "D7 replaces D Major's 3rd finger position. The 1st fret on the B string creates the bluesy 7th sound. Strum only the top 4 strings.",
    commonSongs: ["Hey Jude", "Redemption Song", "Let It Be"],
  },
  {
    name: "B7",
    shortName: "B7",
    type: "SEVENTH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, 2, 1, 2, 0, 2],
      fingers: [0, 2, 1, 3, 0, 4],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "B7 is a four-finger chord that can be tricky. Focus on getting each string to ring cleanly. It's essential for blues in the key of E.",
    commonSongs: ["Twist and Shout", "I Saw Her Standing There", "La Bamba"],
  },
  {
    name: "Am7",
    shortName: "Am7",
    type: "MINOR_SEVENTH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, 0, 2, 0, 1, 0],
      fingers: [0, 0, 2, 0, 1, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "Am7 is Am with the 3rd finger lifted. The open G string creates a jazzy, laid-back sound. Only two fingers needed!",
    commonSongs: ["Stairway to Heaven", "Wish You Were Here", "Fast Car"],
  },
  {
    name: "Em7",
    shortName: "Em7",
    type: "MINOR_SEVENTH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [0, 2, 0, 0, 0, 0],
      fingers: [0, 2, 0, 0, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [],
    },
    tips: "Possibly the easiest chord on guitar — just ONE finger on the 2nd fret of the A string. All other strings are open. Has a dreamy, ethereal quality.",
    commonSongs: ["Wonderwall", "Wish You Were Here", "Dust in the Wind"],
  },
  // ADVANCED / Power Chords
  {
    name: "G Power",
    shortName: "G5",
    type: "POWER",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [3, 5, 5, -1, -1, -1],
      fingers: [1, 3, 4, 0, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [false, false, false, true, true, true],
    },
    tips: "Power chords are neither major nor minor. Play only the lowest 2-3 strings. Use your strumming hand to mute the higher strings by resting lightly on them.",
    commonSongs: ["Smells Like Teen Spirit", "Smoke on the Water", "Iron Man"],
  },
  {
    name: "A Power",
    shortName: "A5",
    type: "POWER",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, 0, 2, 2, -1, -1],
      fingers: [0, 0, 1, 3, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, true, true],
    },
    tips: "A5 is rooted on the open A string. Add the 2nd fret of D and G for the full power chord. Great for punk and rock riffs.",
    commonSongs: ["Back in Black", "Highway to Hell", "Blitzkrieg Bop"],
  },
  {
    name: "C Power",
    shortName: "C5",
    type: "POWER",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, 3, 5, 5, -1, -1],
      fingers: [0, 1, 3, 4, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, true, true],
    },
    tips: "C5 uses the same power chord shape as G5 but rooted on the A string at the 3rd fret. Moveable shape — slide it anywhere.",
    commonSongs: ["Smells Like Teen Spirit", "American Idiot", "Basket Case"],
  },
  {
    name: "D Power",
    shortName: "D5",
    type: "POWER",
    difficulty: "BEGINNER",
    fretboardData: {
      strings: [-1, 5, 7, 7, -1, -1],
      fingers: [0, 1, 3, 4, 0, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, true, true],
    },
    tips: "D5 on the A string at the 5th fret. Same shape as C5 and G5 but two frets higher. Part of the fundamental rock power chord trio.",
    commonSongs: ["You Really Got Me", "Whole Lotta Love", "Paranoid"],
  },
  // More advanced chords
  {
    name: "Cadd9",
    shortName: "Cadd9",
    type: "ADD",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, 3, 2, 0, 3, 0],
      fingers: [0, 2, 1, 0, 3, 0],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "Cadd9 is a beautiful variation of C Major. The open D string (9th) and open high E create a shimmery, open sound. Very common in modern acoustic music.",
    commonSongs: ["Wonderwall", "Good Riddance", "Free Fallin'"],
  },
  {
    name: "Dsus2",
    shortName: "Dsus2",
    type: "SUSPENDED",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, -1, 0, 2, 3, 0],
      fingers: [0, 0, 0, 1, 3, 0],
      baseFret: 1,
      barres: [],
      muted: [true, true, false, false, false, false],
    },
    tips: "Dsus2 removes the major 3rd from D and replaces it with the 2nd (open high E). Creates a dreamy, unresolved sound. Great for arpeggiated passages.",
    commonSongs: ["Crazy Little Thing Called Love", "Behind Blue Eyes", "More Than Words"],
  },
  {
    name: "Dsus4",
    shortName: "Dsus4",
    type: "SUSPENDED",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, -1, 0, 2, 3, 3],
      fingers: [0, 0, 0, 1, 2, 3],
      baseFret: 1,
      barres: [],
      muted: [true, true, false, false, false, false],
    },
    tips: "Dsus4 adds your pinky to the 3rd fret of the high E. Creates tension that wants to resolve back to D Major. Try alternating D → Dsus4 → D for a classic sound.",
    commonSongs: ["Crazy Little Thing Called Love", "Pinball Wizard", "Summer of '69"],
  },
  {
    name: "G/B",
    shortName: "G/B",
    type: "SLASH",
    difficulty: "INTERMEDIATE",
    fretboardData: {
      strings: [-1, 2, 0, 0, 0, 3],
      fingers: [0, 1, 0, 0, 0, 3],
      baseFret: 1,
      barres: [],
      muted: [true, false, false, false, false, false],
    },
    tips: "G/B is a G chord with B as the bass note. It creates a smooth bass line when moving from C to G/B to Am. Only two fingers needed!",
    commonSongs: ["More Than Words", "Dust in the Wind", "Landslide"],
  },
  {
    name: "E Minor 7th (Barre)",
    shortName: "Cm",
    type: "BARRE",
    difficulty: "ADVANCED",
    fretboardData: {
      strings: [-1, 3, 5, 5, 4, 3],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 1,
      barres: [{ fromString: 1, toString: 5, fret: 3 }],
      muted: [true, false, false, false, false, false],
    },
    tips: "C Minor uses the Am barre shape at the 3rd fret. Barre from the A string to the high E at the 3rd fret, then add fingers for the minor shape above.",
    commonSongs: ["Black", "Mad World", "Hallelujah"],
  },
  {
    name: "B Major (Barre)",
    shortName: "B",
    type: "BARRE",
    difficulty: "ADVANCED",
    fretboardData: {
      strings: [-1, 2, 4, 4, 4, 2],
      fingers: [0, 1, 2, 3, 4, 1],
      baseFret: 1,
      barres: [{ fromString: 1, toString: 5, fret: 2 }],
      muted: [true, false, false, false, false, false],
    },
    tips: "B Major uses the A barre shape at the 2nd fret. It's a challenging chord that requires squeezing three fingers into the 4th fret. Take your time building strength.",
    commonSongs: ["Sweet Child O' Mine", "Faith", "Every Breath You Take"],
  },
];

// ─── Songs ──────────────────────────────────────────────────────────────────

const songs: any[] = [
  {
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    genre: "FOLK",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 68,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["G", "D", "Am", "C"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[G]Mama take this [D]badge off of [Am]me\n[G]I can't [D]use it [C]anymore\n[G]It's getting [D]dark, too [Am]dark to see\n[G]I feel I'm [D]knockin' on [C]heaven's door\n\n[G]Knock knock [D]knockin' on [Am]heaven's door\n[G]Knock knock [D]knockin' on [C]heaven's door",
    simplifiedChords:
      "[G]Mama take this [D]badge off of [Am]me\n[G]I can't [D]use it [C]anymore",
    spotifyUrl: "https://open.spotify.com/track/example1",
    youtubeUrl: "https://youtube.com/watch?v=2byQEjsb0gg",
  },
  {
    title: "Wonderwall",
    artist: "Oasis",
    genre: "ROCK",
    difficulty: "BEGINNER",
    decade: "1990s",
    bpm: 87,
    key: "F# Minor",
    capoFret: 2,
    timeSignature: "4/4",
    chordsUsed: ["Em7", "G", "Dsus4", "A7"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[Em7]Today is [G]gonna be the day that they're\n[Dsus4]Gonna throw it back to [A7]you\n[Em7]By now you [G]should've somehow\n[Dsus4]Realized what you gotta [A7]do\n[Em7]I don't believe that [G]anybody\n[Dsus4]Feels the way I [A7]do\nAbout you [C]now [D] [Em7]",
    simplifiedChords:
      "[Em]Today is [G]gonna be the day that they're\n[D]Gonna throw it back to [A]you",
    spotifyUrl: "https://open.spotify.com/track/example2",
    youtubeUrl: "https://youtube.com/watch?v=6hzrDeceEKc",
  },
  {
    title: "Horse With No Name",
    artist: "America",
    genre: "FOLK",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 120,
    key: "E Minor",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["Em", "D"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[Em]On the first part of the [D]journey\n[Em]I was looking at all the [D]life\n[Em]There were plants and birds and [D]rocks and things\n[Em]There was sand and hills and [D]rings",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example3",
    youtubeUrl: "https://youtube.com/watch?v=na47wMFfQCo",
  },
  {
    title: "Three Little Birds",
    artist: "Bob Marley",
    genre: "REGGAE",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 76,
    key: "A Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["A", "D", "E"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[A]Don't worry about a thing\n[A]'Cause every little thing gonna be all [D]right\nSingin' [A]don't worry about a thing\n[A]'Cause every little thing gonna be all [E]right [D] [A]",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example4",
    youtubeUrl: "https://youtube.com/watch?v=zaGUr6wButE",
  },
  {
    title: "Love Me Do",
    artist: "The Beatles",
    genre: "POP",
    difficulty: "BEGINNER",
    decade: "1960s",
    bpm: 148,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["G", "C", "D"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[G]Love, love me [C]do\nYou [G]know I love [C]you\nI'll [G]always be [C]true\nSo [C]please, love me [G]do",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example5",
    youtubeUrl: "https://youtube.com/watch?v=0SZcGtj-LJQ",
  },
  {
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    genre: "CLASSIC_ROCK",
    difficulty: "INTERMEDIATE",
    decade: "1970s",
    bpm: 120,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["Em", "G", "A7", "Am", "C", "D"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[C]So, so you think you can [D]tell\nHeaven from [Am]hell, blue skies from [G]pain\nCan you tell a green [D]field from a cold steel [C]rail?\nA smile from a [Am]veil? Do you think you can [G]tell?",
    simplifiedChords:
      "[C]So, so you think you can [D]tell\nHeaven from [Am]hell, blue skies from [G]pain",
    spotifyUrl: "https://open.spotify.com/track/example6",
    youtubeUrl: "https://youtube.com/watch?v=IXdNnw99-Ic",
  },
  {
    title: "Stand By Me",
    artist: "Ben E. King",
    genre: "POP",
    difficulty: "BEGINNER",
    decade: "1960s",
    bpm: 118,
    key: "A Major",
    capoFret: 2,
    timeSignature: "4/4",
    chordsUsed: ["G", "Em", "C", "D"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "When the [G]night has come\n[G]And the land is [Em]dark\nAnd the [C]moon is the [D]only light we'll [G]see\nNo I [G]won't be afraid\nOh I [Em]won't be afraid\nJust as [C]long as you [D]stand, stand by [G]me",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example7",
    youtubeUrl: "https://youtube.com/watch?v=hwZNL7QVJjE",
  },
  {
    title: "Redemption Song",
    artist: "Bob Marley",
    genre: "FOLK",
    difficulty: "INTERMEDIATE",
    decade: "1980s",
    bpm: 100,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["G", "Em", "C", "Am", "D"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[G]Old [Em]pirates yes they [C]rob [D]I\n[G]Sold I to the [Em]merchant [C]ships [D]\n[G]Minutes after [Em]they took [C]I [D]\nFrom the [G]bottomless [Em]pit",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example8",
    youtubeUrl: "https://youtube.com/watch?v=QrY9eHkXTa4",
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    genre: "CLASSIC_ROCK",
    difficulty: "INTERMEDIATE",
    decade: "1970s",
    bpm: 74,
    key: "B Minor",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["Bm", "F", "A", "E", "G", "D", "Em"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[Bm]On a dark desert highway, [F]cool wind in my hair\n[A]Warm smell of colitas, [E]rising up through the air\n[G]Up ahead in the distance, [D]I saw a shimmering light\n[Em]My head grew heavy and my sight grew dim,\n[F]I had to stop for the night",
    simplifiedChords:
      "[Am]On a dark desert highway, [E]cool wind in my hair\n[G]Warm smell of colitas, [D]rising up through the air",
    spotifyUrl: "https://open.spotify.com/track/example9",
    youtubeUrl: "https://youtube.com/watch?v=09839DpTctU",
  },
  {
    title: "House of the Rising Sun",
    artist: "The Animals",
    genre: "FOLK",
    difficulty: "INTERMEDIATE",
    decade: "1960s",
    bpm: 80,
    key: "A Minor",
    capoFret: 0,
    timeSignature: "6/8",
    chordsUsed: ["Am", "C", "D", "F", "E"],
    strummingPattern: "D  D  D  D  D  D",
    lyricsWithChords:
      "[Am]There [C]is a [D]house in [F]New Or[Am]leans\nThey [C]call the [E]Rising Sun\n[Am]And it's [C]been the [D]ruin of [F]many a poor boy\nAnd [Am]God I [E]know I'm [Am]one",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example10",
    youtubeUrl: "https://youtube.com/watch?v=0sB3Fcw3fEk",
  },
  {
    title: "Let It Be",
    artist: "The Beatles",
    genre: "POP",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 72,
    key: "C Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["C", "G", "Am", "F"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[C]When I find myself in [G]times of trouble\n[Am]Mother Mary [F]comes to me\n[C]Speaking words of [G]wisdom, let it [F]be [C]\n[C]And in my hour of [G]darkness\nShe is [Am]standing right in [F]front of me\n[C]Speaking words of [G]wisdom, let it [F]be [C]",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example11",
    youtubeUrl: "https://youtube.com/watch?v=QDYfEBY9NM4",
  },
  {
    title: "Sweet Home Alabama",
    artist: "Lynyrd Skynyrd",
    genre: "CLASSIC_ROCK",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 98,
    key: "D Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["D", "C", "G"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[D]Big [C]wheels keep on [G]turning\n[D]Carry me [C]home to see my [G]kin\n[D]Singing [C]songs about the [G]Southland\n[D]I miss [C]Alabamy once [G]again",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example12",
    youtubeUrl: "https://youtube.com/watch?v=ye5BuYf8q4o",
  },
  {
    title: "Good Riddance (Time of Your Life)",
    artist: "Green Day",
    genre: "PUNK",
    difficulty: "BEGINNER",
    decade: "1990s",
    bpm: 95,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["G", "Cadd9", "D"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[G]Another turning point, a [Cadd9]fork stuck in the [D]road\n[G]Time grabs you by the wrist, di[Cadd9]rects you where to [D]go\n[Em]So make the [D]best of this [C]test and don't ask [G]why\n[Em]It's not a [D]question but a [C]lesson learned in [G]time",
    simplifiedChords:
      "[G]Another turning point, a [C]fork stuck in the [D]road",
    spotifyUrl: "https://open.spotify.com/track/example13",
    youtubeUrl: "https://youtube.com/watch?v=CnQ8N1KacJc",
  },
  {
    title: "Hallelujah",
    artist: "Leonard Cohen",
    genre: "SINGER_SONGWRITER",
    difficulty: "INTERMEDIATE",
    decade: "1980s",
    bpm: 56,
    key: "C Major",
    capoFret: 0,
    timeSignature: "6/8",
    chordsUsed: ["C", "Am", "F", "G", "E7"],
    strummingPattern: "D  DU DU",
    lyricsWithChords:
      "[C]I've heard there was a [Am]secret chord\nThat [C]David played and it [Am]pleased the Lord\nBut [F]you don't really [G]care for music, [C]do ya? [G]\nIt [C]goes like this the [F]fourth the [G]fifth\nThe [Am]minor fall and the [F]major lift\nThe [G]baffled king com[E7]posing halle[Am]lujah",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example14",
    youtubeUrl: "https://youtube.com/watch?v=YrLk4vdY28Q",
  },
  {
    title: "Brown Eyed Girl",
    artist: "Van Morrison",
    genre: "ROCK",
    difficulty: "BEGINNER",
    decade: "1960s",
    bpm: 148,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["G", "C", "D", "Em"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[G]Hey where did [C]we go, [G]days when the [D]rains came\n[G]Down in the [C]hollow, [G]playin' a [D]new game\n[G]Laughing and a [C]running, hey hey\n[G]Skipping and a [D]jumping\n[G]In the misty [C]morning fog with\n[G]Our, our [D]hearts a thumpin'",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example15",
    youtubeUrl: "https://youtube.com/watch?v=UfmkgQRmmeE",
  },
  {
    title: "Creep",
    artist: "Radiohead",
    genre: "ALTERNATIVE",
    difficulty: "INTERMEDIATE",
    decade: "1990s",
    bpm: 80,
    key: "G Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["G", "B", "C", "Cm"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[G]When you were here be[B]fore\nCouldn't look you in the [C]eye\nYou're just like an [Cm]angel\n[G]Your skin makes me [B]cry\nYou float like a [C]feather\nIn a beautiful [Cm]world",
    simplifiedChords:
      "[G]When you were here be[D]fore\nCouldn't look you in the [C]eye\nYou're just like an [Am]angel",
    spotifyUrl: "https://open.spotify.com/track/example16",
    youtubeUrl: "https://youtube.com/watch?v=XFkzRNyygfk",
  },
  {
    title: "Riptide",
    artist: "Vance Joy",
    genre: "INDIE",
    difficulty: "BEGINNER",
    decade: "2010s",
    bpm: 102,
    key: "G Major",
    capoFret: 1,
    timeSignature: "4/4",
    chordsUsed: ["Am", "G", "C"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[Am]I was scared of [G]dentists and the [C]dark\n[Am]I was scared of [G]pretty girls and [C]starting conversations\n[Am]Oh, all my [G]friends are turning [C]green\n[Am]You're the ma[G]gician's assis[C]tant in their dreams",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example17",
    youtubeUrl: "https://youtube.com/watch?v=RB-RcX5DS5A",
  },
  {
    title: "Free Fallin'",
    artist: "Tom Petty",
    genre: "ROCK",
    difficulty: "BEGINNER",
    decade: "1980s",
    bpm: 84,
    key: "F Major",
    capoFret: 3,
    timeSignature: "4/4",
    chordsUsed: ["D", "Dsus4", "A"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[D]She's a [Dsus4]good [D]girl, loves her [A]mama\nLoves [D]Je[Dsus4]sus [D]and Amer[A]ica too\n[D]She's a [Dsus4]good [D]girl, crazy 'bout [A]Elvis\nLoves [D]hor[Dsus4]ses [D]and her boy[A]friend too",
    simplifiedChords:
      "[D]She's a good girl, loves her [A]mama\nLoves [D]Jesus and Amer[A]ica too",
    spotifyUrl: "https://open.spotify.com/track/example18",
    youtubeUrl: "https://youtube.com/watch?v=1lWJXDG2i0A",
  },
  {
    title: "No Woman No Cry",
    artist: "Bob Marley",
    genre: "REGGAE",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 78,
    key: "C Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["C", "G", "Am", "F"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[C]No [G]woman no [Am]cry [F]\n[C]No [G]woman no [Am]cry [F]\n[C]Said, said, [G]said I remember [Am]when we used to [F]sit\n[C]In the government [G]yard in [Am]Trenchtown [F]",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example19",
    youtubeUrl: "https://youtube.com/watch?v=x59kS2AOrGM",
  },
  {
    title: "Country Roads",
    artist: "John Denver",
    genre: "COUNTRY",
    difficulty: "BEGINNER",
    decade: "1970s",
    bpm: 80,
    key: "A Major",
    capoFret: 2,
    timeSignature: "4/4",
    chordsUsed: ["G", "Em", "D", "C"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "[G]Almost heaven, [Em]West Virginia\n[D]Blue Ridge Mountains, [C]Shenandoah [G]River\n[G]Life is old there, [Em]older than the trees\n[D]Younger than the mountains, [C]growin' like a [G]breeze\n\n[G]Country roads, take me [D]home\nTo the [Em]place I be[C]long\n[G]West Virginia, [D]mountain mama\nTake me [C]home, country [G]roads",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example20",
    youtubeUrl: "https://youtube.com/watch?v=1vrEljMfXYo",
  },
  {
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    genre: "CLASSIC_ROCK",
    difficulty: "ADVANCED",
    decade: "1970s",
    bpm: 82,
    key: "A Minor",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["Am", "Am7", "C", "D", "F", "G", "Em"],
    strummingPattern: "Fingerpicked",
    lyricsWithChords:
      "[Am]There's a [Am7]lady who's [C]sure all that [D]glitters is [F]gold\nAnd [G]she's [Am]buying a stairway to [C]heaven [D]\n[Am]When she [Am7]gets there she [C]knows if the [D]stores are all [F]closed\nWith a [G]word she can [Am]get what she came for",
    simplifiedChords:
      "[Am]There's a lady who's [C]sure all that [D]glitters is gold\nAnd she's [G]buying a stairway to [Am]heaven",
    spotifyUrl: "https://open.spotify.com/track/example21",
    youtubeUrl: "https://youtube.com/watch?v=QkF3oxziUI4",
  },
  {
    title: "Nothing Else Matters",
    artist: "Metallica",
    genre: "METAL",
    difficulty: "INTERMEDIATE",
    decade: "1990s",
    bpm: 70,
    key: "E Minor",
    capoFret: 0,
    timeSignature: "6/8",
    chordsUsed: ["Em", "Am", "C", "D", "G", "B7"],
    strummingPattern: "Fingerpicked/Arpeggiated",
    lyricsWithChords:
      "[Em]So close no matter [D]how far\n[C]Couldn't be much more [Em]from the heart\n[Em]Forever trusting [D]who we are\n[C]And nothing else [G]mat[B7]ters [Em]",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example22",
    youtubeUrl: "https://youtube.com/watch?v=tAGnKpE4NCI",
  },
  {
    title: "Zombie",
    artist: "The Cranberries",
    genre: "ALTERNATIVE",
    difficulty: "BEGINNER",
    decade: "1990s",
    bpm: 80,
    key: "E Minor",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["Em", "C", "G", "D"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[Em]Another [C]head hangs lowly, [G]child is slowly [D]taken\n[Em]And the [C]violence caused such [G]silence, who are [D]we mistaken\n[Em]But you see, [C]it's not me,\nIt's not [G]my family [D]\nIn your [Em]head, in your [C]head they are [G]fighting [D]",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example23",
    youtubeUrl: "https://youtube.com/watch?v=6Ejga4kJUts",
  },
  {
    title: "Hey Jude",
    artist: "The Beatles",
    genre: "POP",
    difficulty: "INTERMEDIATE",
    decade: "1960s",
    bpm: 72,
    key: "F Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["F", "C", "Dm", "A7", "D7", "G"],
    strummingPattern: "D  DU UDU",
    lyricsWithChords:
      "Hey [F]Jude, don't make it [C]bad\nTake a [C]sad song and make it [F]better\nRe[Dm]member to let her into your [A7]heart\nThen you can [Dm]start [G]to make it [C]bet[F]ter",
    simplifiedChords:
      "Hey [C]Jude, don't make it [G]bad\nTake a [G]sad song and make it [C]better",
    spotifyUrl: "https://open.spotify.com/track/example24",
    youtubeUrl: "https://youtube.com/watch?v=A_MjCqQoLLA",
  },
  {
    title: "Losing My Religion",
    artist: "R.E.M.",
    genre: "ALTERNATIVE",
    difficulty: "INTERMEDIATE",
    decade: "1990s",
    bpm: 125,
    key: "A Minor",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["Am", "Em", "Dm", "G", "C", "F"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[Am]Oh life, is bigger\n[Em]It's bigger than you and you are [Am]not me\nThe lengths that I will [Em]go to\nThe distance in your [Am]eyes\n[Em]Oh no I've [Dm]said too [G]much\nI set it [F]up",
    simplifiedChords: null,
    spotifyUrl: "https://open.spotify.com/track/example25",
    youtubeUrl: "https://youtube.com/watch?v=xwtdhWltSIg",
  },
  {
    title: "Mellow Yellow",
    artist: "Donovan",
    genre: "POP",
    difficulty: "BEGINNER",
    decade: "1960s",
    bpm: 112,
    key: "A Major",
    capoFret: 0,
    timeSignature: "4/4",
    chordsUsed: ["A", "D", "E", "A7"],
    strummingPattern: "D DU UDU",
    lyricsWithChords:
      "[A]I'm just mad about [D]Saffron\n[A]Saffron's mad about [E]me\n[A]I'm just mad about [D]Saffron\n[E]She's just mad about [A]me\n\n[A]They call me Mellow [D]Yellow\n[E]Quite rightly\n[A]They call me Mellow [D]Yellow\n[E]Quite rightly\n[A]They call me Mellow [D]Yellow\n\n[A]I'm just mad about [D]Fourteen\n[A]Fourteen's mad about [E]me\n[A]Got me mad about [D]Fourteen\n[E]She's just mad about [A]me\n\n[A]They call me Mellow [D]Yellow\n[E]Quite rightly\n[A]They call me Mellow [D]Yellow\n[E]Quite rightly\n[A]They call me Mellow [D]Yellow\n\n[A7]Born high forever [D]to fly\n[A7]Wind velocity [E]nil\n[A]They call me Mellow [D]Yellow\n[E]Quite [A]rightly",
    simplifiedChords:
      "[A]I'm just mad about [D]Saffron\n[A]Saffron's mad about [E]me\n[A]I'm just mad about [D]Saffron\n[E]She's just mad about [A]me\n\n[A]They call me Mellow [D]Yellow\n[E]Quite rightly\n[A]They call me Mellow [D]Yellow",
    spotifyUrl: "https://open.spotify.com/track/3CxHrSfQzMOJjzFDRkfiXG",
    youtubeUrl: "https://youtube.com/watch?v=IQNBQI3UDag",
  },
];

// ─── Badges (same as auto-seed definitions) ─────────────────────────────────

const badges = [
  // STREAK
  { name: "3-Day Streak", description: "Practice 3 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 3 }, xpReward: 25 },
  { name: "Week Warrior", description: "Practice 7 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 7 }, xpReward: 50 },
  { name: "Two-Week Titan", description: "Practice 14 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 14 }, xpReward: 100 },
  { name: "Monthly Master", description: "Practice 30 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 30 }, xpReward: 200 },
  { name: "Unstoppable", description: "Practice 100 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 100 }, xpReward: 500 },
  // PRACTICE
  { name: "First Steps", description: "Complete your first practice session", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 1 }, xpReward: 10 },
  { name: "Hour Hero", description: "Practice for a total of 60 minutes", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 60 }, xpReward: 50 },
  { name: "Dedicated Player", description: "Practice for a total of 5 hours", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 300 }, xpReward: 100 },
  { name: "Practice Machine", description: "Practice for a total of 20 hours", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 1200 }, xpReward: 250 },
  // MILESTONE
  { name: "First Lesson", description: "Complete your first lesson", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 1 }, xpReward: 15 },
  { name: "Getting Started", description: "Complete 5 lessons", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 5 }, xpReward: 50 },
  { name: "Grade 1 Complete", description: "Complete all Grade 1 lessons", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 5 }, xpReward: 100 },
  { name: "Halfway There", description: "Complete 10 lessons", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 10 }, xpReward: 150 },
  { name: "Course Graduate", description: "Complete all 15 lessons", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 15 }, xpReward: 300 },
  { name: "Song Explorer", description: "Favorite 10 songs", category: "MILESTONE", criteria: { type: "songs_favorited", threshold: 10 }, xpReward: 30 },
  { name: "Music Lover", description: "Favorite 25 songs", category: "MILESTONE", criteria: { type: "songs_favorited", threshold: 25 }, xpReward: 75 },
  // MASTERY
  { name: "First Chord", description: "Master your first chord", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 1 }, xpReward: 15 },
  { name: "Chord Collector", description: "Master 5 chords", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 5 }, xpReward: 50 },
  { name: "Chord Expert", description: "Master 15 chords", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 15 }, xpReward: 150 },
  { name: "Chord Legend", description: "Master all 30 chords", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 30 }, xpReward: 300 },
  // SPECIAL
  { name: "Early Bird", description: "Practice before 7am", category: "SPECIAL", criteria: { type: "special", condition: "early_bird" }, xpReward: 25 },
  { name: "Night Owl", description: "Practice after 11pm", category: "SPECIAL", criteria: { type: "special", condition: "night_owl" }, xpReward: 25 },
];

// ─── Main Seed Function ─────────────────────────────────────────────────────

async function main() {
  console.log("🎸 Seeding GuitarApp database...\n");

  // --- Grades & Modules ---
  console.log("📚 Seeding grades and modules...");
  for (const grade of grades) {
    const { modules, ...gradeData } = grade;
    const createdGrade = await prisma.grade.upsert({
      where: { number: gradeData.number },
      update: gradeData,
      create: gradeData,
    });
    console.log(`  ✓ Grade ${createdGrade.number}: ${createdGrade.title}`);

    for (const mod of modules) {
      await prisma.module.upsert({
        where: {
          gradeId_order: {
            gradeId: createdGrade.id,
            order: mod.order,
          },
        },
        update: { ...mod, gradeId: createdGrade.id },
        create: { ...mod, gradeId: createdGrade.id },
      });
      console.log(`    → Module ${mod.order}: ${mod.title}`);
    }
  }

  // --- Chords ---
  console.log("\n🎵 Seeding chords...");
  for (const chord of chords) {
    await prisma.chord.upsert({
      where: { id: chord.shortName.toLowerCase().replace(/[^a-z0-9]/g, "-") },
      update: chord,
      create: {
        id: chord.shortName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        ...chord,
      },
    });
    console.log(`  ✓ ${chord.shortName} (${chord.name})`);
  }

  // --- Songs ---
  console.log("\n🎶 Seeding songs...");
  for (const song of songs) {
    const slug = `${song.artist}-${song.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    await prisma.song.upsert({
      where: { id: slug },
      update: song,
      create: { id: slug, ...song },
    });
    console.log(`  ✓ "${song.title}" by ${song.artist}`);
  }

  // --- Badges ---
  console.log("\n🏆 Seeding badges...");
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge,
    });
    console.log(`  ✓ ${badge.name}`);
  }

  console.log("\n✅ Seeding complete!");
  console.log(`   📚 ${grades.length} grades with ${grades.reduce((s, g) => s + g.modules.length, 0)} modules`);
  console.log(`   🎵 ${chords.length} chords`);
  console.log(`   🎶 ${songs.length} songs`);
  console.log(`   🏆 ${badges.length} badges`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
