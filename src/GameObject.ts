import { Sprite, Texture } from 'pixi.js'
import Game from './Game'

export default abstract class GameObject extends Sprite {
  constructor(texture: Texture) {
    super(texture)
  }
  abstract update(deltaTime: number, game: Game): void
}
