// simpleTestTester.js

import EventBusInstance
from "../../../pv-eventBus.js";

import { TestContext }
from "../../../rr/UnitTests/smartPtr/testContext.js";

import { TestHints }
from "../../../rr/UnitTests/smartPtr/testHints.js";

import { EventRecorder }
from "../../../p-eventRecorder.js";

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
