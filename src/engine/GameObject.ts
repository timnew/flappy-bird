export default interface GameObject<TScene> {
  update(deltaTime: number, scene: TScene): void
}
