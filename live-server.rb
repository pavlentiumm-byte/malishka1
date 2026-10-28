#!/usr/bin/env ruby
# frozen_string_literal: true

require "webrick"

ROOT = File.expand_path(__dir__)
PORT = Integer(ENV.fetch("PORT", "8000"))

RELOAD_SCRIPT = <<~HTML
  <script>
  (function () {
    var stamp = "__INITIAL_STAMP__";
    function check() {
      fetch("/__mtime", { cache: "no-store" })
        .then(function (res) { if (!res.ok) throw new Error("Reload check failed"); return res.text(); })
        .then(function (value) {
          if (stamp && stamp !== value) location.reload();
          stamp = value;
        })
        .catch(function () {});
    }
    setInterval(check, 400);
    check();
  })();
  </script>
  </body>
HTML

def latest_mtime
  newest = 0.0
  Dir.glob(File.join(ROOT, "**", "*")).each do |path|
    next unless File.file?(path)
    next if File.basename(path).start_with?(".")
    mtime = File.mtime(path).to_f
    newest = mtime if mtime > newest
  end
  format("%.6f", newest)
end

server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: PORT,
  AccessLog: [],
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN)
)

server.mount_proc "/" do |req, res|
  path = req.path

  if path == "/__mtime"
    res.status = 200
    res["Content-Type"] = "text/plain; charset=utf-8"
    res["Cache-Control"] = "no-store"
    res.body = latest_mtime
    next
  end

  path = "/index.html" if path == "/" || path == "/kadr.html"

  file = File.expand_path(File.join(ROOT, path.sub(%r{\A/}, "")))
  unless file.start_with?(ROOT + File::SEPARATOR) && File.file?(file)
    res.status = 404
    res.body = "Not found"
    next
  end

  body = File.binread(file)
  type = WEBrick::HTTPUtils.mime_type(file, WEBrick::HTTPUtils::DefaultMimeTypes)
  if file.end_with?(".html")
    type = "text/html; charset=utf-8"
    body = body.sub("</body>", RELOAD_SCRIPT.sub("__INITIAL_STAMP__", latest_mtime)) if body.include?("</body>")
  end

  res.status = 200
  res["Content-Type"] = type
  res["Cache-Control"] = "no-store"
  res.body = body
end

trap("INT") { server.shutdown }
trap("TERM") { server.shutdown }

$stdout.puts "http://127.0.0.1:#{PORT}/#home"
$stdout.flush
server.start
