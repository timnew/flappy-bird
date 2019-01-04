import Name from './Name'

export default interface GameObject<TStage> {
  readonly name: Name

  update(deltaTime: number, stage: TStage): void
}
