
export class Classifier {
    constructor() {
        this.nn = new ml5.neuralNetwork({
            input: 63,
            output: 10,
            task: 'classification',
            debug: true
        });
        console.log('aaaa');

    }

    addData(x, y) {
        console.log('e');
        this.nn.addData(x, [y])
    }

    load() {
        return new Promise((resolve, reject) => {
            this.nn.load(
                {
                    model: 'model/model.json',
                    metadata: 'model/model_meta.json',
                    weights: 'model/model.weights.bin'
                },
                (e) => e ? reject(e) : resolve()
            );
        });
    }

    train(){
        return new Promise((resolve, reject) => {
            this.nn.normalizeData()
            this.nn.train({epochs: 100}, (e) => e ? reject(e) : resolve());
        });
    }

    classify(input) {
        return new Promise((resolve, reject) => this.nn.classify(input, (e, r) => e ? reject(e) : resolve(r)));
    }
}
