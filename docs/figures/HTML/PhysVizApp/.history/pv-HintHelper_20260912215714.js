// pv-HintHelper.js
export class HintHelper {

    static async loadHints(path) {
        const response = await fetch(path);
        return await response.json();
    }

    static mergeHints(...hintSets) {
        return Object.assign({}, ...hintSets);
    }

    static consume(hints, key, defaultValue = undefined) {
        if (!(key in hints)) return defaultValue;
        const value = hints[key];
        delete hints[key];
        return value;
    }

    static requireHints(hints, keys) {
        if (typeof keys === "string") {
            return hints.hasOwnProperty(keys);
        }
        for (const key of keys) {
            if (!hints.hasOwnProperty(key)) return false;
        }
        return true;
    }
}
