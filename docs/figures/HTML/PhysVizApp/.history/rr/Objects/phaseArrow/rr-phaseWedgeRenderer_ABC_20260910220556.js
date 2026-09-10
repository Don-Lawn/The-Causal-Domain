// rr/phaseArrow/PhaseWedgeRenderer_ABC.js
import { RendererBase } from "../../../pv-rendererBase.js";
import { HintHelper } from "../../../pv-HintHelper.js";

class PhaseWedgeRenderer_ABC extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }


// Default hint envelope
getDefaultHints() {
    const base = super.getDefaultHints();

    const local = {
        semantic: {
            color: 0x00ff00,
            visible: true
        },
        geometric: {},
        render: {
            width: 1,
            height: 0.5,
            depth: 0.02,
            triangleType: "right",
            rightAngleCorner: "A",
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        }
    };

    return HintHelper.deepMerge(base, local);
}


    // Modify hints in-place
    editHints(hints) {
        const theta = this.computeTheta(hints);
        const rotationZ = theta + hints.semantic.phaseOffset;

        hints.geometric.theta = theta;
        hints.geometric.rotationZ = rotationZ;
    }

    computeTheta(hints) {
        return hints.semantic.phase + hints.semantic.phaseOffset;
    }

    
    // PhaseWedge has geometry
    ensureGeometry(handle, hints) {
        if (!handle.impl) {
            handle.impl = this.pearl.createPhaseWedgeMesh(hints);
            return 1; 
        }
        return 0;  // geometry not created, already exists
    }

    ensureMandatoryHints(hints) {
        // ------------------------------------------------------------
        // Mandatory hint validation (RR contract enforcement)
        // ------------------------------------------------------------
        HintHelper.requireHints(hints, [
            "semantic.color",
            "semantic.visible",
            "semantic.phase",
            "semantic.phaseOffset",
            "semantic.trailEnabled",
            "render.width",
            "render.height",
            "render.depth",
            "render.triangleType",
            "render.rightAngleCorner",
            "render.rotation",
            "render.scale"
        ], "PhaseWedgeRenderer_ABC.animate");
    }

}

export { PhaseWedgeRenderer_ABC };
