import * as PIXI from 'pixi.js'

declare module 'pixi.js' {
  interface DisplayObject {
    isCollidedOn(another: DisplayObject | Rectangle | Point): boolean
  }
}

PIXI.DisplayObject.prototype.isCollidedOn = function isCollidedOn(
  another: PIXI.DisplayObject | PIXI.Rectangle | PIXI.Point
): boolean {
  if (another instanceof PIXI.DisplayObject) {
    return this.getBounds().overlaps(another.getBounds())
  }

  if (another instanceof PIXI.Rectangle) {
    return this.getBounds().overlaps(another)
  }

  if (another instanceof PIXI.Point) {
    return this.getBounds().contains(another.x, another.y)
  }

  throw Error('Unknown Type')
}
