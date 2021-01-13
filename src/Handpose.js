
export class Handpose{
    constructor(video){
        this.video = video;
        this.cb = () => {}
    }

    onPrediction(cb) {
        this.cb = cb
    }

    load(){
        return new Promise((resolve, reject) => {
            this.model = ml5.handpose(this.video, (e) => e ? reject(e) : resolve())

            this.model.on("predict", results => this.cb(results));
        })
    }
}
