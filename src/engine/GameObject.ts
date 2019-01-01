export default interface GameObject<TStage> {
  update(deltaTime: number, stage: TStage): void
}
