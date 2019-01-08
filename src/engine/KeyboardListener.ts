import createDebug from 'debug'

const debug = createDebug('app:KeyboardListener')

import { EventEmitter } from 'events'
import { Dictionary } from 'typescript-collections'

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

  constructor(readonly listener: KeyboardListener, readonly code: string) {
    this._isDown = false
    this._isRepeating = false
  }

  dispose() {
    this.listener.silence(this.code)
  }

  onEvent(event: KeyBindingEvents, handler: KeyBindingHandler) {
    debug(`Listen on %s for %s`, this.code, event)
    this.emitter.on(event, handler)
  }

  trigger(event: KeyBindingEvents) {
    debug(`Trigger %s for %s`, event, this.code)
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

export default class KeyboardListener {
  private keyBindings: Dictionary<string, KeyBinding> = new Dictionary()
  private readonly onKeyDown: KeyboardEventHandler
  private readonly onKeyUp: KeyboardEventHandler

  isListening(code: string) {
    return this.keyBindings.containsKey(code)
  }

  clearAll() {
    this.keyBindings.values().forEach(b => b.dispose())
  }

  silence(code: string) {
    this.keyBindings.remove(code)
  }

  onKey(code: string): KeyBinding {
    if (!this.isListening(code)) {
      this.keyBindings.setValue(code, new KeyBinding(this, code))
    }

    return this.keyBindings.getValue(code)!
  }

  private invokeIfListening(code: string, block: KeyBindingHandler) {
    const binding = this.keyBindings.getValue(code)

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
