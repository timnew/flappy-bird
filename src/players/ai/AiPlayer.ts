import Player, { PlayerVisual } from '../Player'
import Gene from './Gene'
import { Model, Tensor, tidy, tensor2d } from '@tensorflow/tfjs'
import { typedName } from '../../engine/Name'

export default class AiPlayer extends Player {
  constructor(readonly gene: Gene) {
    super(typedName('AI', gene.name))
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
