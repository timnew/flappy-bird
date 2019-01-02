export class StructuredName {
  constructor(readonly type: string, readonly name: string) {}

  static parse(name: string) {
    const lastSplitter = name.lastIndexOf(':')

    if (lastSplitter == -1) {
      return new StructuredName(name, name)
    } else {
      return new StructuredName(
        name.substring(0, lastSplitter),
        name.substring(lastSplitter + 1)
      )
    }
  }

  toString(): string {
    if (this.type === this.name) {
      return this.name
    } else {
      return `${this.type}:${this.name}`
    }
  }
}
