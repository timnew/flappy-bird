import { Sprite } from 'pixi.js'
import GameObject from './GameObject'

export default abstract class Actor<TWorld> extends Sprite
  implements GameObject<TWorld> {
  abstract update(deltaTime: number, word: TWorld): void
}
