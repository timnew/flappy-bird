import World from './World'

export default class ParameterController {
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

    this.speed = world.screen.width / 3

    // Vertical

    this.gravity = this.birdHeight * 60

    this.maxDroppingSpeed = this.gravity

    this.raisingSpeed = this.birdHeight * 3 * 60
    this.maxRaisingSpeed = this.raisingSpeed

    this.maxRotation = Math.PI / 3

    // Pipe
    this.minPipeBottomMargin = 30
    this.minPipeTopMargin = 30

    const minFeasibleGapSize =
      ((this.pipeWidth + this.birdWidth) / this.speed) *
      Math.min(this.maxDroppingSpeed, this.maxRaisingSpeed, this.gravity)

    this.minGapSize = minFeasibleGapSize * 4
    this.maxGapSize = minFeasibleGapSize * 6

    this.maxPipeDistance = this.speed * 2
    this.minPipeDistance = this.speed * 1
  }
}
