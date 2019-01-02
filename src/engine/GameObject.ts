export default interface GameObject<TStage> {
  readonly name: string
  update(deltaTime: number, stage: TStage): void
}
