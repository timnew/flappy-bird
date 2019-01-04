import Player, { PlayerVisual } from '../Player'
import Gene from './Gene'
import { Model, Tensor } from '@tensorflow/tfjs'
import tf from '@tensorflow/tfjs'

export default class AiPlayer extends Player {
  readonly model: Model

  constructor(readonly gene: Gene) {
    super(gene.name)
    this.model = gene.compile()
  }

  onVisual(visual: PlayerVisual) {
    const prediction = tf.tidy(() => {
      const input = tf.tensor1d(visual.vector)
      const result = this.model.predict(input) as Tensor
      return result.dataSync()[0]
    })

    if (prediction > 0.5) {
      this.flap()
    }
  }
}
