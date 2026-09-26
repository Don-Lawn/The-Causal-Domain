// SimpleTestTester.js
 
import { TestContext }
from "./pv-testContext.js";
 
import { TestHints }
from "./pv-testHints.js";
 
import { EventRecorder }
from "./pv-eventRecorder.js";
 
import { BusMonitor }
from "./pv-busMonitor.js";
 
import { SimpleTestWrapper }
from "./simpleTestWrapper.js";
 
export class SimpleTestTester
{
execute()
{
const context =
new TestContext();
 
const hints =
new TestHints();
 
const recorder =
new EventRecorder();
 
const monitor =
new BusMonitor(
recorder
);
 
//
// Hook monitor to bus here
//
 
const wrapper =
new SimpleTestWrapper();
 
wrapper.execute(
context,
hints
);
 
console.log(
recorder.getText()
);