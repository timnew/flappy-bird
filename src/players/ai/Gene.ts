import createDebug from 'debug'
const debug = createDebug('AI:Gene')

import Name, { typedName } from '../../engine/Name'

import {
  layers,
  Sequential,
  sequential,
  tidy,
  Tensor,
  tensor2d,
  concat,
  Tensor2D,
  gather,
  range,
  randomUniform,
  Tensor1D,
  zeros,
  scalar
} from '@tensorflow/tfjs'
import PlayerVisual from '../PlayerVisual'

export type Group<T> = [T, T]
export type Pair<T1, T2> = [T1, T2]
function transposeGroup<T1, T2>([[a1, a2], [b1, b2]]: Pair<
  Group<T1>,
  Group<T2>
>): Group<Pair<T1, T2>> {
  return [[a1, b1], [a2, b2]]
}

export const HIDDEN_LAYER_SIZE: number = 10
export const INPUT_DIM: number = 6

export default class Gene {
  constructor(readonly name: Name, readonly model: Sequential) {}

  shouldFlap(visual: PlayerVisual): boolean {
    const value = tidy(() => {
      const input = tensor2d([...visual, 1], [1, INPUT_DIM])
      const result = this.model.predict(input) as Tensor

      return result.dataSync()[0]
    })

    return value > 0
  }
}

export function createGene(name: Name): Gene {
  return new Gene(
    name,
    sequential({
      name: name,
      layers: [
        layers.activation({ activation: 'softsign', inputShape: [INPUT_DIM] }),
        layers.dense({
          units: HIDDEN_LAYER_SIZE,
          kernelInitializer: 'leCunNormal',
          activation: 'softsign'
        }),
        layers.dense({
          units: 1,
          kernelInitializer: 'leCunNormal',
          activation: 'softsign'
        })
      ]
    })
  )
}

export function crossoverAndMutateGene(
  genes: Group<Gene>,
  newNames: Group<Name>,
  mutateRate: number = 0.01,
  mutateStrength: number = 0.5
): Group<Gene> {
  const newGenes = newNames.map(n => createGene(n)) as Group<Gene>

  tidy(() => {
    const weightCube = concat(genes.map(extractWeights), 1)

    const indices = range(0, HIDDEN_LAYER_SIZE, 1, 'int32')

    const indexShift = scalar(HIDDEN_LAYER_SIZE, 'int32')
    const crossoverPoint = generateCrossoverPoint()

    const crossoverIndices = crossoverPoint.map(cp =>
      indices.add(cp.mul(indexShift))
    ) as Group<Tensor1D>

    const afterCrossover = crossoverIndices.map(i =>
      gather(weightCube, i, 1)
    ) as Group<Tensor2D>

    const mutated = afterCrossover.map(m =>
      mutate(m, mutateRate, mutateStrength)
    ) as Group<Tensor2D>

    transposeGroup([newGenes, mutated]).map(([g, w]: Pair<Gene, Tensor2D>) =>
      applyWeights(g, rebuildWeights(w))
    )
  })

  return newGenes
}

function generateCrossoverPoint(): Group<Tensor1D> {
  const cp: Tensor1D = randomUniform([HIDDEN_LAYER_SIZE], 0, 2, 'bool')
  const cpc: Tensor1D = cp
    .clone()
    .toBool()
    .logicalNot()
    .toInt()

  return [cp, cpc]
}

function extractWeights(gene: Gene): Tensor2D {
  const model = gene.model
  return concat([
    model.getLayer(undefined, 1).getWeights()[0],
    model
      .getLayer(undefined, 2)
      .getWeights()[0]
      .transpose()
  ]) as Tensor2D
}

function applyWeights(gene: Gene, weights: Group<Tensor[]>) {
  const model = gene.model

  weights.forEach((w, i) => model.getLayer(undefined, i + 1).setWeights(w))
}

function rebuildWeights(weightsMatrix: Tensor2D): Group<Tensor[]> {
  const [hiddenKernels, outputKernels] = weightsMatrix.split([INPUT_DIM, 1])

  return [
    [hiddenKernels, zeros([HIDDEN_LAYER_SIZE])],
    [outputKernels.transpose(), zeros([1])]
  ]
}

export function mutateGene(
  gene: Gene,
  name: Name,
  mutateRate: number,
  mutateStrength: number
): Gene {
  const result = createGene(name)

  tidy(() => {
    const weightsMatrix = extractWeights(gene)
    const mutated = mutate(weightsMatrix, mutateRate, mutateStrength)
    applyWeights(result, rebuildWeights(mutated))
  })

  return result
}

function mutate(
  weightsMatrix: Tensor2D,
  mutateRate: number = 0.01,
  mutateStrength: number = 0.5
): Tensor2D {
  const shape = weightsMatrix.shape
  const mutation = randomUniform(shape, -mutateStrength, mutateStrength)
  const mutationSieve = randomUniform(shape).less(mutateRate)
  const sievedMutation = mutation.mul(mutationSieve)

  return weightsMatrix.add(sievedMutation)
}

// CROSS OVER

// const HIDDEN_LAYER_SIZE = 5
// const INPUT_DIM = 3

// const modelA = tf.sequential({layers:[
//   tf.layers.dense({units:HIDDEN_LAYER_SIZE, inputDim:INPUT_DIM}),
//   tf.layers.dense({units:1 })
// ]})
// const modelB = tf.sequential({layers:[
//   tf.layers.dense({units:HIDDEN_LAYER_SIZE, inputDim:INPUT_DIM}),
//   tf.layers.dense({units:1 })
// ]})
// const extractWeights = (model)=>tf.concat([
//  model.getLayer(undefined,0).getWeights()[0],
//  model.getLayer(undefined,1).getWeights()[0].transpose()
// ])

// const wA = extractWeights(modelA)
// const wB = extractWeights(modelB)

// tf.print(wA)
// tf.print(wB)

// const w = tf.concat([wA, wB],1)
// //w.print()

// const wt = w

// const indices = tf.range(0, HIDDEN_LAYER_SIZE, 1,'int32')
// //const one = tf.ones([HIDDEN_LAYER_SIZE], 'int32')
// const cp = tf.randomUniform([HIDDEN_LAYER_SIZE], 0, 2,'int32')
// const cpc = cp.clone().toBool().logicalNot().toInt()
// indices.print()
// cp.print()
// cpc.print()

// const offset = tf.scalar(5,'int32')

// const w1 = tf.gather(wt, indices.add(cp.mul(offset)) , 1)
// const w2 = tf.gather(wt, indices.add(cpc.mul(offset)), 1)
// w1.print()
// w2.print()

// APPLY WEIGHTS

// const [w11, w12] = w1.split([INPUT_DIM, 1])
// w11.print()
// w12.transpose().print()

// const nw=[
//   [
//   	w11,
//   	tf.zeros([HIDDEN_LAYER_SIZE])
// 	],
//   [
//   	w12.transpose(),
//   	tf.zeros([1])
//   ]
// ]

// const applyWeights = (model, weights)=>{
//  model.getLayer(undefined,0).setWeights(weights[0])
//  model.getLayer(undefined,1).setWeights(weights[1])
// }

// MUTATION

// const shape=[4,5]
// const mutationRate = 0.1

// const mutation = tf.randomUniform(shape,-2,2)
// mutation.print()
// const mutationSieveRaw = tf.randomUniform(shape)
// mutationSieveRaw.print()
// const mutationSieve = mutationSieveRaw.less(mutationRate)
// mutationSieve.print()

// const sievedMutation = mutation.mul(mutationSieve)
// sievedMutation.print()
