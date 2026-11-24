export class PropertySet {

    constructor(data = {}) {

        this.tree = {};
        this.flat = {};

        if (this.isFlat(data)) {
            this.flat = structuredClone(data);
            this.rebuildTree();
        }
        else {
            this.tree = structuredClone(data);
            this.rebuildFlat();
        }
    }

    isFlat(data) {

        return Object.keys(data)
            .some(key => key.includes("."));
    }

    rebuildFlat() {

        this.flat = PropertySet.normalize(this.tree);
    }

    rebuildTree() {

        this.tree = PropertySet.denormalize(this.flat);
    }

    merge(other) {

        this.flat = {
            ...this.flat,
            ...other.flat
        };

        this.rebuildTree();
    }

    static normalize(obj, prefix = "", result = {}) {

        for (const [key, value] of Object.entries(obj)) {

            const path = prefix
                ? `${prefix}.${key}`
                : key;

            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                PropertySet.normalize(
                    value,
                    path,
                    result
                );
            }
            else {
                result[path] = value;
            }
        }

        return result;
    }

    static denormalize(flat) {

        const result = {};

        for (const [path, value] of Object.entries(flat)) {

            const parts = path.split(".");
            let current = result;

            for (let i = 0; i < parts.length - 1; i++) {

                const part = parts[i];

                if (!current[part]) {
                    current[part] = {};
                }

                current = current[part];
            }

            current[parts[parts.length - 1]] = value;
        }

        return result;
    }
}