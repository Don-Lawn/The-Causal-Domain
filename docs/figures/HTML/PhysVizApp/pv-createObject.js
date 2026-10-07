// createObject.js
import { BaseObject } from "./pv-baseObject.js";

export function createObject(name,type, extensions)
{
    const obj = new BaseObject(type);
    for (const ext of Object.values(extensions))    
        obj.extend(ext);  
    return obj;
}