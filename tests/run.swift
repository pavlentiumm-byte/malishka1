import Foundation
import JavaScriptCore
let context = JSContext()!
var failed = false
context.exceptionHandler = { _, exception in print("FAIL: \(exception!)"); failed = true }
for name in ["calendar.js", "collaboration.js", "planning.js", "changelog.js", "app.js"] {
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
for name in ["tests/planning.test.js", "collaboration.js", "planning.js", "changelog.js"] {
    context.evaluateScript(try String(contentsOfFile: name, encoding: .utf8))
}
context.evaluateScript("runPlanningTests()")
if failed { exit(1) }
print("Planning workflow checks passed")
