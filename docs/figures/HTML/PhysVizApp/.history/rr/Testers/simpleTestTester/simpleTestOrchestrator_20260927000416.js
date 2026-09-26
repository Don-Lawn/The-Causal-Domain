// SimpleTestTester.js

import { TestContext }
from "./pv-testContext.js";

import { TestHints }
from "./pv-testHints.js";

import { EventRecorder }
from "../TestFramework/pv-eventRecorder.js";

import { BusMonitor }
from "../TestFramework/pv-BusMonitor.js";

import { SimpleTestWrapper }
from "./simpleTestWrapper.js";

import EventBusInstance
from "../../../pv-eventBus.js";


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

        EventBusInstance.addMonitor(
            recorder
        );

        const wrapper =
        new SimpleTestWrapper();

        wrapper.execute(
        context,
        hints
        );

        console.log(
        recorder.getText()
        );
    }
}   