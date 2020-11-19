import {Model} from "./models/Model";
import {PoseModel} from "./models/PoseModel";
import {HandModel} from "./models/HandModel";

export class FeatureExtractors {
    private models: { [k: string]: Model<any> };

    constructor() {
        this.models = {
            poses: new PoseModel(),
            hands: new HandModel()
        }
    }

    load() {
        return Promise.all(Object.values(this.models).map(m => m.load()))
    }

    async predict(video: HTMLVideoElement) {
        const keys = Object.keys(this.models)
        return Promise
            .all(Object.values(this.models).map(m => m.predict(video)))
            .then(r => r.reduce((acc, v, i) => ({[keys[i]]: v}), {}))
    }
}
