//import { MetaModel } from "./ps-MetaModel.js";
import { Container } from "./ps-Thing.Container.js";
import { Thing } from "./ps-Thing.js";
const cont    = new Container  (null, "TestContainer", null, null)
cont.indexField ("identity.id");
cont.indexField ("identity.name");
cont.indexField ("identity.type");
cont.indexField ("identity.versionNumber");
console.log("Container tested: ", cont);

const myThing = new Thing("Type:Thing", "MyThing", {data: "This is my thing"});
cont.addObject(myThing);
let foundThing = cont.findThing("identity.id", myThing.identity.id);
console.log("Found thing: ", foundThing);
foundThing = cont.findThing("identity.name", myThing.identity.name);
console.log("Found thing: ", foundThing);
foundThing = cont.findThing("identity.type", myThing.identity.type);
console.log("Found thing: ", foundThing);