export default class Pair<T> {
  constructor(readonly a: T, readonly b: T) {}

  map<R>(mapper: (s: T, source: string) => R): Pair<R> {
    return new Pair<R>(mapper(this.a, 'a'), mapper(this.b, 'b'))
  }

  apply<U, R>(arg: Pair<U>, applier: (a: T, b: U) => R): Pair<R> {
    return new Pair(applier(this.a, arg.a), applier(this.b, arg.b))
  }

  join<R>(joiner: (a: T, b: T) => R): R {
    return joiner(this.a, this.b)
  }

  static zip<T>(a: T[], b: T[]): Pair<T>[] {
    return a.map((ae, index) => new Pair<T>(ae, b[index]))
  }

  static unzip<T>(pairs: Pair<T>[]): Pair<T[]> {
    return pairs.reduce((result, pair) => {
      result.a.push(pair.a)
      result.b.push(pair.b)
      return result
    }, new Pair<T[]>([], []))
  }

  static fromArray<T>(array: T[]): Pair<T> {
    // ... cause error in typescript, as array might contain more or less than 2 elements
    return new Pair(array[0], array[1])
  }

  static cross<T>(a: Pair<T>, b: Pair<T>): Pair<Pair<T>> {
    return new Pair(new Pair(a.a, b.b), new Pair(b.a, a.b))
  }
}
