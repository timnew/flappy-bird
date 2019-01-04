import * as tf from '@tensorflow/tfjs'
import { SymbolicTensor, Model, Tensor, LayerVariable } from '@tensorflow/tfjs'
import { Layer } from '@tensorflow/tfjs-layers/dist/exports_layers'
import Name, { typedName } from '../../engine/Name'

class Pair<T> {
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

function clone<T>(source: T): T {
  return (Object as any).assign({}, source) as T
}

function biasVariable(layer: Layer): LayerVariable {
  const biasVariable: LayerVariable = (layer as any).bias
  return biasVariable
}

export default class Gene {
  readonly input: SymbolicTensor
  readonly hiddenLayers: Layer[]
  readonly outputLayer: Layer

  constructor(readonly name: Name, ...layers: Layer[]) {
    this.input = tf.input({ shape: [4] })
    this.hiddenLayers = layers
    this.outputLayer = tf.layers.dense({
      units: 1
    })
  }

  compile(): Model {
    const allLayers = [...this.hiddenLayers, this.outputLayer]

    const output = allLayers.reduce(
      (previous: SymbolicTensor, current: Layer) =>
        current.apply(previous) as SymbolicTensor,
      this.input
    )

    return tf.model({ inputs: this.input, outputs: output })
  }

  static createRandom(name: Name): Gene {
    return new Gene(
      name,
      tf.layers.dense({
        units: 10,
        inputShape: [2],
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal',
        useBias: true,
        biasInitializer: 'randomNormal'
      })
    )
  }

  static crossOver(a: Gene, b: Gene): Pair<Gene> {
    return Pair.unzip(
      Pair.zip(a.hiddenLayers, b.hiddenLayers).map(layerPair =>
        this.crossOverLayer(layerPair)
      )
    ).map(
      (crossOvered: Layer[], source: string) =>
        new Gene(typedName(`${a.name}x${b.name}`, source), ...crossOvered)
    )
  }

  private static crossOverLayer(source: Pair<Layer>): Pair<Layer> {
    const result: Pair<Layer> = source.map(clone)

    const variables = result.map(biasVariable)

    this.crossOverTensor(variables)

    return result
  }

  private static crossOverTensor(variables: Pair<LayerVariable>) {
    tf.tidy(() => {
      const tensors = variables.map(v => v.read())

      const halfSize = Math.ceil(tensors.a.size / 2)

      const head = tensors.map(t => t.slice([0], [halfSize]))
      const tail = tensors.map(t => t.slice([halfSize], [halfSize]))

      const mutated = Pair.cross(head, tail).map(t =>
        t.join((head, tail) => head.concat(tail))
      )

      variables.apply(mutated, (variable, bias) => variable.write(bias))
    })
  }
}
