// ut-smartPtr.js

import { TestObject }
from "./testObject.js";

import { ObjectRegistry }
from "./p-objectRegistry.js";

import { SmartPtr }
from "./p-smartPtr.js";

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
}