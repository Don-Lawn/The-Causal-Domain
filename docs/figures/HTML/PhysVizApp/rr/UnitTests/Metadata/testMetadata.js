// ---------------------------------------------------------------------------
// testMetadata.js
//
// Simple Metadata test harness.
//
// ---------------------------------------------------------------------------

import { Metadata } from "../../../p-metadata.js";

export function testMetadata()
{
    console.log(
        "Testing Metadata..."
    );

    const metadata = new Metadata();

    metadata.loadFile(
        "../../../rr/Objects/phaseWedge/PhaseWedge.Constructor.Metadata.json"
    );

    metadata.validate();
    
    const propertySet = metadata.buildPropertySet();


    console.log(
        "Loaded Files:",
        metadata.propertySetFiles
    );

    console.log(
        "Metadata:",
        metadata
    );
}

