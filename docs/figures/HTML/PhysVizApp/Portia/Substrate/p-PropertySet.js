console.log("Loading PropertySet");

import { Registry } from "./p-Registry.js";


export class PropertySet {

    constructor(data = {}) {

        this.tree = {};
        this.flat = {};
        let myData
        if (data instanceof PropertySet) 
            myData = data.tree        
        else 
            myData = data;     


        if (this.isFlat(myData)) {
            this.flat = structuredClone(myData);
            this.rebuildTree();
        }
        else {
            this.tree = structuredClone(myData);
            this.rebuildFlat();
        }
    }

    isFlat(data) {

        return Object.keys(data).some(key => key.includes("."));
    }

    rebuildFlat() {

        this.flat = PropertySet.normalize(this.tree);
    }

    rebuildTree() {

        this.tree = PropertySet.denormalize(this.flat);
    }

    merge(other) {
        if (!other) return this;

        let myOther;
        if ((other instanceof PropertySet)) 
            myOther = other
        else 
            myOther = new PropertySet(other);
        

        this.flat = {
            ...this.flat,
            ...myOther.flat
        };

        this.rebuildTree();
        return this;
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

    LoadFromFile(capName) {
        Registry.LoadFromFile
        fh = new JsonFile (filePath);
        const otherPs = new PropertySet(JSON.parse(fs.readFileSync(filePath, "utf-8")));
        this.merge(otherPs);
    }
    
    resolveCapabilities() {
        do {
            let caps = this.tree["capabilities"];      
            
            if (caps && caps.length > 0) {
                for (const capName of caps) {
                    const cap = Registry.loadType(capName);
                    this.merge(cap);
                    console.log(capName);
                }
                delete this.tree["capabilities"];
            }
        } while (this.tree["capabilities"] && this.tree["capabilities"].length > 0);
    }
    
}
console.log ("loaded PropertySet");
