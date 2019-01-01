import { Sprite } from 'pixi.js'
import GameObject from './GameObject'

export default abstract class Actor<TScene> extends Sprite
  implements GameObject<TScene> {
  abstract update(deltaTime: number, world: TScene): void
}
