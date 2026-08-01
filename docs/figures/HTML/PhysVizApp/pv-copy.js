
import { pearl, Pearl } from './rr-pearl.js';
import { State, currentState, setState } from './rr-state.js';






const gl = pearl.renderer.getContext();



export async function copyRectToClipboard(rect) {
    const canvas = document.getElementById('rrCanvas');
    const gl = pearl.renderer.getContext();
    const { x, y, width, height } = rect;

    // Flip Y for WebGL origin
    const flippedY = pearl.canvas.height - (y + height);

    // Save current viewport and scissor state
    const oldViewport = gl.getParameter(gl.VIEWPORT);
    const oldScissorBox = gl.getParameter(gl.SCISSOR_BOX);
    const scissorEnabled = gl.isEnabled(gl.SCISSOR_TEST);

    // Limit read to the correct region
    gl.viewport(x, flippedY, width, height);
    gl.scissor(x, flippedY, width, height);

    gl.enable(gl.SCISSOR_TEST);

    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(x, flippedY, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    // Restore previous state
    gl.viewport(...oldViewport);
    gl.scissor(...oldScissorBox);
    if (!scissorEnabled) gl.disable(gl.SCISSOR_TEST);

    // Convert to PNG
    const temp = document.createElement('canvas');
    temp.width = width;
    temp.height = height;
    const tctx = /** @type {CanvasRenderingContext2D} */ (    temp.getContext('2d'));

    const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
    tctx.putImageData(imageData, 0, 0);

    const blob = await new Promise(resolve => temp.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

    console.log("Copied viewport:", rect);
}


export function copyDomain(rect) {
    setState(State.PAUSED);          // stop animation
    pearl.renderAll(sceneList);           // force a fresh frame
    copyRectToClipboard(rect);            // copy while framebuffer is valid
    setState(State.RUNNING);         // resume animation
}


document.querySelectorAll(".copyBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        const domainLetter = btn.dataset.domain;   // "A", "B", or "C"
        const rect = rectMap[domainLetter];
        copyDomain(rect);
    });
});