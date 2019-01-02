import { Sprite, Rectangle, Point, Texture, Container } from 'pixi.js'
import GameObject from './GameObject'
import FullName from './FullName'

export default abstract class Actor<TStage> extends Sprite
  implements GameObject<TStage> {
  constructor(readonly fullName: FullName, texture: Texture) {
    super(texture)
    this.name = this.fullName.toString()
  }

  abstract update(deltaTime: number, stage: TStage): void
}
