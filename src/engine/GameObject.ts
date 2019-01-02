import FullName from './FullName'

export default interface GameObject<TStage> {
  readonly fullName: FullName

  update(deltaTime: number, stage: TStage): void
}
