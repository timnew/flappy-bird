export function randomFloat(max: number, min: number = 0) {
  return min + Math.random() * (max - min)
}

export function randomInt(max: number, min: number = 0) {
  return Math.floor(randomFloat(min, max))
}
