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

        for (const path of requiredPaths) {
            if (!Object.prototype.hasOwnProperty.call(hints, path)) {
                throw new Error(`Missing hint field '${path}'${context ? " in " + context : ""}`);
            }
        }

        return true;
    }


    static mergeFlatHints(base = {}, local = {}) {
        const merged = { ...base };

        for (const [key, value] of Object.entries(local)) {
            merged[key] = value;
        }

        return merged;
    }


    

}
