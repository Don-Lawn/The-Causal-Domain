// rr-object.js
// Base semantic object for all RR domain entities.
// Provides visibility, colour, and trail controls.
// No Three.js imports. No rendering logic.

export class RRObject {
    /**
     * @param {Object} opts - configuration options
     * @param {string} [opts.name] - semantic name of the object
     * @param {boolean} [opts.visible=true] - semantic visibility
     * @param {number} [opts.color=0xffffff] - semantic colour (not material)
     * @param {boolean} [opts.trailEnabled=false] - enable/disable trail
     * @param {number} [opts.trailOpacity=0.25] - opacity of trail clones
     * @param {number} [opts.trailScale=1.0] - scale factor for trail clones
     * @param {number} [opts.fadeRate=-0.02] - scale factor for trail clones
     */
    constructor(opts = {}) {
        this.name = opts.name ?? "RRObject";
        this.visible = opts.visible ?? true;

        // Semantic colour (Pearl will convert to material colour)
        this.color = opts.color ?? 0xffffff;

        // Trail controls
        this.trailEnabled = opts.trailEnabled ?? false;
        this.trailOpacity = opts.trailOpacity ?? 0.25;
        this.trailScale = opts.trailScale ?? 1.0;

        // NEW: fade rate (semantic)
        // 0 = never fade
        this.fadeRate = opts.fadeRate ?? 0.02;


        // Pearl will attach a mesh handle later
        this.handle = null;
    }

    /**
     * Semantic update hook.
     * Domain calls this once per frame with dt.
     * Subclasses override this to implement behaviour.
     */
    update(dt, threeData) {
        // Default: no behaviour
    }
}
