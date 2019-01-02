export default class FullName {
  constructor(
    readonly type: string,
    readonly name: string,
    readonly fullName: string = `${type}:${name}`
  ) {}

  static parse(fullName: string): FullName {
    const lastSplitter = fullName.lastIndexOf(':')

    if (lastSplitter == -1) {
      return this.singleton(fullName)
    } else {
      return new FullName(
        fullName.substring(0, lastSplitter),
        fullName.substring(lastSplitter + 1),
        fullName
      )
    }
  }

  static singleton(fullName: string): FullName {
    return new FullName(fullName, fullName, fullName)
  }

  toString(): string {
    return this.fullName
  }
}
