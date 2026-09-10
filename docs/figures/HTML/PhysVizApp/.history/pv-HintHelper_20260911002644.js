// pv-HintHelper.js
// Pure utility module: no ThreePearl-specific logic.

export class HintHelper {

    static consume(hints, key, defaultValue = undefined) {
        if (!(key in hints)) return defaultValue;

        const value = hints[key];
        delete hints[key];
        return value;
    }


    static mergeFlatHints(base = {}, local = {}) {
        const merged = { ...base };

        for (const [key, value] of Object.entries(local)) {
            merged[key] = value;
        }

        return merged;
    }




}
