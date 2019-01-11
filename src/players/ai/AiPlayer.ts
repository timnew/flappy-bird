import Player from '../Player'
import Gene from './Gene'
import { typedName } from '../../engine/Name'
import PlayerVisual from '../PlayerVisual'
import Bird from '../../world/Bird'

export default class AiPlayer extends Player {
  constructor(readonly gene: Gene) {
    super(typedName('AI', gene.name))
  }

  attach(bird: Bird) {
    super.attach(bird)
    bird.birdSprite.alpha = 0.3
  }

  onVisual(visual: PlayerVisual) {
    if (this.gene.shouldFlap(visual)) {
      this.flap()
    }
  }

  onRevive() {
    this.flap()
  }
}
