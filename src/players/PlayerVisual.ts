import Bird from '../world/Bird'
import PipeGate from '../world/PipeGate'

type PlayerVisual = number[]
export default PlayerVisual

export function captureVisual(
  speed: number,
  bird: Bird,
  pipe: PipeGate
): PlayerVisual {
  return [
    speed,
    bird.velocity,
    pipe.x - bird.x,
    2 * pipe.halfGapSize,
    pipe.gapPosition - bird.y
  ]
}
