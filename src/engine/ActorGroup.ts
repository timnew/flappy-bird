import { Container } from 'pixi.js'
import GameObject from './GameObject'
import Actor from './Actor'

export class ActorGroup<TStage> extends Container
  implements GameObject<TStage> {
  readonly name: string
  constructor(type: string, name: string) {
    super()
    this.name = `${type}:${name}`
  }

  readonly actors: Actor<TStage>[] = []

  update(deltaTime: number, stage: TStage) {
    this.actors.forEach(actor => actor.update(deltaTime, stage))
  }
}
