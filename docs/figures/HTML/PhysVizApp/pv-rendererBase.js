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

        // Merge semantic hint bag into the render hint envelope
        const hints = {
            ...renderHints,
            semanticHints: semanticObject.hints ?? []
        };

        // 1. Ensure THREE handle exists
        const handle = this.ensureHandle(semanticObject);
        this.pearl.resetTrailCycleState(handle, semanticObject);

        // 2. Ensure geometry exists (ABC domain defines its own sizes)
        this.ensureGeometry(handle);

        // 3. Apply transforms (ABC ignores z)
        this.setRotationZ(handle, hints);
        this.setPosition(handle, hints);

        // 4. Appearance
        this.applyColor(handle, hints);
        this.applyVisibility(handle, hints);
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

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, {
            x: hints.x,
            y: hints.y,
            z: hints.z
        });
    }

    setRotationZ(handle, hints) {
        this.pearl.setRotationZ(handle, hints.phase ?? 0);
    }

    applyColor(handle, hints) {
        this.pearl.applyColor(handle, hints.color);
    }

    applyVisibility(handle, hints) {
        this.pearl.setVisibility(handle, hints.visible);
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
