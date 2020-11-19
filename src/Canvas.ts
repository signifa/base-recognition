export class Canvas {
    private canvasElement: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(querySelector: string) {
        const element = <HTMLCanvasElement>document.querySelector(querySelector)
        if (!element) {
            throw `Video element with '${querySelector}' doesn't exist.`
        }
        this.canvasElement = element;
        this.ctx = this.canvasElement.getContext('2d')!;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    }

    drawKeypoint(keypoints: { position: { x: number, y: number } }[], color = '#00ff00', radius = 3) {
        this.ctx.fillStyle = color
        for (const {position: {x, y}} of keypoints) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2)
            this.ctx.fill();
        }
    }

    drawSkeleton(skeleton: { position: { x: number, y: number } }[][], color = '#00ff00', lineWidth = 3) {
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = lineWidth
        for (const line of skeleton){
            const [{position: {x:x1, y:y1}}, {position: {x:x2, y:y2}}] = line
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2)
            this.ctx.stroke();
        }
    }
}
