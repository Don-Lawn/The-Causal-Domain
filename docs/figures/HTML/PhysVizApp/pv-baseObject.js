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
    extend(extension)
    {
        console.log(
            "Extending:",
            extension,
            "type:",
            extension?.constructor?.name
        );

        if (!extension)
        {
            debugger;
            throw new Error("Extension is null");
        }

        if (typeof extension.attachTo !== "function")
        {
            console.error(
                "Bad extension:",
                extension
            );

            debugger;

            throw new Error(
                "Extension has no attachTo()"
            );
        }

        extension.attachTo(this);

        this.capabilities.set(
            extension.name,
            extension
        );

        this[extension.name] = extension;
    }

    // Convenience: add/update hints
    setHint(key, value) {
        this.hints[key] = value;
    }

    getHint(key, defaultValue = null) {
        return this.hints[key] ?? defaultValue;
    }

    getCapability(name)
    {
        return this.capabilities.get(name);
    }
}
