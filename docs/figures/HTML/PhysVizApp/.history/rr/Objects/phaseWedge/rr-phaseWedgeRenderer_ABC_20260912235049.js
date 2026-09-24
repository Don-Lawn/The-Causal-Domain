// rr/phaseArrow/PhaseWedgeRenderer_ABC.js
import { RendererBase } from "../../../pv-rendererBase.js";
import { HintHelper } from "../../../pv-HintHelper.js";

class PhaseWedgeRenderer_ABC extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }


getDefaultHints() {
    const base = super.getDefaultHints();   // assume this is already flat

    const local = {

        // semantic defaults
        "semantic.color": 0x00ff00,
        "semantic.visible": true,

        // transform defaults (new section)
        "transform.position.x": 0,
        "transform.position.y": 0,
        "transform.position.z": 0,

        "transform.rotation.x": 0,
        "transform.rotation.y": 0,
        "transform.rotation.z": 0,

        "transform.scale.x": 1,
        "transform.scale.y": 1,
        "transform.scale.z": 1,

        // geometry defaults
        "geometry.width": 1,
        "geometry.height": 0.5,
        "geometry.depth": 0.02,
        "geometry.triangleType": "right",
        "geometry.rightAngleCorner": "B",

        // renderer defaults
        "renderer.color": 0x00ff00,
        "renderer.opacity": 1,
        "renderer.visible": true
    };

    // flat merge: overrides replace defaults
    return HintHelper.mergeHints(base, local);
}



    // Modify hints in-place
    editHints(hints) {
        const theta = this.computeTheta(hints);
        const rotationZ = theta + hints["semantic.phaseOffset"];

        hints["geometric.theta"] = theta;
        hints["geometric.rotation.z"] = rotationZ;
    }

    computeTheta(hints) {
        return hints["semantic.phase"] + hints["semantic.phaseOffset"];
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
