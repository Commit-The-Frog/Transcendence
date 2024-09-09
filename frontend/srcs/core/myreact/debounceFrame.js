export default function debounceFrame (callback) {
    let nextFrameCallback = -1;
    return () => {
        cancelAnimationFrame(nextFrameCallback);
        nextFrameCallback = requestAnimationFrame(callback)
    }
}