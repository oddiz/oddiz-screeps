export const runEveryXTicks = (x: number, callback: () => void): void => {
    if (Game.time % x === 0) {
        callback();
    }
}
