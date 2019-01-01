import { Sprite } from 'pixi.js'
import GameObject from './GameObject'

export default abstract class Actor<TStage> extends Sprite
  implements GameObject<TStage> {
  abstract update(deltaTime: number, stage: TStage): void
}
