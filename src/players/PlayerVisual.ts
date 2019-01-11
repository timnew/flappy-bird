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
    pipe.gapPosition - bird.y,
    pipe.gapPosition - pipe.halfGapSize - bird.y, // 2 * pipe.halfGapSize,
    pipe.gapPosition + pipe.halfGapSize - bird.y // pipe.gapPosition - bird.y
  ]
}
