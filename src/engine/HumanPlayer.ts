import Player from '../players/Player'
import Bird from '../world/Bird'
import NameLabel from '../world/NameLabel'
import { ScoreLabel } from '../world/ScoreLabel'
import { KeyBinding } from './KeyboardListener'
import { typedName } from './Name'

export default class HumanPlayer extends Player {
  constructor(name: string, readonly keyBinding: KeyBinding) {
    super(typedName('Player', name))

    keyBinding.onEvent('keyDownSingle', () => {
      this.flap()
    })

    this.debug('Listening on key %s', keyBinding.code)
  }

  protected setupNameLabel(bird: Bird): NameLabel {
    const label = super.setupNameLabel(bird)

    label.text = `${this.name.localName}:${this.scoreRecord.death}`

    label.alpha = 0.7

    return label
  }

  protected setupScoreLabel(bird: Bird): ScoreLabel {
    this.scoreLabel = bird.world.scoreBoard
    return this.scoreLabel
  }

  dispose() {
    this.keyBinding.dispose()
    this.debug('Disposed')
  }
}
