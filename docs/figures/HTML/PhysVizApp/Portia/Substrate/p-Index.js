// ps-Index.js

export class Index {
    constructor (fieldName, container) {  
        this.fieldName = fieldName;
        this.container = container;
        this.map = new Map();  // map of field values to locations in the container.
    }

    findobjectByKey (keyValue)    {
        return this.map.get(keyValue);
    }

    addIndexEntry (keyValue, object) {
        this.map.set(keyValue, object);
    }                                                               

    removeIndexEntry (keyValue) {
        this.map.delete(keyValue);
    }

    clear() {
        this.map.clear();
    }

    refresh() {
        this.clear();
        for (let i = 0; i < this.container.guestSlots.length; i++) {
            const item = this.container.guestSlots[i];
            const keyValue = item[this.fieldName];
            this.addIndexEntry(keyValue, i);
        }
    }
}