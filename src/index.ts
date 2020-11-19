import {FeatureExtractors} from './FeatureExtractors';
import {Video} from './Video';
import {Canvas} from './Canvas'
import {Pose} from "@tensorflow-models/posenet";

const setup = async () => {

    const model = new FeatureExtractors()
    await model.load();

    const video = new Video('#video')
    await video.bindWebcam();

    const canvas = new Canvas('#canvas')

    const loop = async () => {
        const image = video.getElement()
        const result = await model.predict(image)

        canvas.clear();

        Object.values(result).forEach((preds) => {
            (preds as any []).forEach(pred => {
                if (pred.hasOwnProperty('keypoints')){
                    canvas.drawKeypoint(pred.keypoints)
                }
                if (pred.hasOwnProperty('skeleton')){
                    canvas.drawSkeleton(pred.skeleton)
                }
            })
        })


        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}

window.onload = setup


//     "@tensorflow-models/face-landmarks-detection": "0.0.2",
//     "@tensorflow-models/handpose": "0.0.6",
//     "@tensorflow-models/posenet": "^2.2.1",
//     "@tensorflow/tfjs": "^2.7.0",
//     "@tensorflow/tfjs-backend-cpu": "^2.7.0",
//     "@tensorflow/tfjs-backend-webgl": "^2.7.0",
//     "@tensorflow/tfjs-converter": "^2.7.0",
//     "@tensorflow/tfjs-core": "^2.7.0"
