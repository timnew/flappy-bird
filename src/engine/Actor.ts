import { Sprite, Texture } from 'pixi.js'
import World from './World'
import GameObject from './GameObject'

export default abstract class Actor extends Sprite implements GameObject {
  abstract update(deltaTime: number, word: World): void
}
