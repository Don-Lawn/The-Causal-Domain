// pv-rendererBase.js

import { PVHandle } from "./pv-handle.js";

class RendererBase {
    constructor(domain, pearl) {
        this.domain = domain;
        this.pearl = pearl;

        // Map<semanticObject.id, PVHandle>
        this.handles = new Map();
    }

    /**
     * Main render pipeline (modern)
     * @param {SemanticObject} semanticObject
     * @param {Object} renderHints  // flattened hints from getSemanticHints()
     */
    render(semanticObject, renderHints) {

        const handle = this.ensureHandle(semanticObject);

        // Trails need this every frame
        this.pearl.resetTrailCycleState(handle, semanticObject);

        // get, and override,  default hints
        const defaultHints = this.getDefaultHints();
        const mergedHints = { 
            ...defaultHints,
            ...renderHints 
        };

        // an oportunity for the renderer to add or modify hings,  based on other hints.
        // this is how the hints evolve from semantic to geometry, to THREE.
        this.editHints(mergedHints);

        // Geometry must exist BEFORE hints or trails
        this.ensureGeometry(handle, mergedHints);

        // Unified hint-driven transform pipeline
        this.pearl.applyHints(handle, mergedHints);

        // Trails update AFTER geometry + hints
        if (semanticObject.trailEnabled) {
            this.pearl.updateTrail(handle, semanticObject);
        }
    }

    // ------------------------------------------------------------
    // Geometry lifecycle (subclasses override)
    // ------------------------------------------------------------
    ensureGeometry(handle, mergedHints) {
        // Subclasses MUST override this.
        // Base version intentionally does nothing.
        throw new Error(`${this.constructor.name}.ensureGeometry() must be overridden`);
    }

    editHints(hints) {
        // Subclasses MAY override this.
        // Base version intentionally does nothing.
    }

    // ------------------------------------------------------------
    // Handle lifecycle
    // ------------------------------------------------------------
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
        const handle = new PVHandle(null);

        handle.semanticObject = semanticObject;   // ⭐ ADD THIS LINE ⭐

        this.handles.set(semanticObject.id, handle);
        semanticObject._pvHandle = handle;

        return handle;
    }


    removeHandle(semanticObject) {
        const id = semanticObject.id;
        const handle = this.handles.get(id);
        if (!handle) return;

        if (handle.impl) {
            this.pearl.removeMesh(handle.impl);
        }

        this.handles.delete(id);
        semanticObject._pvHandle = null;
    }

    getDefaultHints() {
        throw new Error(`${this.constructor.name}.getDefaultHints() must be overridden`);
    }

}

export { RendererBase };
