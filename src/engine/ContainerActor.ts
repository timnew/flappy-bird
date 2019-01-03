import { Container } from 'pixi.js'
import GameObject from './GameObject'
import FullName from './FullName'

export abstract class ContainerActor<TStage> extends Container
  implements GameObject<TStage> {
  constructor(readonly fullName: FullName) {
    super()
    this.name = fullName.toString()
  }

  abstract update(deltaTime: number, stage: TStage): void
}
