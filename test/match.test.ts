import * as assert from 'assert'
import * as O from 'fp-ts/lib/Option'
// import * as M from '../dist/lib/match'
import * as M from '../src/match'

interface ChangeColor<T = number> {
  readonly _tag: 'ChangeColor'
  readonly value: {
    r: T
    g: T
    b: T
  }
}
interface Move<T = number> {
  readonly _tag: 'Move'
  readonly value: {
    x: T
    y: T
  }
}

interface Write {
  readonly _tag: 'Write'
  readonly value: {
    text: string
  }
}
interface Quit {
  readonly _tag: 'Quit'
  readonly value: string
}

describe('pattern matching', () => {
  const optionMatching = M.match<O.Option<string>, string>({
    Some: (x) => `Something: ${x.value}`,
    None: () => 'Nothing'
  })

  type Cases = ChangeColor<number> | Move | Write | Quit
  const matchMessage = M.match<Cases, string>({
    ChangeColor: ({ value: { r, g, b } }) => `Change the color to Red: ${r} | Green: ${g} | Blue: ${b}`,
    Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
    Write: ({ value: { text } }) => `Text message: ${text}`,
    Quit: () => 'Quit variant have no data structure',
    _: () => 'Default message'
  })

  it('Option', () => {
    assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
    assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
  })

  it('match', () => {
    const ChangeColor = ({ r, g, b }: ChangeColor<number>['value']): ChangeColor<number> => ({
      _tag: 'ChangeColor',
      value: { r, g, b }
    })
    const Move = ({ x, y }: Move['value']): Move => ({
      _tag: 'Move',
      value: { x, y }
    })
    assert.deepStrictEqual(
      matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),
      'Change the color to Red: 12 | Green: 20 | Blue: 30'
    )
    assert.deepStrictEqual(
      matchMessage(Move({ x: 500, y: 100 })),
      'Move in the x direction: 500 and in the y direction: 100'
    )
  })

  it('match default', () => {
    //@ts-ignore
    assert.deepStrictEqual(matchMessage(null), 'Default message')
    //@ts-ignore
    assert.deepStrictEqual(matchMessage(), 'Default message')
  })
})
