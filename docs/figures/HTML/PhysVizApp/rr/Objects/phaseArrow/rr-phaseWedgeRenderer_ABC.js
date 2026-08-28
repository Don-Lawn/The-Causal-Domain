// rr/phaseArrow/PhaseWedgeRenderer_ABC.js
import { RendererBase } from "../../../pv-rendererBase.js";

class PhaseWedgeRenderer_ABC extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    render(semanticObject, hints) {
        // Let RendererBase + Dispatch handle transforms
        super.render(semanticObject, hints);

        // Trails still need manual handling
        if (semanticObject.trailEnabled) {
            const handle = this.ensureHandle(semanticObject);
            this.pearl.updateTrail(handle, semanticObject);
        }
    }
    ensureGeometry(handle, hints) {
        if (!handle.impl) 
            handle.impl = this.pearl.createPhaseWedgeMesh(hints);
    }

    getDefaultHints() {
        return {
            semantic: {
                color: 0x00ff00,
                visible: true},
            geometric: {},
            render: {
                width: 1,
                height: 0,
                depth: 0.02,
                triangleType: "right",        // "right", "isosceles", "equilateral"
                rightAngleCorner: "A",        // "A", "B", "C"
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            }
        };
    }


    editHints(hints) {
        const theta = this.computeTheta(hints);
        const rotationZ = theta + hints.phaseOffset;

        return {
            ...hints,
            theta,
            rotationZ
        };
    }
    computeTheta(hints) {
        // geometric interpretation of semantic phase
        return hints.phase + hints.phaseOffset;
    }


}


export { PhaseWedgeRenderer_ABC };