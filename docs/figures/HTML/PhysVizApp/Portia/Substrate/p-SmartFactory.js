// ps-SmartFactory.js
console.log("Loading SmartFactory");
import { JsonFile } from "./p-FileJson.js";
import { Aggregate } from "./p-Aggregate.js";
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";
import { PropertySet } from "./p-propertySet.js";
import { normalize } from "path";

export class SmartFactory {
    constructor(type) {
        this.classInstructions = Registry.loadType(type);
        AssertNotNull (this.classInstructions, `SmartFactory - No instructions found for type: ${type} 
            in file "./Metadata/metadata.factory.Map.typeToInstructions.json"`);
           
    }


    async processInstructions(aggr, instructionsPs) {
        if (! instructionsPs)
            return;
        if (!instructionsPs.tree.aspects)
            return;

        for (const [aspect, {cls, type, name, part}] of Object.entries(instructionsPs.tree.aspects)) {
            if (part)
                aggr.addAspect (aspect, part);
            else if (cls) {
                let aspectInstr = instructionsPs.tree.aspects[aspect];
                await aggr.addNewAspect(aspect, cls, aspectInstr);
            }
            else if (instructionsPs.tree.aspects && instructionsPs.tree.aspects[aspect])
                aggr.addAspect(aspect, instructionsPs.tree.aspects[aspect]);
        }
    }

    async build( objInstructions = null) {
        this.objInstructions = objInstructions;
        let result = new Aggregate(this.classInstructions, this.objInstructions);
        this.ps = new PropertySet (this.classInstructions);
        //this.objPs = new PropertySet (this.objInstructions);
        this.ps.merge(objInstructions);

        await this.processInstructions(result, this.ps);

        return result;
    }

    MakeChildThing( name, type, objinstructions=null )
    {   
        let metadata = {
            aspects: {
                "Identity": {
                    name: name,
                    type: type,
                    cls: "Identity"
                }, // end of Identity
                "Child":{ cls: "Child" }
            } // end of aspects
        }; // end of metadata
        return this.build(metadata.merge(objinstructions));
    }
    MakeBaseThing( name, type, objinstructions = null )
    {   
        let metadata = new PropertySet(
        {
            aspects: {
                "Identity": {
                    name: name,
                    type: type,
                    cls: "Identity"
                } // end of Identity
            } // end of aspects
        }); // end of metadata
    
        return this.build(metadata.merge(objinstructions));
    }

    MakeParentThing( name, type, objinstructions = null )
    {   
        let metadata = new PropertySet({
            aspects:{
                "Identity": {
                    name: name,
                    type: type,
                    cls: "Identity"
                }, // end of Identity
                "Children": {
                    name: "Children",
                    type: "Collection.Children",
                    cls: "Collection",
                } // end of Children
            } // end of aspects
        });   // end of metadata

        return this.build(metadata.merge(objinstructions));
    }
}