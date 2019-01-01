export default interface GameObject<TStage> {
  name: string | null
  readonly type: string
  update(deltaTime: number, stage: TStage): void
}
