//TestSourceFile.js
import { SourceFile } from "../p-SourceFile.js";
import { PropertySet}   from "../pv-propertySet.js";

function Test ()
{
    const sourceFilePath = "./RDF.OWL/RDF.TestHarness.js";
    const baseObjSource = new SourceFile("../pv-baseObject.js", "BaseObject");
    const baseObjParams = new PropertySet()
    baseObjParams = await baseObjSource.creatObject("../pv-baseObject.js", "BaseObject", baseObjParams);
}

Test();