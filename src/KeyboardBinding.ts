export type KeyBindingHandler = (binding: KeyboardBinding) => void

type KeyboardEventRawHandler = (event: KeyboardEvent) => void

export default class KeyboardBinding {
  isDown: boolean
  isRepeating: boolean
  get isUp(): boolean {
    return !this.isDown
  }
  onKeyDown?: KeyBindingHandler
  onKeyUp?: KeyBindingHandler

  private keyDownHandler: KeyboardEventRawHandler
  private keyUpHandler: KeyboardEventRawHandler

  constructor(public code: String) {
    this.isDown = false
    this.isRepeating = false

    this.keyDownHandler = (event: KeyboardEvent) => {
      if (event.code === this.code) {
        event.preventDefault()

        this.isRepeating = this.isDown
        this.isDown = true

        if (this.onKeyDown != null) {
          this.onKeyDown(this)
        }
      }
    }

    this.keyUpHandler = (event: KeyboardEvent) => {
      if (event.code === this.code) {
        event.preventDefault()

        this.isDown = false
        this.isRepeating = false

        if (this.onKeyUp != null) {
          this.onKeyUp(this)
        }
      }
    }

    this.subscribe()
  }

  subscribe() {
    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
  }

  unsubscribe() {
    window.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('keyup', this.keyUpHandler)
  }
}
