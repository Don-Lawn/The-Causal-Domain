// ---------------------------------------------------------------------------
// testPropertySet.js
//
// Simple PropertySet test harness.
//
// ---------------------------------------------------------------------------

import { PropertySet } from "../../../pv-propertySet.js";

export function testPropertySet()
{
    console.log(
        "Testing PropertySet..."
    );

    const propertySet = new PropertySet();

    propertySet.loadFile(
        "../../../rr/Objects/phaseWedge/PhaseWedge.common.Properties.json"
    );

    console.log(
        "Loaded Files:",
        propertySet.propertyFiles
    );

    console.log(
        "Properties:",
        propertySet.properties
    );
}

