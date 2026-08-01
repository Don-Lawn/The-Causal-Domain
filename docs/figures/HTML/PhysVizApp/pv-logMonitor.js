// pv-logMonitor.js
export class PVLogMonitor {
    constructor(domElementName, maxLines = 50) {
        this.maxLines = maxLines;
        this.count = 0;
        
        /** @type {HTMLElement} */
        this.domElement = /** @type {HTMLElement} */ (
        document.getElementById(domElementName)
        );
    }

    handle(busName, evt, emitOrForward) {
        this.count++;

        const line = `[${evt.time.toFixed(1)}] ${evt.sender} ${busName} ${emitOrForward} ${evt.eventName} ${JSON.stringify(evt.payload)}`;

        const div = document.createElement("div");
        div.textContent = line;
        this.domElement.appendChild(div);

        // Keep last N lines
        while (this.domElement.children.length > this.maxLines) {
            const child =this.domElement.firstChild
            if (child)
                this.domElement.removeChild(child);
        }

        this.domElement.scrollTop = this.domElement.scrollHeight;
    }
}
