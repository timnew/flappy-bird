import { Application } from 'pixi.js'
const app = new Application()

const { loader } = app

document.body.appendChild(app.view)

import birdImage from './bird.png'
import pipeImage from './pipe.png'

loader
  .add({ name: 'bird', url: birdImage })
  .add({ name: 'pipe', url: pipeImage })

import Game from './Game'

const game = new Game(app)

game.run()
