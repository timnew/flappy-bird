import createDebug from 'debug'
const debug = createDebug('AI:Gene')

import Name, { typedName } from '../../engine/Name'

import { Layer } from '@tensorflow/tfjs-layers/dist/exports_layers'
import {
  layers,
  Sequential,
  sequential,
  tidy,
  Tensor,
  tensor2d,
  zeros,
  randomNormal,
  add
} from '@tensorflow/tfjs'
import { PlayerVisual } from '../Player'

type Pair<T> = [T, T]
type DPair<T> = Pair<Pair<T>>
type Twin<T1, T2> = [T1, T2]

function transpose<T1, T2>([[a1, a2], [b1, b2]]: Twin<
  Pair<T1>,
  Pair<T2>
>): Pair<Twin<T1, T2>> {
  return [[a1, b1], [a2, b2]]
}

function flatten<T>([[a, b], [c, d]]: DPair<T>): T[] {
  return [a, b, c, d]
}

function crossover<T>([[h1, t1], [h2, t2]]: Pair<Pair<T>>): Pair<Pair<T>> {
  return [[h1, t2], [h2, t1]]
}

export const HIDDEN_LAYER_SIZE: number = 10
export const HIDDEN_LAYER_HALF_SIZE = HIDDEN_LAYER_SIZE / 2
export const INPUT_DIM: number = 5

export default class Gene {
  constructor(readonly name: Name, readonly model: Sequential) {}

  crossover(anotherGene: Gene): Pair<Gene> {
    return crossoverGene([this, anotherGene])
  }

  shouldFlap(visual: PlayerVisual): boolean {
    const value = tidy(() => {
      const input = tensor2d([...visual.vector, 1], [1, 5])
      const result = this.model.predict(input) as Tensor

      return result.dataSync()[0]
    })

    return value > 0.5
  }
}

export function createGene(name: Name): Gene {
  return new Gene(
    name,
    sequential({
      name: name,
      layers: [
        layers.dense({ units: HIDDEN_LAYER_SIZE, inputDim: INPUT_DIM }),
        layers.dense({ units: 1 })
      ]
    })
  )
}

function extractLayer(gene: Gene): Pair<Layer> {
  return [gene.model.getLayer(undefined, 0), gene.model.getLayer(undefined, 1)]
}

export function crossoverGene(genes: Pair<Gene>): Pair<Gene> {
  const parentName = `[${genes.map(g => g.name).join('x')}]`

  debug('Crossover %s', parentName)

  // [Ga', Gb']
  const newGenes = genes.map((_, i) =>
    createGene(typedName(parentName, String(i)))
  ) as Pair<Gene>

  tidy(() => {
    // [Ga, Gb] => [[La1, La2], [Lb1, Lb2]]
    const layers = genes.map(extractLayer)

    // [[La1, La2], [Lb1, Lb2]] => [[Wa1, Wa2], [Wb1, Wb2]]
    const weights = layers.map(p =>
      p.map(layer => layer.getWeights()[0])
    ) as DPair<Tensor>

    // [[Wa1, Wa2], [Wb1, Wb2]] => [[Wa1, Wb1], [Wa2, Wb2]]
    const transposedWeights = transpose(weights)

    const crossoverFunctions = [crossoverHiddenLayer, crossoverOutputLayer]

    // [[Wa1, Wb1], [Wa2, Wb2]] => [[Wa1', Wb1'], [Wa2', Wb2']]
    const transposedCrossoveredWeights = transposedWeights.map(
      (weights, index) => crossoverFunctions[index](weights)
    ) as DPair<Tensor>

    // [[Wa1', Wb1'], [Wa2', Wb2']] => [[Wa1', Wa2'], [Wb1', Wb2']]
    const crossoveredWeights = transpose(transposedCrossoveredWeights)

    // [[Wa1', Wb1'], [Wa2', Wb2']] => [[Wa1", Wa2"], [Wb1", Wb2"]]
    const mutated = crossoveredWeights.map(p => p.map(mutate))

    // [Ga', Gb'] => [[La1', La2'], [Lb1', Lb2']]
    const newLayers = newGenes.map(extractLayer)

    // [
    //    [[La1', La2'], [Lb1', Lb2']],
    //    [[Wa1", Wa2"], [Wb1", Wb2"]]
    // ]
    const zip = [newLayers, mutated] as Twin<DPair<Layer>, DPair<Tensor>>

    // [
    //    [[La1', La2'], [Wa1", Wa2"]],
    //    [[Lb1', Lb2'], [Wb1", Wb2"]]
    // ]
    const transposedZip = transpose(zip)

    // [
    //    [[La1', Wa1"], [La2', Wa2"]],
    //    [[Lb1', Wb1"], [Lb2', Wb2"]]
    // ]
    const squareTransposedZip = transposedZip.map(p =>
      transpose(p as any)
    ) as DPair<Twin<Layer, Tensor>>

    // [[La1', Wa1"], [La2', Wa2"], [Lb1', Wb1"], [Lb2', Wb2"]]
    const flattened = flatten(squareTransposedZip)

    flattened.forEach(([layer, weights]) => {
      const layerUnits: number = layer.getConfig().units as number
      layer.setWeights([weights, zeros([layerUnits])])
    })
  })

  return newGenes
}

function mutate(input: Tensor, stdError = 0.9): Tensor {
  const noise = randomNormal(input.shape, 0, stdError)
  return add(input, noise)
}

function crossoverHiddenLayer(weights: Pair<Tensor>): Pair<Tensor> {
  // [T1, T2] => [[T1h, T1t], [T2h, T2t]]
  const splitted = weights.map(weight => [
    weight.slice([0, 0], [INPUT_DIM, HIDDEN_LAYER_HALF_SIZE]),
    weight.slice([0, HIDDEN_LAYER_HALF_SIZE])
  ]) as DPair<Tensor>

  // [[T1h, T1t], [T2h, T2t]] => [[T1h, T2t], [T2h, T1t]]
  const crossedOver = crossover(splitted)

  // [[T1h, T2t], [T2h, T1t]] => [T1', T2']
  return crossedOver.map(([h, t]) => h.concat(t, 1)) as Pair<Tensor>
}

function crossoverOutputLayer(weights: Pair<Tensor>): Pair<Tensor> {
  // [T1, T2] => [[T1h, T1t], [T2h, T2t]]
  const splitted = weights.map(weight => [
    weight.slice([0, 0], [HIDDEN_LAYER_HALF_SIZE, 1]),
    weight.slice([HIDDEN_LAYER_HALF_SIZE, 0])
  ]) as DPair<Tensor>

  // [[T1h, T1t], [T2h, T2t]] => [[T1h, T2t], [T2h, T1t]]
  const crossedOver = crossover(splitted)

  // [[T1h, T2t], [T2h, T1t]] => [T1', T2']
  return crossedOver.map(([h, t]) => h.concat(t, 0)) as Pair<Tensor>
}
// const model = tf.sequential({layers:[
//   tf.layers.dense({units:8, inputDim:3}),
//   tf.layers.dense({units:1 })
// ]})
// const layer1 = model.getLayer(null,0)
// const layer2 = model.getLayer(null,1)
// const w1=layer1.getWeights()[0]
// const w2=layer2.getWeights()[0]
// w1.print()
// w2.print()

// tf.print(w1.shape)
// tf.print(w2.shape)

// const w11 = w1.slice([0,0],[4,3])
// const w12 = w1.slice([0,3])
// const w21 = w2.slice([0,0],[3,1])
// const w22 = w2.slice([3,0])
// w11.print()
// w12.print()
// w21.print()
// w22.print()

// w11.concat(w12, 0).print()
// w21.concat(w22).print()
