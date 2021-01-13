import {neuralNetwork} from 'ml5'

export class Classifier extends neuralNetwork {
    constructor() {
        super({
            input: 63,
            output: 10,
            task: 'classification',
            debug: true
        });
    }

    addData(x, y) {
        super.addData(x, [y])
    }

    load() {
        return new Promise((resolve, reject) => {
            super.load(
                {
                    model: 'model/model.json',
                    metadata: 'model/model_meta.json',
                    weights: 'model/model.weights.bin'
                },
                (e) => e ? reject(e) : resolve()
            );
        });
    }

    classify(input) {
        return new Promise((resolve, reject) => super.classify(input, (e, r) => e ? reject(e) : resolve(r)));
    }
}
