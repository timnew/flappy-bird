import { Application } from 'pixi.js'
const app = new Application()

const { loader } = app

document.body.appendChild(app.view)

import birdImage from './bird.png'

loader.add({ name: 'bird', url: birdImage })

import Game from './Game'

const game = new Game(app)

game.run()
