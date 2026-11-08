// ps-Index.js

export class Index {
    constructor (fieldName, container) {  
        this.fieldName = fieldName;
        this.container = container;
        this.Map = new Map();  // map of field values to locations in the container.
    }

    findSlotByKey (keyValue)    {
        // find the location of the thing in the container that has the specified key value.
        return this.Map.get(keyValue);
    }

    addSlotEntry (keyValue, slotNumber) {
        this.Map.set(keyValue, slotNumber);
    }                                                               

    removeSlotEntry (keyValue) {
        this.Map.delete(keyValue);
    }   

    clear() {
        this.Map.clear();
    }

    refresh() {
        this.clear();
        for (let i = 0; i < this.container.guestSlots.length; i++) {
            const item = this.container.guestSlots[i];
            const keyValue = item[this.fieldName];
            this.addSlotEntry(keyValue, i);
        }
    }
}