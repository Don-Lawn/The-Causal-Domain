// pv-HintHelper.js
// Pure utility module: no ThreePearl-specific logic.

export class HintHelper {

    static consume(hints, key, defaultValue = undefined) {
        if (!(key in hints)) return defaultValue;

        const value = hints[key];
        delete hints[key];
        return value;
    }

    static requireHints(hints, requiredPaths, context = "") {
        if (!hints || typeof hints !== "object") {
            throw new Error(`Missing hints object${context ? " in " + context : ""}`);
        }

        const result = {};

        for (const path of requiredPaths) {
            let value;
            let found = false;

            if (path in hints) {
                value = hints[path];
                found = true;
            } else {
                const parts = path.split(".");
                let cursor = hints;

                for (const part of parts) {
                    if (cursor && Object.prototype.hasOwnProperty.call(cursor, part)) {
                        cursor = cursor[part];
                    } else {
                        cursor = undefined;
                        break;
                    }
                }

                if (cursor !== undefined) {
                    value = cursor;
                    found = true;
                }
            }

            if (!found) {
                throw new Error(`Missing hint field '${path}'${context ? " in " + context : ""}`);
            }

            result[path] = value;
        }

        return result;
    }


    static mergeFlatHints(base = {}, local = {}) {
        const merged = { ...base };

        for (const [key, value] of Object.entries(local)) {
            merged[key] = value;
        }

        return merged;
    }


    

}
