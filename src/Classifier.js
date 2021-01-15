
const MODEL_BASE_DIR = 'model/model-comp/'
// const MODEL_BASE_DIR = 'model/model-light/'

export class Classifier {
    constructor() {
        this.nn = new ml5.neuralNetwork({
            input: 63,
            output: 10,
            task: 'classification',
            debug: true
        });
    }

    addData(x, y) {
        this.nn.addData(x, [y])
    }

    load() {
        return new Promise((resolve, reject) => {
            this.nn.load(
                {
                    model: MODEL_BASE_DIR + 'model.json',
                    metadata: MODEL_BASE_DIR + 'model_meta.json',
                    weights: MODEL_BASE_DIR + 'model.weights.bin'
                },
                (e) => e ? reject(e) : resolve()
            );
        });
    }

    train(){
        return new Promise((resolve, reject) => {
            this.nn.normalizeData()
            this.nn.train({epochs: 150}, (e) => e ? reject(e) : resolve());
        });
    }

    classify(input) {
        return new Promise((resolve, reject) => this.nn.classify(input, (e, r) => e ? reject(e) : resolve(r)));
    }

    save(){
        this.nn.save()
    }
}
