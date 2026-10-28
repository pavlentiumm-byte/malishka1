import Foundation
import JavaScriptCore
let context = JSContext()!
var failed = false
context.exceptionHandler = { _, exception in print("FAIL: \(exception!)"); failed = true }
for name in ["calendar.js", "collaboration.js", "availability.js", "planning.js", "castings.js", "casting-editor.js", "changelog.js", "auth.js", "interface.js", "shoots-store.js", "shoots.js", "workspace-store.js", "workspace.js", "profile-work-store.js", "profile-work.js", "discovery-store.js", "discovery.js", "motion.js", "app.js"] {
    let source = try String(contentsOfFile: name, encoding: .utf8)
    context.objectForKeyedSubscript("Function").call(withArguments: [source])
    print("Parsed \(name)")
}
// JavaScriptCore has no browser URL class. Supply Foundation parsing for these unit tests.
let parseURL: @convention(block) (String) -> [String:String]? = { value in
    guard let url = URLComponents(string: value), let scheme = url.scheme else { return nil }
    return ["protocol": scheme + ":", "username": url.user ?? "", "password": url.password ?? "", "href": url.string ?? value]
}
context.setObject(parseURL, forKeyedSubscript: "parseTestURL" as NSString)
context.evaluateScript("class URL { constructor(value) { const parts=parseTestURL(value); if(!parts)throw Error('Invalid URL'); Object.assign(this,parts); } }")
for name in ["tests/planning.test.js", "discovery-store.js", "collaboration.js", "availability.js", "planning.js", "castings.js", "casting-editor.js", "changelog.js"] {
    context.evaluateScript(try String(contentsOfFile: name, encoding: .utf8))
}
context.evaluateScript("runPlanningTests()")
context.evaluateScript(try String(contentsOfFile: "tests/castings.test.js", encoding: .utf8))
context.evaluateScript("runCastingTests()")
context.evaluateScript(try String(contentsOfFile: "tests/availability.test.js", encoding: .utf8))
context.evaluateScript("runAvailabilityTests()")
context.evaluateScript(try String(contentsOfFile: "workspace-store.js", encoding: .utf8))
context.evaluateScript(try String(contentsOfFile: "tests/workspace.test.js", encoding: .utf8))
context.evaluateScript("runCreativeTests()")
context.evaluateScript(try String(contentsOfFile: "profile-work-store.js", encoding: .utf8))
context.evaluateScript(try String(contentsOfFile: "tests/profile-work.test.js", encoding: .utf8))
context.evaluateScript("runProfileWorkTests()")
context.evaluateScript(try String(contentsOfFile: "tests/discovery.test.js", encoding: .utf8))
context.evaluateScript("runDiscoveryTests()")
if failed { exit(1) }
print("Planning workflow checks passed")
