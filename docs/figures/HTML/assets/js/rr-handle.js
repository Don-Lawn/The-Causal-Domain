// rr-handle.js
// Lightweight wrapper around a Three.js object.
// Pearl produces RRHandles. Domain inserts RRHandles.
// RRObjects store RRHandles. No Three.js imports here.

export class RRHandle {
    /**
     * @param {Object} impl - A raw Three.js object (Group, Mesh, etc.)
     */
    constructor(impl) {
        // The underlying Three.js object.
        // Nothing else in the RR layer touches Three.js directly.
        this.impl = impl;
        this.trail = []; // list of clones
    }
}