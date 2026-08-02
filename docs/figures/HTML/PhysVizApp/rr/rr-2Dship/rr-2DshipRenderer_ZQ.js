import { RendererBase } from "../../pv-rendererBase.js";

class RR2DShipRenderer_ZQ extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const pearl = this.pearl;
        const depth = 0.03;

        const body = pearl.makeBox({
            width: 0.64,
            height: 0.12,
            depth,
            color: 0xffffff
        });

        const nose = pearl.makeTrianglePrism({
            width: 0.24,
            height: 0.24,
            depth,
            color: 0xff3b30
        });
        pearl.setPosition(nose, { x: 0.44, y: 0, z: 0 });

        const ship = pearl.combine([body, nose]);
        handle.impl = ship.impl;

        this.pearl.attachToDomain(handle);
        handle.geometryBuilt = true;
    }

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, {
            x: hints.v ?? 0,
            y: 0,
            z: 0
        });
    }

    setRotationZ(handle, hints) {
        // Directly use the angle-to-x-axis from the unit-circle mapping.
        this.pearl.setRotationY(handle, hints.theta ?? 0);
    }

    applyColor(handle, hints) {
        const bodyColor = hints.color ?? 0xe8f3ff;
        const body = handle.impl.children[0];
        const nose = handle.impl.children[1];

        if (body?.material?.color) {
            body.material.color.setHex(bodyColor);
        }

        if (nose?.material?.color) {
            nose.material.color.setHex(0xff3b30);
        }
    }
}

export { RR2DShipRenderer_ZQ };
