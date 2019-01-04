import { Sprite, Texture } from 'pixi.js'
import GameObject from './GameObject'
import Name from './Name'

export default abstract class Actor<TStage> extends Sprite
  implements GameObject<TStage> {
  constructor(readonly name: Name, texture: Texture) {
    super(texture)
  }

  abstract update(deltaTime: number, stage: TStage): void
}
