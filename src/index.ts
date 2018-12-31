import * as PIXI from 'pixi.js'

import birdImage from './bird.png'

const app = new PIXI.Application({ width: 512, height: 512 })

app.renderer.backgroundColor = 0xffffff

document.body.appendChild(app.view)

PIXI.loader.add([birdImage]).load(() => {
  const bird = new PIXI.Sprite(PIXI.loader.resources[birdImage].texture)

  app.stage.addChild(bird)
})
