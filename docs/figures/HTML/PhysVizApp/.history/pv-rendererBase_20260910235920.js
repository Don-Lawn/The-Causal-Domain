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

            // semantic defaults
            "semantic.visible": true,

            // transform defaults
            "transform.position.x": 0,
            "transform.position.y": 0,
            "transform.position.z": 0,

            "transform.rotation.x": 0,
            "transform.rotation.y": 0,
            "transform.rotation.z": 0,

            "transform.scale.x": 1,
            "transform.scale.y": 1,
            "transform.scale.z": 1,

            // geometry defaults (empty for base renderer)
            // geometry.* keys will be added by child renderers
            // e.g. PhaseWedgeRenderer, AxisRenderer, etc.

            // renderer defaults
            "renderer.color": 0xffffff,
            "renderer.opacity": 1,

            // camera defaults
            "camera.position.x": 0,
            "camera.position.y": 0,
            "camera.position.z": 5,

            "camera.up.x": 0,
            "camera.up.y": 1,
            "camera.up.z": 0,

            "camera.lookAt.x": 0,
            "camera.lookAt.y": 0,
            "camera.lookAt.z": 0,

            "camera.zoom": 1
        };
    }



}

export { RendererBase };
