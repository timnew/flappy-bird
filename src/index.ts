import './patches'

import { Application } from 'pixi.js'
const app = new Application({ width: 800, height: 600 })

const { loader } = app

document.body.appendChild(app.view)

import birdImage from './world/bird.png'
import topPipeImage from './world/topPipe.png'
import bottomPipeImage from './world/bottomPipe.png'

loader
  .add({ name: 'bird', url: birdImage })
  .add({ name: 'topPipe', url: topPipeImage })
  .add({ name: 'bottomPipe', url: bottomPipeImage })

import ConsoleObserver from './observer/consoleObserver'
new ConsoleObserver()

import Game from './engine/Game'

const game = new Game(app)

game.run()
