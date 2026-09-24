// pv-HintHelper.js
// Pure utility module: no ThreePearl-specific logic.

export class HintHelper {

    static consume(hints, key, defaultValue = undefined) {
        if (!(key in hints)) return defaultValue;

        const value = hints[key];
        delete hints[key];
        return value;
    }

    static requireHints(hints, keys) {
        // keys may be a single string or an array of strings
        if (typeof keys === "string") {
            return hints.hasOwnProperty(keys);
        }

        // array: return true only if ALL keys are present
        for (const key of keys) {
            if (!hints.hasOwnProperty(key)) {
                return false;
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
