// ut-smartPtr.js

import { ObjectRegistry }
from "../../../p-objectRegistry.js";

import { Ptr, SmartPtr }
from "../../../p-smartPtr.js";

import { TestObject }
from "./uto-testObject.js";

export function runSmartPtrTest()
{
    const defaultColourMap =
        new TestObject(
            17,
            "DefaultColourMap"
        );

    ObjectRegistry.addObject(
        defaultColourMap
    );

    const fred =
    {
        name : "Fred"
    };

    fred.colourMapPtr =
        new SmartPtr(
            defaultColourMap
        );

    const target =
        fred.colourMapPtr
            .getObject();

    console.log(
        target.name
    );

    console.log(
        target.objectId
    );

    const json =
    fred.colourMapPtr.toJSON();

    console.log( json);

    const ptr2 =
        new Ptr();
        
    ptr2.fromJSON(
        json
    );

    console.log(
        ptr2.getObject()
    );
}
runSmartPtrTest();