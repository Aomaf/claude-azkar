import { describe, expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import type { Engine } from 'claude-code/testing'

import { pickSet } from '../hooks/azkar'

// 14:00 UTC is 17:00 at +0300: the evening set.
const AFTERNOON_UTC = Date.UTC(2026, 10, 19, 14, 0)

const SURFACES = ['terminal', 'desktop'] as const

const AZKAR = {
  command: 'azkar',
  args: '',
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
} as const

function band(surface: (typeof SURFACES)[number], isWorking: boolean) {
  return {
    plugin: 'azkar',
    component: 'AbovePrompt',
    requestId: 'above-prompt',
    surface,
    props: {
      hasSurvey: false,
      isWorking,
      maxRows: 12,
      bodyColumns: 80,
      scroll: { offset: 0, bodyRows: 12 },
      view: {},
    },
  } as const
}

function spinner(surface: (typeof SURFACES)[number]) {
  return {
    plugin: 'azkar',
    component: 'Spinner',
    requestId: 'main',
    surface,
    props: {
      word: surface === 'desktop' ? 'Creating notes.md' : 'Sauteing',
      message: null,
      suffix: '…',
      mode: 'thinking',
    },
  } as const
}

// What sits beneath the plugin in a session: each hook stands for the engine.
async function startSession(
  $: Engine,
  on: On,
  stored: Record<string, unknown> = {},
) {
  const clock = mock.clock(on, { now: AFTERNOON_UTC })
  const toasts: string[] = []
  const words: string[] = []

  mock.store(on, stored)
  on('command.register', () => ({ value: { command: 'azkar' } }))
  on('process.run', () => ({
    value: { exitCode: 0, stdout: '+0300\n', stderr: '', isStdoutTruncated: false, isStderrTruncated: false },
  }))
  on('ui.toast', (_, e) => {
    toasts.push(e.text)

    return { value: undefined }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    words.push(e.props.word)
    const { Text } = $.ui.resolve(e)

    return <Text>{e.props.word}</Text>
  })
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await clock.settle()

  return { clock, toasts, words }
}

describe('pickSet', () => {
  test('follows the local hour', async () => {
    expect(pickSet(6).name).toBe('morning')
    expect(pickSet(16).name).toBe('evening')
    expect(pickSet(13).name).toBe('general')
    expect(pickSet(23).name).toBe('general')
  })

  test('a forced set wins over the hour', async () => {
    expect(pickSet(6, 'evening').name).toBe('evening')
    expect(pickSet(16, 'general').name).toBe('general')
  })
})

test('the thinking line keeps its status and adds a dhikr', async ($, on) => {
  const { words } = await startSession($, on)

  for (const surface of SURFACES) {
    const ui = await $.ui.mount(spinner(surface))
    const word = words.at(-1) ?? ''

    expect(word.startsWith(surface === 'desktop' ? 'Creating notes.md… ' : 'Thinking… ')).toBe(true)
    // 17:00 local opens on the first of the evening set.
    expect(word).toContain('أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ')
    expect(word).toContain('We have entered the evening')
    await ui.unmount()
  }
})

test('the thinking line rotates while a turn runs, and stops after', async ($, on) => {
  const { clock, words } = await startSession($, on)
  const ui = await $.ui.mount(spinner('desktop'))

  await $.turn.start({ text: 'hi', turnId: 't1' })
  const first = words.at(-1)
  await clock.advance(8000)
  const second = words.at(-1)
  expect(second).not.toBe(first)

  await $.turn.complete({
    answer: '',
    durationMs: 9000,
    isAborted: false,
    turnId: 't1',
    reason: 'answer',
  })
  await clock.settle()
  const afterTurn = words.at(-1)
  await clock.advance(30_000)
  expect(words.at(-1)).toBe(afterTurn)
  await ui.unmount()
})

test('the row shows whether Claude is working', async ($, on) => {
  await startSession($, on)

  for (const surface of SURFACES) {
    const working = await $.ui.mount(band(surface, true))
    expect(await working.find({ type: 'Text', text: /Claude is working/ })).toBeDefined()
    await working.unmount()

    const idle = await $.ui.mount(band(surface, false))
    expect(await idle.find({ type: 'Text', text: /Ready/ })).toBeDefined()
    expect(await idle.find({ type: 'Text', text: /Claude is working/ })).toBeUndefined()
    await idle.unmount()
  }
})

for (const surface of SURFACES) {
  test(`the tasbih counter counts and moves on (${surface})`, async ($, on) => {
    await startSession($, on, { mode: 'general' })
    const ui = await $.ui.mount(band(surface, false))

    await ui.press({ key: 'next' })
    await ui.press({ key: 'count' })
    await ui.press({ key: 'count' })

    expect((await ui.find({ type: 'Text', text: /^\d+ \/ \d+$/ }))?.text).toBe('2 / 33')
    expect(await ui.find({ type: 'Text', text: 'الْحَمْدُ لِلَّهِ' })).toBeDefined()
    await ui.unmount()
  })
}

test('reaching the target says so and goes to the next dhikr', async ($, on) => {
  const { toasts } = await startSession($, on)
  const ui = await $.ui.mount(band('desktop', false))

  // The evening set opens on a dhikr said once.
  await ui.press({ key: 'count' })

  expect(toasts.at(-1)).toContain('أَمْسَيْنَا')
  expect((await ui.find({ type: 'Text', text: /^\d+ \/ \d+$/ }))?.text).toBe('0 / 1')
  expect(await ui.find({ type: 'Text', text: /وَإِلَيْكَ الْمَصِيرُ/ })).toBeDefined()
  await ui.unmount()
})

test('/azkar hides and shows the row', async ($, on) => {
  await startSession($, on)

  const hidden = await $.command.run(AZKAR)
  expect(hidden.text).toBe('Azkar row hidden.')
  const ui = await $.ui.mount(band('desktop', false))
  expect((await ui.find({ type: 'Text' }))?.text).toBe('engine')
  await ui.unmount()

  const shown = await $.command.run(AZKAR)
  expect(shown.text).toBe('Azkar row shown.')
})

for (const surface of SURFACES) {
  test(`compact hides the meaning, on the row and the thinking line (${surface})`, async ($, on) => {
    const { words } = await startSession($, on)
    const row = await $.ui.mount(band(surface, false))
    const line = await $.ui.mount(spinner(surface))

    await row.press({ key: 'compact' })
    expect(await row.find({ type: 'Text', text: /We have entered the evening/ })).toBeUndefined()
    expect(await row.find({ type: 'Text', text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ' })).toBeDefined()
    expect((await row.find({ key: 'compact' }))?.text).toBe('Show meaning')
    expect(words.at(-1)).not.toContain('We have entered the evening')

    await row.press({ key: 'compact' })
    expect(await row.find({ type: 'Text', text: /We have entered the evening/ })).toBeDefined()
    expect(words.at(-1)).toContain('We have entered the evening')
    await line.unmount()
    await row.unmount()
  })
}
