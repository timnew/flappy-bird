import Game from '../engine/Game'
import World from './World'
import Actor from '../engine/Actor'

export default class Pipe extends Actor<World> {
  constructor(game: Game) {
    super(game.resources.pipe.texture)
  }

  update(deltaTime: number, world: World): void {
    throw new Error('Method not implemented.')
  }
}
