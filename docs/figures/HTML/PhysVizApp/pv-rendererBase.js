// pv-rendererBase.js

import { PVHandle } from "./pv-handle.js"

class RendererBase {
    constructor(domain, pearl) {
        this.domain = domain;
        this.pearl = pearl;

        // Map<semanticObject.id, handle>
        this.handles = new Map();
    }

    /**
     * @param {SemanticObject} semanticObject
     * @param {Object} renderHints  // flattened hints from getRenderHints()
     */
    render(semanticObject, renderHints) {

        const hints = {
            ...renderHints,
            semanticHints: semanticObject.hints ?? []
        };

        const handle = this.ensureHandle(semanticObject);
        this.pearl.resetTrailCycleState(handle, semanticObject);

        this.ensureGeometry(handle);

        // NEW: unified hint-driven transform pipeline
        this.pearl.applyHints(handle, hints);


        // Trails remain manual
        if (semanticObject.trailEnabled) {
            this.pearl.updateTrail(handle, semanticObject);
        }
    }


    ensureGeometry(handle) { /* override me */ }

    ensureHandle(semanticObject) {
        const id = semanticObject.id;

        if (this.handles.has(id)) {
            const existingHandle = this.handles.get(id);
            semanticObject._pvHandle = existingHandle;
            return existingHandle;
        }

        return this.createHandle(semanticObject);
    }

    createHandle(semanticObject) {
        const mesh = this.pearl.createMeshFor(semanticObject);
        const handle = mesh instanceof PVHandle ? mesh : new PVHandle(mesh);

        this.handles.set(semanticObject.id, handle);
        semanticObject._pvHandle = handle;
        return handle;
    }

    // Utility: HSL → hex
    hslToHex(h, s, l) {
        const a = s * Math.min(l, 1 - l);
        const f = (n) => {
            const k = (n + h * 12) % 12;
            const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * c);
        };
        return (f(0) << 16) | (f(8) << 8) | f(4);
    }
}

export { RendererBase };
