import { Text, TextStyle, Sprite } from 'pixi.js'

export default class NameLabel extends Text {
  constructor(name: string, target: Sprite, alpha: number = 1) {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: ['#ffff', '#cccccc'],
      stroke: '#333333',
      strokeThickness: 1
    })

    super(name, style)

    this.anchor.set(0.5, 1)
    this.x = 0
    this.y = -target.height / 2 - 10
    this.alpha = alpha
  }
}
