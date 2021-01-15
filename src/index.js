import 'regenerator-runtime/runtime'
// import trainData from '../data/*.json'
import {Classifier} from "./Classifier";
import {uiManager} from "./UiManager";
import {Handpose} from "./Handpose";
import trainData from '../data/*.json'

let handsPose = [];
let handInView = false;
let brain;
let video;

const setup = async () => {
    createCanvas(640, 480).parent('canvas-wrapper');
    video = createCapture(VIDEO);
    video.hide();

    const handpose = new Handpose(video);
    await handpose.load()
    handpose.onPrediction((results) => {
        handInView = results.length > 0
        if (handInView) handsPose = results
    })
    console.log('Handpose loaded');

    brain = new Classifier()
    await brain.load()
    console.log('Model loaded');

    uiManager.hideLoader()

    setInterval(async () => {
        if (handInView) {
            const r = await brain.classify(getInput())
            uiManager.showPredictions(r)
        }
    }, 200)
}

function getInput() {
    const {landmarks, boundingBox: {topLeft}} = handsPose[0];

    return landmarks.reduce((a, p) => {
        // normalisation
        const pc = p.slice()
        pc[0] -= topLeft[0]
        pc[1] -= topLeft[1]

        a.push(...pc.slice(0, 3))
        return a;
    }, [])
}

const draw = async () => {
    translate(video.width, 0);
    scale(-1, 1);

    image(video, 0, 0, video.width, video.height);

    if (handInView) drawHand();
}

let collected = []

async function keyPressed() {
    if (key === '*') {
        collected.push(getInput());
        console.log('collected');
    } else if (key === '-') {
        const r = [
            '[',
            collected.map(l => '  ' + JSON.stringify(l)).join(',\n'),
            ']'
        ].join('\n')
        console.log(r)
        collected = []
    } else if (key === 'p') {
        const r = await brain.classify(getInput())
        console.log(r);
    } else if (key === 't') {
        const newBrain = new Classifier();

        Object.entries(trainData).forEach(([y, xs]) => xs.forEach(x => newBrain.addData(x, y)))
        await newBrain.train()
        newBrain.save();
    }
}

function drawHand() {
    stroke(255, 255, 255);
    strokeWeight(3);

    for (const {annotations, landmarks} of handsPose) {
        for (const point of landmarks) {
            ellipse(point[0], point[1], 10, 10);
        }

        const {palmBase, ...fingers} = annotations;

        for (const point of Object.values(fingers)) {
            line(palmBase[0][0], palmBase[0][1], point[0][0], point[0][1]);

            for (let i = 0; i < point.length - 1; ++i) {
                line(point[i][0], point[i][1], point[i + 1][0], point[i + 1][1]);
            }
        }
    }
}

window.draw = draw
window.setup = setup
window.keyPressed = keyPressed
