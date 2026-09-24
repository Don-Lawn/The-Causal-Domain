// pv-HintHelper.js
export class HintHelper {

    static async loadHints(path) {
        const response = await fetch(path);
        return await response.json();
    }
    
    static loadHintsSync(path) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);   // false = synchronous
    try {
        xhr.send(null);
    } catch (err) {
        console.error("XHR error loading hints:", err);
        return {};
    }

    if (xhr.status !== 200) {
        console.error(`Failed to load hints from ${path}: status ${xhr.status}`);
        return {};
    }

    try {
        return JSON.parse(xhr.responseText);
    } catch (err) {
        console.error("JSON parse error:", err);
        return {};
    }
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
