// rr-phaseArrow.js
// Semantic Phase Arrow that uses Pearl primitives to build geometry.
// No THREE.js imports. No renderer logic. Pearl provides primitives.

import { RRObject } from "./rr-object.js";

export class RRPhaseArrow extends RRObject {

    /**
     * @param {import('./rr-pearl').Pearl} pearl - renderer primitive provider
     * @param {Object} opts
     * @param {number} [opts.color=0xffffff]
     * @param {number} [opts.shaftLength=1.0]
     * @param {number} [opts.shaftRadius=0.05]
     * @param {number} [opts.headLength=0.25]
     * @param {number} [opts.headRadius=0.12]
     * @param {number} [opts.angularVelocity=1.0]  radians/sec
     */
    constructor(pearl, opts = {}) {
        super(opts);

        this.pearl = pearl;
        this.trailEnabled = false;
        

        // Semantic properties
        this.shaftLength     = opts.shaftLength     ?? 1.0;
        this.shaftRadius     = opts.shaftRadius     ?? 0.05;
        this.headLength      = opts.headLength      ?? 0.25;
        this.headRadius      = opts.headRadius      ?? 0.12;
        this.angularVelocity = opts.angularVelocity ?? 1.0;

        // Semantic phase angle
        this.phase = 0;

        // RRHandle will be attached after geometry assembly
        this.handle = null;

        // Build geometry using Pearl primitives
        this.handle = this.buildGeometry();
    }

    /**
     * Build the concrete geometry using Pearl primitives.
     * Returns an RRHandle containing a THREE.Group.
     */
    buildGeometry() {

        // 1. Shaft (cylinder)
        const shaft = this.pearl.makeCylinder({
            radiusTop:    this.shaftRadius,
            radiusBottom: this.shaftRadius,
            height:       this.shaftLength,
            color:        this.color
        });

        // Move shaft so its base is at origin
        this.pearl.setPosition(shaft, { x: 0, y: this.shaftLength / 2, z: 0 });

        // 2. Head (cone)
        const head = this.pearl.makeCone({
            radius: this.headRadius,
            height: this.headLength,
            color:  this.color
        });

        // Position head at end of shaft
        this.pearl.setPosition(head, { x: 0, y: this.shaftLength + this.headLength / 2, z: 0 });

        // 3. Combine into one RRHandle
        const composite = this.pearl.combine([shaft, head]);

        // Attach RRHandle to semantic object
        this.handle = composite;

        return composite;
    }

    /**
     * Semantic behaviour: advance phase and rotate the handle.
     * Domain calls this once per frame.
     *
     * @param {number} dt
     * @param {any} threeData
     */
    update(dt, threeData) {
        this.phase += this.angularVelocity * dt;

        if (this.handle && this.handle.impl) {

            // Rotate
            this.handle.impl.rotation.z = this.phase;

            // Twice-speed colour cycle
            const t = (1 + Math.sin(2 * this.phase)) * 0.5;
            const r = 1 - t;
            const g = t;
            const b = 0;

            this.pearl.applyColorToComposite(this.handle, r, g, b);

            // Delegate trail update to Pearl
            if (this.trailEnabled) {
                this.pearl.updateTrail(this.handle, threeData);
            }
        }
    }

}