// ---------------------------------------------------------------------------
// BaseObject.js
// Identity + unified hints + capability registry + glue
// ---------------------------------------------------------------------------

export class BaseObject {
    constructor(id, initialHints = {}) {
        this.id = id;

        // Unified hint/parameter bag
        this.hints = { ...initialHints };

        // Capability registry
        this.capabilities = new Map();
    }

    // Attach an extension (capability)
    extend(extension) {
        extension.attachTo(this);
        this.capabilities.set(extension.name, extension);
    }

    // Convenience: add/update hints
    setHint(key, value) {
        this.hints[key] = value;
    }

    getHint(key) {
        return this.hints[key];
    }
}
