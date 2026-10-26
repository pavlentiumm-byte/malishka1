import Cocoa
import WebKit
let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let config = WKWebViewConfiguration()
config.websiteDataStore = .nonPersistent()
let view = WKWebView(frame: NSRect(x:0,y:0,width:390,height:844), configuration:config)
let window = NSWindow(contentRect:view.frame,styleMask:[.borderless],backing:.buffered,defer:false)
window.contentView = view
class Delegate: NSObject, WKNavigationDelegate {
    var started = false
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if started { return }; started = true
        let script = try! String(contentsOfFile:"tests/browser.test.js",encoding:.utf8)
        webView.callAsyncJavaScript(script, arguments:[:],in:nil,in:.page) { result in
            switch result {
            case .failure(let error): print("BROWSER FAIL: \(error)"); exit(1)
            case .success(let value):
                print("BROWSER PASS: \(value)")
                webView.takeSnapshot(with:nil) { image,error in
                    if let image=image,let data=image.tiffRepresentation,let bitmap=NSBitmapImageRep(data:data),let png=bitmap.representation(using:.png,properties:[:]) { try? png.write(to:URL(fileURLWithPath:"/tmp/vkadre-mobile-preview.png")) }
                    exit(0)
                }
            }
        }
    }
    func webView(_ webView: WKWebView,didFailProvisionalNavigation navigation:WKNavigation!,withError error:Error) { print(error);exit(1) }
}
let delegate = Delegate()
view.navigationDelegate=delegate
view.load(URLRequest(url:URL(string:"http://127.0.0.1:8001/")!))
DispatchQueue.main.asyncAfter(deadline:.now()+50) { print("Browser test timed out");exit(1) }
app.run()
