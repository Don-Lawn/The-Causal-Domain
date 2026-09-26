import { SimpleTestTester } from "../simpleTestTester/simpleTestTester.js";
console.log(
"p-addTestButton.js loaded"
);
const testBtn =
    document.getElementById(
        "testBtn"
    );

if (testBtn)
{
    testBtn.addEventListener(
        "click",
        function ()
        {
            const tester =
                new SimpleTestTester();

            tester.execute();
        }
    );
}