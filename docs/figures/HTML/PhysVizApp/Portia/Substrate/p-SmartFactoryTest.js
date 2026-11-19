//ps-SmartFactoryTest.js
console.log("Loading SmartFactoryTest");
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";

Registry.initialise();

const sf = new SmartFactory("Space");

let x = await sf.build(
    {
        "Identity": {
            name: "MyTestSpace",
            type: "Thing.Space",
            cls: "Identity"
        },
        "Axes": {
            name: "myAxesSet",
            type: "Set.Axes",
            cls: "Set"
        },
        "Payload":{
            x: "merry Christmas",
        }
    }
)
let y=x.getRoleObject("Payload");
let z=x.getRoleObject("Identity");

