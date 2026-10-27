import Foundation
import JavaScriptCore
let context = JSContext()!
var failed=false
context.exceptionHandler = { _, exception in print("FAIL: \(exception!)");failed=true }
for name in ["shoots-store.js","shoots.js"] {
    context.objectForKeyedSubscript("Function").call(withArguments:[try String(contentsOfFile:name,encoding:.utf8)])
}
for name in ["tests/shoots-store.test.js","shoots-store.js"] {
    context.evaluateScript(try String(contentsOfFile:name,encoding:.utf8))
}
context.evaluateScript("runShootStoreTests()")
if failed { exit(1) }
print("Shoot repository checks passed")
