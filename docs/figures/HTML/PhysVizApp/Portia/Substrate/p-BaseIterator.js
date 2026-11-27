// p-BaseIterator.js
import { SmartPtr } from "./p-SmartPtr.js";


export const ListNav = {
    FIRST: "first",
    LAST: "last",
    SUCCESSOR: "successor",
    PREDECESSOR: "predecessor"
};

export class BaseIterator {
    constructor(collection, map) {
        this.collection = collection;
        this.parked = -1
        this.currentPos = this.parked;
        this.keys= Array.from(map.keys());
        this.map = map;

    }

    move(role) {
        switch (role) {
            case ListNav.FIRST:
                this.park();  
                this.currentPos++;
                return ! this.isParked();

            case ListNav.SUCCESSOR:
                if (this.isParked()) 
                    this.park()// looks stupid, but avoids confusion between the two ends.
                this.currentPos ++
                return ! this.isParked();

            case ListNav.LAST:
                this.currentPos = this.keys.length;// looks stupid, but avoids confusion between the two ends.
                this.currentPos--;
                return ! this.isParked();

            case ListNav.PREDECESSOR: 
                if (this.isParked()) 
                this.currentPos = this.keys.length;// looks stupid, but avoids confusion between the two ends.
                this.currentPos--;
                return ! this.isParked();
        }
    }

   
    isParked() {
        return (this.currentPos === this.parked || 
            this.currentPos < 0 || 
            this.currentPos >= this.keys.length) ;
    }
    
    park() {
        this.currentPos = this.parked;
    }

    current() {
        if (this.isParked()) {
            return null;
        } else {
            const key = this.keys[this.currentPos];
            let obj= this.map.get(key);
            return obj;
        }
    }
}


export class CollectionIterator extends BaseIterator {
    constructor(collection) {
        super(collection, collection.members);
    }    
}

export class IndexIterator extends BaseIterator {
    constructor(index) {
        super(index, index.indexMap);
    }
}

export class AspectIterator extends BaseIterator {
    constructor(aggregate) {
        super(aggregate, aggregate.indexAspectToParts);
    }   
}

export { BaseIterator as ListIterator };