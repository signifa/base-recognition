import {Model} from './Model';
// @ts-ignore
import * as handpose from '@tensorflow-models/handpose'

interface HandModelPrediction {
}

export class HandModel implements Model<HandModelPrediction[]> {
    private net: any;

    async load() {
        this.net = await handpose.load()
    }

    async predict(video: HTMLVideoElement) {
        const poses = await this.net.estimateHands(video, {
            flipHorizontal: true,
            decodingMethod: 'single-person',
        })
        console.log(poses);
        return []
    }


}
