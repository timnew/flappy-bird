import { Sprite, Rectangle, Point, Texture, Container } from 'pixi.js'
import GameObject from './GameObject'

export default abstract class Actor<TStage> extends Sprite
  implements GameObject<TStage> {
  readonly name: string

  constructor(type: string, name: string, texture: Texture) {
    super(texture)
    this.name = `${type}:${name}`
  }

  abstract update(deltaTime: number, stage: TStage): void
}
