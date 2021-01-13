import 'regenerator-runtime/runtime'
import trainData from '../data/*.json'
import ml5 from 'ml5';
import {Classifier} from "./Classifier";

let handsPose = [];
let handInView = false;
let brain;
let video;
let resultEl;

const setup = async () => {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    console.log(video)
    video.hide();
    resultEl = document.querySelector('#predictions')
    const handpose = ml5.handpose(video, () => console.log("handpose loaded"));

    handpose.on("predict", results => {
        handInView = results.length > 0
        if (handInView) handsPose = results
    });

    brain = new Classifier()
    await brain.load()
    // for (const [y, xs] of Object.entries(trainData)) {
    //     xs.forEach(x => brain.addData(x, y))
    // }

    setInterval(async () => {
        if (handInView){
            const r = await brain.classify(getInput())
            const t = r.map(a => `<p>${a.label} : ${a.confidence}</p>`).join('\n')

            resultEl.innerHTML = t;
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
    } else if (key === '+') {
        await brain.train()
        console.log('trained')
    } else if (key === 'p') {
        const r = await brain.classify(getInput())
        console.log(r);
    } else if (key === 'e') {
        brain.save();
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
