export interface Model<T> {
    load(): Promise<void>;
    predict(video: HTMLVideoElement): Promise<T>;
}
