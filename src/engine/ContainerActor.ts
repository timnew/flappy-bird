import { Container } from 'pixi.js'
import GameObject from './GameObject'
import Name from './Name'

export abstract class ContainerActor<TStage> extends Container
  implements GameObject<TStage> {
  constructor(readonly name: Name) {
    super()
  }

  abstract update(deltaTime: number, stage: TStage): void
}
