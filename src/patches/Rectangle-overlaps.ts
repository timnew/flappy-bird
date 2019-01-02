import * as PIXI from 'pixi.js'

declare module 'pixi.js' {
  interface Rectangle {
    overlaps(another: Rectangle): boolean
  }
}

PIXI.Rectangle.prototype.overlaps = function overlaps(
  another: PIXI.Rectangle
): boolean {
  return (
    this.left < another.right &&
    this.right > another.left &&
    this.top < another.bottom &&
    this.bottom > another.top
  )
}
