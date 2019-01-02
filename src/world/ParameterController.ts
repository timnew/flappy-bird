import World from './World'
import GameObject from '../engine/GameObject'
import FullName from '../engine/FullName'

export default class ParameterController implements GameObject<World> {
  readonly fullName = FullName.singleton('ParameterController')

  constructor() {
    ;(window as any).params = this
  }

  pipeWidth: number = 0

  birdWidth: number = 0

  birdHeight: number = 0

  maxRaisingSpeed: number = 0

  raisingSpeed: number = 0

  gravity: number = 5

  maxDroppingSpeed: number = 0

  maxRotation: number = Math.PI / 6

  speed: number = 1

  minPipeDistance: number = 0

  maxPipeDistance: number = 0

  minGapSize: number = 0

  maxGapSize: number = 0

  minPipeTopMargin: number = 30

  minPipeBottomMargin: number = 30

  setup(world: World) {
    const birdTexture = world.resources.bird.texture

    this.birdHeight = birdTexture.height
    this.birdWidth = birdTexture.width

    this.pipeWidth = world.resources.topPipe.texture.width

    // Horizontal

    this.speed = world.screen.width / 4

    // Vertical

    this.gravity = this.birdHeight * 80

    this.maxDroppingSpeed = this.gravity

    this.raisingSpeed = this.birdHeight * 15
    this.maxRaisingSpeed = this.raisingSpeed

    this.maxRotation = Math.PI / 3

    // Pipe
    this.minPipeBottomMargin = 30
    this.minPipeTopMargin = 30

    const minFeasibleGapSize =
      ((this.pipeWidth + this.birdWidth) / this.speed) *
      Math.min(this.maxDroppingSpeed, this.maxRaisingSpeed, this.gravity / 60)

    this.minGapSize = minFeasibleGapSize * 5
    this.maxGapSize = minFeasibleGapSize * 8

    this.maxPipeDistance = this.pipeWidth * 6
    this.minPipeDistance = this.pipeWidth * 4
  }

  update(deltaTime: number, stage: World): void {}
}
