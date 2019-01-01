import { EventEmitter } from 'events'

export type KeyBindingHandler = (binding: KeyBinding) => void

type KeyboardEventHandler = (event: KeyboardEvent) => void

type KeyBindingEvents = 'keyDown' | 'keyDownSingle' | 'keyUp'

export class KeyBinding {
  private _isDown: boolean
  get isDown(): boolean {
    return this._isDown
  }

  private _isRepeating: boolean
  get isRepeating(): boolean {
    return this._isRepeating
  }

  get isUp(): boolean {
    return !this.isDown
  }

  private emitter: EventEmitter = new EventEmitter()

  constructor(readonly code: string) {
    this._isDown = false
    this._isRepeating = false
  }

  onEvent(event: KeyBindingEvents, handler: KeyBindingHandler) {
    console.log(`KeyboardListener: Listen on ${this.code} for ${event}`)
    this.emitter.on(event, handler)
  }

  trigger(event: KeyBindingEvents) {
    console.log(`KeyboardListener: Trigger ${event} for ${this.code}`)
    this.emitter.emit(event, this)
  }

  onKeyDown(event: KeyboardEvent) {
    event.preventDefault()

    this._isRepeating = this.isDown
    this._isDown = true

    this.trigger('keyDown')
    if (!this.isRepeating) {
      this.trigger('keyDownSingle')
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.code === this.code) {
      event.preventDefault()

      this._isDown = false
      this._isRepeating = false

      this.trigger('keyUp')
    }
  }
}

interface KeyBindingDictionary {
  [code: string]: KeyBinding
}

export default class KeyboardListener {
  private keyBindings: KeyBindingDictionary = {}
  private readonly onKeyDown: KeyboardEventHandler
  private readonly onKeyUp: KeyboardEventHandler

  isListening(code: string) {
    return this.keyBindings[code] != null
  }

  onKey(code: string): KeyBinding {
    if (this.keyBindings[code] == null) {
      this.keyBindings[code] = new KeyBinding(code)
    }

    return this.keyBindings[code]
  }

  private invokeIfListening(code: string, block: KeyBindingHandler) {
    const binding = this.keyBindings[code]

    if (binding != null) {
      block(binding)
    }
  }

  constructor() {
    this.onKeyDown = (event: KeyboardEvent) => {
      this.invokeIfListening(event.code, binding => {
        binding.onKeyDown(event)
      })
    }

    this.onKeyUp = (event: KeyboardEvent) => {
      this.invokeIfListening(event.code, binding => {
        binding.onKeyUp(event)
      })
    }
  }

  subscribe() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  unsubscribe() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
