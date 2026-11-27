// ps-Index.js
console.log("Loading Index");
import { IndexIterator } from "./p-BaseIterator.js";
export  class Index {
    constructor (fieldName) {  
        this.fieldName = fieldName;
        this.indexMap = new Map();  // map of field values to locations in the container.
    }

    findObjectByKey (keyValue)    {
        return this.indexMap.get(keyValue);
    }

    addIndexEntry (keyValue, object) {
        this.indexMap.set(keyValue, object);
    }                                                               

    removeIndexEntry (keyValue) {
        this.indexMap.delete(keyValue);
    }

    clear() {
        this.indexMap.clear();
    }

    getIterator() {
        return new IndexIterator(this);
    }   
}