export class Video {
    private readonly videoElement: HTMLVideoElement;

    constructor(querySelector: string) {
        const element = <HTMLVideoElement>document.querySelector(querySelector)
        if (!element) {
            throw `Video element with '${querySelector}' doesn't exist.`
        }
        this.videoElement = element;
    }

    getElement() {
        return this.videoElement;
    }

    async bindWebcam() {
        return this.setSrc(await navigator.mediaDevices.getUserMedia({video: true, audio: false}))
    }

    setSrc(src: MediaStream | MediaSource | Blob | null) {
        const loaded = new Promise(resolve => {
            this.videoElement.onloadeddata = resolve
        });
        this.videoElement.srcObject = src

        return loaded;
    }
}
