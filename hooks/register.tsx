import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { AzkarMode, Counter } from '../types'
import { nextAfter, pickSet } from './azkar'
import type { AzkarSet, Dhikr } from './azkar'

const ROTATE_MS = 8000
const MODES: readonly AzkarMode[] = ['auto', 'morning', 'evening', 'general']

const spin = atom({ plugin: 'azkar', key: 'spin' } as const, 0)
const counter = atom({ plugin: 'azkar', key: 'counter' } as const, null)
const isHidden = atom({ plugin: 'azkar', key: 'isHidden' } as const, false)
const isCompact = atom({ plugin: 'azkar', key: 'isCompact' } as const, false)
const mode = atom({ plugin: 'azkar', key: 'mode' } as const, 'auto')
const utcOffset = atom({ plugin: 'azkar', key: 'utcOffsetMinutes' } as const, null)

// What the terminal's random spinner verbs stand for; the desktop already
// says what the step is doing, so its own word is kept.
const MODE_LABEL = {
  thinking: 'Thinking',
  requesting: 'Working',
  responding: 'Writing',
  'tool-input': 'Preparing',
  'tool-use': 'Running tools',
} as const

async function currentSet($: EngineInterface): Promise<AzkarSet> {
  const now = await $.clock.now()
  const offset = await read($, utcOffset)
  // The module's own Date may not know the machine's zone; `date +%z` does.
  const hour =
    offset === null
      ? new Date(now).getHours()
      : new Date(now + offset * 60_000).getUTCHours()

  return pickSet(hour, await read($, mode))
}

async function readUtcOffset($: EngineInterface) {
  try {
    const { exitCode, stdout } = await $.process.run(['date', '+%z'])
    const match = /^([+-])(\d{2})(\d{2})$/.exec(stdout.trim())

    if (exitCode !== 0 || !match) {
      return
    }

    const minutes = Number(match[2]) * 60 + Number(match[3])
    await update($, utcOffset, () => (match[1] === '-' ? -minutes : minutes))
  } catch {
    // No host commands here: the module's Date stands in.
  }
}

async function loadSaved($: EngineInterface) {
  const [savedCounter, savedHidden, savedCompact, savedMode] = await Promise.all([
    $.store.get('counter'),
    $.store.get('isHidden'),
    $.store.get('isCompact'),
    $.store.get('mode'),
  ])

  if (isCounter(savedCounter)) {
    await update($, counter, () => savedCounter)
  }

  if (typeof savedHidden === 'boolean') {
    await update($, isHidden, () => savedHidden)
  }

  if (typeof savedCompact === 'boolean') {
    await update($, isCompact, () => savedCompact)
  }

  if (MODES.includes(savedMode as AzkarMode)) {
    await update($, mode, () => savedMode as AzkarMode)
  }
}

function isCounter(value: unknown): value is Counter {
  const one = value as Counter | null

  return typeof one?.id === 'string' && typeof one.count === 'number'
}

async function setCounter($: EngineInterface, fn: (held: Counter | null) => Counter) {
  const saved = await update($, counter, fn)
  await $.store.set('counter', saved)
}

async function setHidden($: EngineInterface, value: boolean) {
  await update($, isHidden, () => value)
  await $.store.set('isHidden', value)
}

async function toggleCompact($: EngineInterface) {
  const value = await update($, isCompact, held => !held)
  await $.store.set('isCompact', value)
}

async function tap($: EngineInterface, shown: Dhikr, list: readonly Dhikr[]) {
  let isFinished = false

  await setCounter($, held => {
    const count = (held?.id === shown.id ? held.count : 0) + 1
    isFinished = count >= shown.target

    return isFinished
      ? { id: nextAfter(list, shown.id).id, count: 0 }
      : { id: shown.id, count }
  })

  if (isFinished) {
    $.ui.toast(`✓ ${shown.ar} ×${shown.target}`)
  }
}

export const register: Register = on => {
  let ticker: Timer | undefined

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'azkar',
      description: 'Show or hide the azkar row, reset the counter, or pick a set',
      argumentHint: '[reset|morning|evening|general|auto]',
    })
    await loadSaved($)
    void readUtcOffset($)

    return next(e)
  })

  on('turn.start', ($, e, next) => {
    if (!e.agentId && !ticker) {
      ticker = $.clock.every(ROTATE_MS, () => {
        void update($, spin, n => n + 1)
      })
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (!e.agentId) {
      ticker?.cancel()
      ticker = undefined
      // The next turn opens on a fresh one.
      await update($, spin, n => n + 1)
    }

    return next(e)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    const { list } = await currentSet($)
    const dhikr = list[(await read($, spin)) % list.length] ?? list[0]!
    const status = (
      e.props.message ??
      (e.surface === 'desktop' ? e.props.word : MODE_LABEL[e.props.mode])
    ).replace(/(…|\.\.\.)$/, '')
    const meaning = (await read($, isCompact)) ? '' : ` — ${dhikr.en}`

    return next({
      ...e,
      props: {
        ...e.props,
        word: `${status}… ${dhikr.ar}${meaning}`,
        message: null,
        suffix: '',
      },
    })
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) {
      return next(e)
    }

    const set = await currentSet($)
    const held = await read($, counter)
    const dhikr = set.list.find(one => one.id === held?.id) ?? set.list[0]!
    const count = held?.id === dhikr.id ? held.count : 0
    const compact = await read($, isCompact)
    const { Box, Button, Text } = $.ui.resolve(e)

    // Two edges on purpose: what reads left to right hugs the left (status,
    // meaning, count), the Arabic and the controls hug the right.
    return (
      <Box flexDirection="column" rowGap="sm">
        <Box justifyContent="space-between" alignItems="center" columnGap="md">
          {e.props.isWorking ? (
            <Text color="claude" weight="semibold">● Claude is working</Text>
          ) : (
            <Text color="success">✓ Ready</Text>
          )}
          <Text dimColor>{set.label}</Text>
        </Box>
        <Box flexDirection="column">
          {/* `dir` alone does not right-align a short line on every surface. */}
          <Box justifyContent="flex-end">
            <Text dir="rtl" weight="semibold">{dhikr.ar}</Text>
          </Box>
          {!compact && <Text dimColor>{dhikr.en}</Text>}
        </Box>
        <Box justifyContent="space-between" alignItems="center" columnGap="md">
          <Text tabular>
            {count} / {dhikr.target}
          </Text>
          {/* Text-only controls: +1 at full strength, the rest dim until hovered. */}
          <Box alignItems="center" columnGap="md">
            <Button plain key="count" label="+1" onPress={() => tap($, dhikr, set.list)} />
            <Button
              plain
              dimColor
              key="next"
              label="Next"
              onPress={() =>
                setCounter($, () => ({ id: nextAfter(set.list, dhikr.id).id, count: 0 }))
              }
            />
            <Button
              plain
              dimColor
              key="compact"
              label={compact ? 'Show meaning' : 'Compact'}
              onPress={() => toggleCompact($)}
            />
            <Button
              plain
              dimColor
              key="hide"
              label="Hide"
              onPress={async () => {
                await setHidden($, true)
                $.ui.toast('Azkar row hidden. Type /azkar to show it again.')
              }}
            />
          </Box>
        </Box>
      </Box>
    )
  })

  on('command.run', { command: 'azkar' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()

    if (arg === '') {
      const hide = !(await read($, isHidden))
      await setHidden($, hide)

      return { text: hide ? 'Azkar row hidden.' : 'Azkar row shown.' }
    }

    if (arg === 'reset') {
      await setCounter($, held => ({ id: held?.id ?? '', count: 0 }))

      return { text: 'Tasbih counter reset.' }
    }

    if (MODES.includes(arg as AzkarMode)) {
      await update($, mode, () => arg as AzkarMode)
      await $.store.set('mode', arg)
      const { label } = await currentSet($)

      return { text: `Azkar set: ${arg === 'auto' ? `auto (now ${label})` : label}` }
    }

    return { text: 'Usage: /azkar [reset|morning|evening|general|auto]' }
  })
}
