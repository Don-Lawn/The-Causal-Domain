// simpleTestTester.js

import EventBusInstance
from "../../../pv-eventBus.js";

import { TestContext }
from "./testContext.js";

import { TestHints }
from "./testHints.js";

import { EventRecorder }
from "./eventRecorder.js";

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

        //
        // Hook recorder into the bus
        //
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

        return context;
    }
}
