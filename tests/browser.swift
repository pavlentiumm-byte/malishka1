import Cocoa
import WebKit
let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let config = WKWebViewConfiguration()
// A uniquely isolated store supports IndexedDB Blob round trips in WebKit.
// Ephemeral WebKit stores on this OS reject Blob transactions.
config.websiteDataStore = WKWebsiteDataStore(forIdentifier: UUID())
func finish(_ code: Int32) {
    config.websiteDataStore.removeData(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), modifiedSince: .distantPast) { exit(code) }
}
let width = CommandLine.arguments.count > 1 ? Double(CommandLine.arguments[1]) ?? 390 : 390
let testScript = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "tests/browser.test.js"
config.userContentController.addUserScript(WKUserScript(source: "window.__testErrors=[];addEventListener('error',e=>{if(e.message)window.__testErrors.push(e.message);});addEventListener('unhandledrejection',e=>window.__testErrors.push(String(e.reason)));", injectionTime:.atDocumentStart, forMainFrameOnly:true))
let view = WKWebView(frame: NSRect(x:0,y:0,width:width,height:900), configuration:config)
let window = NSWindow(contentRect:view.frame,styleMask:[.borderless],backing:.buffered,defer:false)
window.contentView = view
class Delegate: NSObject, WKNavigationDelegate {
    var started = false
    var phase = 0
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if started { return }; started = true
        let script = try! String(contentsOfFile:phase == 0 ? testScript : CommandLine.arguments[4],encoding:.utf8)
        let checkedScript = "let result;try{result=await (async()=>{\n" + script + "\n})();}catch(e){throw Error((window.__testPhase||'scenario')+': '+e.message+' | '+e.stack);}if(window.__testErrors.length)throw Error(window.__testErrors.join(' | '));return result;"
        webView.callAsyncJavaScript(checkedScript, arguments:[:],in:nil,in:.page) { result in
            switch result {
            case .failure(let error): print("BROWSER FAIL: \(error) \((error as NSError).userInfo)"); finish(1)
            case .success(let value):
                print("BROWSER PASS: \(value)")
                if self.phase == 0 && CommandLine.arguments.count > 4 {
                    self.phase=1;self.started=false;webView.reload();return
                }
                webView.takeSnapshot(with:nil) { image,error in
                    if let image=image,let data=image.tiffRepresentation,let bitmap=NSBitmapImageRep(data:data),let png=bitmap.representation(using:.png,properties:[:]) { try? png.write(to:URL(fileURLWithPath:"/tmp/vkadre-preview-\(Int(width)).png")) }
                    finish(0)
                }
            }
        }
    }
    func webView(_ webView: WKWebView,didFailProvisionalNavigation navigation:WKNavigation!,withError error:Error) { print(error);finish(1) }
}
let delegate = Delegate()
view.navigationDelegate=delegate
view.load(URLRequest(url:URL(string:CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : "http://127.0.0.1:8001/")!))
DispatchQueue.main.asyncAfter(deadline:.now()+90) { print("Browser test timed out");finish(1) }
app.run()
