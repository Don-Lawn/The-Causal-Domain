//TestSourceFile.js
import { SourceFile } from "./p-sourceFile.js";
import { PropertySet}   from "../pv-propertySet.js";

async function Test (sourceFilePath)
{
    const baseObjectSource = new SourceFile("../pv-baseObject.js", "BaseObject");
    let baseObjParams = new PropertySet()
    baseObjParams = await baseObjectSource.creatObject("BaseObject", baseObjParams);
}

Test("./RDF.OWL/RDF.TestHarness.js");