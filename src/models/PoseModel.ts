import {Model} from "./Model";
import * as posenet from "@tensorflow-models/posenet";
import {Keypoint, Pose, PoseNet} from "@tensorflow-models/posenet";

interface PoseModelPrediction extends Pose{
    skeleton: Keypoint[][]
}

export class PoseModel implements Model<PoseModelPrediction[]> {
    private net!: PoseNet;

    async load() {
        this.net = await posenet.load({
            architecture: 'ResNet50',
            outputStride: 32,
            inputResolution: {width: 640, height: 480},
            multiplier: 1,
            quantBytes: 2
        })

    }

    async predict(video: HTMLVideoElement) {
        const poses = await this.net.estimatePoses(video, {
            flipHorizontal: true,
            decodingMethod: 'single-person',
        })

        poses.map((pose: Pose) => Object.assign(pose, {skeleton: posenet.getAdjacentKeyPoints(pose.keypoints, 0.2)}))
        return poses as PoseModelPrediction[]
    }

}
