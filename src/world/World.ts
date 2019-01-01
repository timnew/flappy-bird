import Player from './Player'
import Stage from '../engine/Stage'

export default class World extends Stage<World> {
  readonly rasingForce = -30
  readonly maxRasingSpeed = -30
  readonly gravity = 5
  readonly maxDroppingSpeed = 5
  readonly maxRotation = Math.PI / 6

  setup() {
    this.addActor(new Player('player', this))

    this.playerControl.registerHumanControl('player', 'Space')
  }
}
