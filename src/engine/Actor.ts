import { Sprite, Rectangle, Point } from 'pixi.js'
import GameObject from './GameObject'

export default abstract class Actor<TStage> extends Sprite
  implements GameObject<TStage> {
  abstract update(deltaTime: number, stage: TStage): void

  isCollidedOn(another: Sprite | Rectangle | Point): boolean {
    if (another instanceof Sprite) {
      return this.getBounds().overlaps(another.getBounds())
    }

    if (another instanceof Rectangle) {
      return this.getBounds().overlaps(another)
    }

    if (another instanceof Point) {
      return this.getBounds().contains(another.x, another.y)
    }

    throw Error('Unknown Type')
  }
}
