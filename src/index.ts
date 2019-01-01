import { Application } from 'pixi.js'
const app = new Application()

const { loader } = app

document.body.appendChild(app.view)

import birdImage from './world/bird.png'
import pipeImage from './world/pipe.png'

loader
  .add({ name: 'bird', url: birdImage })
  .add({ name: 'pipe', url: pipeImage })

import Game from './engine/Game'

const game = new Game(app)

game.run()
