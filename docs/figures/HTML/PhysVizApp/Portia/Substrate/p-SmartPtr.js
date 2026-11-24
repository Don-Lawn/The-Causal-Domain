// ps-SmartPtr.js
console.log("Loading SmartPtr");
import { Identity } from "./p-Identity.js";
import { Collection } from "./p-Collection.js";
import path from "path";

export class SmartPtr {
    constructor(host,role,target) {
        this.host = host;
        this.role = role;
        this.target  = target;
        if (!target.usageCount)
            target.usageCount=0;
        target.usageCount ++;

        this.targetIdentity = target?.as("Identity") ?? null;
    }   

    get() {
        if (! this.target) {
            return this.host.container.findThing(this.targetIdentity);
        } else {
            return this.target;
        }
    }

    setTarget(newTarget) {
        if (newTarget === this.target)
            return;
        if (this.target) {
            this.target.usageCount --;
        }
        this.target = newTarget;
        if (newTarget) {
            if (!newTarget.usageCount)
                newTarget.usageCount = 0;
            newTarget.usageCount ++;
        }
        this.targetIdentity = newTarget?.as("Identity") ?? null;        
    }

    async resolve() {
        if (this.target) {
            return this.target;
        }
        if (this.filename && !this.target) {
            let ext = path.extname(this.filename);
            let temp;
            switch (ext) {
                case ".txt":
                    f = new File(this.filename);
                    temp = f.readText();
                    break;
                case ".js":
                    f = new JSModule(this.filename);
                    temp=f.readText()
                    result = await f.Load(temp);
                    break;
                case ".json":
                    f = new File(this.filename);
                    temp =f.readText();
                    return JsonFile.deserialise(temp);
            }
        }
        
    }
}
export { SmartPtr as Arc };