// pv-rendererBase.js

import { PVHandle } from "./pv-handle.js";
import { HintHelper } from "./pv-HintHelper.js";

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
    render(semanticObject, baseHints) {
        const mergedHints = this.prepareHints(semanticObject, baseHints);

        this.animate(semanticObject, mergedHints);
    }

    prepareHints(semanticObject, baseHints) {        
        const defaultHints = this.getDefaultHints() ?? {
            semantic: {},
            geometric: {},
            render: {}
        };

        // Merge full structured envelopes
        const mergedHints = HintHelper.mergeFlatHints(defaultHints, baseHints);

        this.editHints(mergedHints);

        this.ensureMandatoryHints(mergedHints);

        return mergedHints;
    }

    animate(semanticObject, hints) {

        const handle = this.ensureHandle(semanticObject);

        if (this.ensureGeometry(handle, hints))             
            this.pearl.attachGeometry(handle);
            
        this.pearl.applyHints(handle, hints);

        if (hints.semantic.trailEnabled) {
            this.pearl.updateTrail(handle, hints);
        }
    }

    
    ensureMandatoryHints(hints) {
        // Subclasses MAY override this.
        // Base version intentionally does nothing.
    }

    // ------------------------------------------------------------
    // Geometry lifecycle (subclasses override)
    // ------------------------------------------------------------
    ensureGeometry(handle, hints) {
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
        return {
            semantic: {
                visible: true
            },
            geometry: {},
            transform: {
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1]
            },
            renderer: {
                color: 0xffffff,
                opacity: 1
            },
            camera: {
                position: { x: 0, y: 0, z: 5 },
                up:       { x: 0, y: 1, z: 0 },
                lookAt:   { x: 0, y: 0, z: 0 },
                zoom:     1
            }
        };
    }


}

export { RendererBase };
