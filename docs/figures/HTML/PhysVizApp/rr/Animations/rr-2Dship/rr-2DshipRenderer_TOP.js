import { RendererBase } from "../../../pv-rendererBase.js";

class RR2DShipRenderer_TOP extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    render(semanticObject, hints) {
        super.render(semanticObject, hints);

        const sequenceCycle = hints.trailCycle ?? 0;
        const reducedPhase = sequenceCycle % 2 === 1;
        const isPaused = (hints.sequencePauseRemainingMs ?? 0) > 0 || hints.sequencePhase === 3;

        const handle = this.ensureHandle(semanticObject);
        // Keep Z thickness unchanged; reduce ship planform (length + width) to one third.
        handle.impl.scale.set(reducedPhase ? 1 / 3 : 1, reducedPhase ? 1 / 3 : 1, 1);

        if (!reducedPhase || isPaused) {
            return;
        }

        // Draw the relativistic path in the V-Q plane.
        this.pearl.updateSimpleTrail(
            semanticObject,
            {
                x: hints.v ?? 0,
                y: 0,
                z: -(hints.q ?? 0)
            },
            { includeOrigin: true, maxPoints: 2048 }
        );
    }

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const pearl = this.pearl;
        const depth = 0.03;

        const body = pearl.makeBox({
            width: 0.58,
            height: 0.10,
            depth,
            color: 0xffffff
        });

        const nose = pearl.makeTrianglePrism({
            width: 0.22,
            height: 0.22,
            depth,
            color: 0xff3b30
        });
        pearl.setPosition(nose, { x: 0.40, y: 0, z: 0 });

        const ship = pearl.combine([body, nose]);
        handle.impl = ship.impl;

        this.pearl.attachToDomain(handle);
        handle.geometryBuilt = true;
    }

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, {
            x: hints.v ?? 0,
            y: 0,
            z: -(hints.q ?? 0)
        });
    }

    setRotationZ(handle, hints) {
        // Positive theta should rotate the nose toward negative Q.
        this.pearl.setRotationY(handle, -(hints.theta ?? 0));
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

export { RR2DShipRenderer_TOP };
