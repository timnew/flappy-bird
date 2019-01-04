import * as tf from '@tensorflow/tfjs'
import { SymbolicTensor, Model, Tensor, LayerVariable } from '@tensorflow/tfjs'
import { Layer } from '@tensorflow/tfjs-layers/dist/exports_layers'
import Name, { typedName } from '../../engine/Name'
import Pair from './Pair'

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
