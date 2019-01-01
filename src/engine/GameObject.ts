export default interface GameObject<TWorld> {
  update(deltaTime: number, word: TWorld): void
}
