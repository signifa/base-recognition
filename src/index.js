import 'regenerator-runtime/runtime'

let bodyPose;
let bodySkeleton;
let handsPose = [];
let face = [];

let video;

const setup = async () => {
    console.clear()
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();

    const poseNet = ml5.poseNet(video, () => console.log("poseNet loaded"));
    const handpose = ml5.handpose(video, () => console.log("handpose loaded"));
    const facemesh = ml5.facemesh(video, () => console.log("facemesh loaded"));

    poseNet.on("pose", results => {
        if (results.length > 0){
            bodyPose = results[0].pose;
            bodySkeleton = results[0].skeleton;
        }
    });

    handpose.on("predict", results => {
        if (results.length > 0){
            handsPose = results
        }
    });

    facemesh.on("predict", results => {
        if (results.length > 0){
            face = results
        }
    });

}


const draw = async () => {
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);

    if (bodyPose) {
        for (let i = 0; i < bodySkeleton.length; i++) {
            let a = bodySkeleton[i][0];
            let b = bodySkeleton[i][1];
            strokeWeight(2);
            stroke(0);

            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for (let i = 0; i < bodyPose.keypoints.length; i++) {
            let x = bodyPose.keypoints[i].position.x;
            let y = bodyPose.keypoints[i].position.y;
            fill(0);
            stroke(255);
            ellipse(x, y, 16, 16);
        }
    }
    pop();

    push()
    translate(video.width, 0);
    scale(-1, 1);

    drawKeypoints();
    drawSkeleton();
    drawFace();
    pop();


    // fill(255, 0, 255);
    // noStroke();
    // textSize(512);
    // textAlign(CENTER, CENTER);
    // text(poseLabel, width / 2, height / 2);
}

function drawFace() {
    fill(0, 255, 0);
    noStroke();

    for (let i = 0; i < face.length; i += 1) {
        const prediction = face[i];
        console.log(prediction);
        // const [baseX, baseY] = prediction.boundingBox.topLeft
        // ellipse( baseX, baseY, 10, 10);
        for (let j = 0; j < prediction.scaledMesh.length; j += 1) {
            const keypoint = prediction.scaledMesh[j];

            ellipse( keypoint[0], keypoint[1], 3, 3);
        }
    }}


function drawKeypoints()  {
    fill(0, 255, 0);
    noStroke();

    for (let i = 0; i < handsPose.length; i += 1) {
        const prediction = handsPose[i];
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
            const keypoint = prediction.landmarks[j];
            ellipse(keypoint[0], keypoint[1], 10, 10);
        }
    }
}

function drawSkeleton() {
    stroke(255, 0, 0);

    for (let i = 0; i < handsPose.length; i++) {
        let annotations = handsPose[i].annotations;
        for (let j = 0; j < annotations.thumb.length - 1; j++) {
            line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
        }
        for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
            line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
        }
        for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
            line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
        }
        for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
            line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
        }
        for (let j = 0; j < annotations.pinky.length - 1; j++) {
            line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
        }

        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);
    }
}


window.draw = draw
window.setup = setup
