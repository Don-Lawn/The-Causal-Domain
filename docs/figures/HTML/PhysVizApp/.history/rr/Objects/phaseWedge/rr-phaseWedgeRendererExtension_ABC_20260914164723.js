// ---------------------------------------------------------------------------
// rr-phaseWedgeRendererExtension_ABC.js
// Renderer capability for PhaseWedge objects (ABC variant)
// ---------------------------------------------------------------------------

import { BaseExtension } from "../../../pv/pv-baseExtension.js";

export class PhaseWedgeRendererExtension_ABC extends BaseExtension {
    constructor(pearl) {
        super("phaseWedgeRendererABC");

        this.pearl = pearl;   // ThreePearl instance
        this.handles = new Map();
    }

    onAttach(object) {

        if (!object.object3D) {
            throw new Error(
                `PhaseWedgeRendererExtension_ABC requires GeometryExtension on '${object.id}'.`
            );
        }

        // -------------------------------------------------------------------
        // Glue: ensure renderer handle
        // -------------------------------------------------------------------
        object.ensureRendererHandle = () => {
            let handle = this.handles.get(object.id);
            if (!handle) {
                handle = this.pearl.createPhaseWedgeMesh(object.hints.phaseWedge);
                this.handles.set(object.id, handle);
                object.object3D.add(handle);
            }
            return handle;
        };

        // -------------------------------------------------------------------
        // Glue: apply RR render hints
        // -------------------------------------------------------------------
        object.applyPhaseWedgeRenderHints = () => {
            const hints = object.hints.phaseWedge;
            const handle = object.ensureRendererHandle();

            // Apply color
            if (handle.material) {
                handle.material.color.setHex(hints.color);
            }

            // Apply rotation (RR phase → Z rotation)
            object.object3D.rotation.z = hints.angle;

            // Apply scale (magnitude → wedge length)
            object.object3D.scale.set(
                hints.magnitude,
                hints.magnitude,
                1
            );
        };

        // -------------------------------------------------------------------
        // Hook into render(dt)
        // -------------------------------------------------------------------
        if (typeof object.render === "function") {
            const originalRender = object.render;

            object.render = (dt) => {
                originalRender(dt);
                object.applyPhaseWedgeRenderHints();
            };
        }
    }

    onDetach(object) {
        delete object.ensureRendererHandle;
        delete object.applyPhaseWedgeRenderHints;

        const handle = this.handles.get(object.id);
        if (handle) {
            if (object.object3D) {
                object.object3D.remove(handle);
            }
            this.handles.delete(object.id);
        }
    }
}
