import Player from '../Player'
import Gene from './Gene'
import World from '../../world/World'

export default class AiPlayer extends Player {
  constructor(readonly gene: Gene, world: World) {
    super(world, gene.name)
  }
}
