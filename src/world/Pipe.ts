import GameObject from './GameObject'
import Game from '../engine/Game'

export default class Pipe extends GameObject {
  constructor(game: Game) {
    super(game.resources.pipe.texture)
  }

  update(deltaTime: number, game: Game): void {
    throw new Error('Method not implemented.')
  }
}
