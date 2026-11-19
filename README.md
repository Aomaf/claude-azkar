# Azkar for Claude Code

A Claude Code mod that shows azkar (أذكار) while Claude thinks and works, instead of the usual "Working…" line, plus a small tasbih counter above the prompt.

## What it does

- **On Claude's working line:** the current step, then a dhikr in Arabic with its meaning, for example `Thinking… سُبْحَانَ اللَّهِ — Glory be to Allah`. Claude Code's own animated mark and elapsed time stay, so you can still see it's working. A new dhikr shows every 8 seconds.
- **A row above the prompt:**
  - `● Claude is working` while a turn runs, `✓ Ready` when it's done.
  - The dhikr in Arabic (right-aligned) with its meaning.
  - A tasbih counter (`2 / 33`) with **+1**, **Next**, **Compact** (hides the English) and **Hide**. When you reach the count, it says so and moves to the next dhikr.
- **Time of day:** morning azkar (أذكار الصباح) from 04:00 to 12:00, evening azkar (أذكار المساء) from 15:00 to 22:00, and short daily dhikr at other times, by your computer's local time.

Your counter and settings are kept between sessions.

## Install

Azkar is not in Claude's plugin directory, so searching for it inside Claude won't find it. Add this repository as a marketplace first, in one of these ways.

**From a shell** (the quickest way):

```bash
claude plugin install azkar --marketplace Aomaf/claude-azkar
```

**At the prompt of a Claude Code terminal session:**

```
/plugin install azkar --marketplace Aomaf/claude-azkar
```

Answer `y` to add the marketplace, then pick the user scope.

**In the Claude desktop app:** click **+** next to the prompt box, then **Plugins**, then **Add marketplace**. Pick **GitHub repo**, enter `Aomaf/claude-azkar`, and add **azkar** from the list that appears.

Then start a new session to see it. If the install fails, update Claude Code first (`claude update`): the mod needs version 2.1.309 or later.

## Use

| Command | What it does |
| --- | --- |
| `/azkar` | Show or hide the row above the prompt |
| `/azkar reset` | Set the counter back to zero |
| `/azkar morning` | Always show the morning azkar |
| `/azkar evening` | Always show the evening azkar |
| `/azkar general` | Always show the short daily dhikr |
| `/azkar auto` | Follow the time of day (the default) |

## The azkar

The morning and evening azkar follow Hisn al-Muslim. The daily set covers tasbih, tahmid, takbir, tahlil, istighfar, salawat and other short dhikr. Each has the recommended count used by the counter. The text is in [`hooks/azkar.ts`](hooks/azkar.ts), so corrections and additions are easy to send.

## Notes

- Built and tested on Claude Code 2.1.309. It uses Claude Code's mod API (function hooks), which is in early access and may change between releases.
- On the terminal, how well Arabic is drawn depends on your terminal's right-to-left support. The desktop app draws it correctly.
- Run the tests with `claude plugin test .` in this folder.
