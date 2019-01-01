import World from './World'

export default interface GameObject {
  update(deltaTime: number, word: World): void
}
