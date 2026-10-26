#!/usr/bin/env ruby
# Downloads demo images locally; updates HTML only after every image is verified.
require "fileutils"
require "open3"
root = File.expand_path(__dir__)
html_path = File.join(root, "kadr.html")
html = File.read(html_path)
directory = File.join(root, "assets", "demo")
FileUtils.mkdir_p(directory)
portraits = %w[team-1.jpg team-2.jpg ivana-square.jpg bruce-mars.jpg]
photo_block = html[/const demoPhotoIds = \[([\s\S]*?)\];/, 1]
abort "Cannot find demo photo list" unless photo_block
photo_ids = photo_block.scan(/photo-[a-zA-Z0-9-]+/)
jobs = portraits.map { |name| [name, "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-dashboard/assets/img/#{name}"] }
jobs += photo_ids.map { |id| ["#{id}.jpg", "https://images.unsplash.com/#{id}?auto=format&fit=max&w=1200&q=80"] }
queue = Queue.new
jobs.each { |job| queue << job }
failures = Queue.new
valid_image = lambda do |path|
  next false unless File.file?(path) && File.size(path) > 1024
  bytes = File.binread(path, 12)
  bytes.start_with?("\xFF\xD8".b) || bytes.start_with?("\x89PNG".b) || (bytes.start_with?("RIFF") && bytes[8,4] == "WEBP")
end
Array.new(4) do
  Thread.new do
    loop do
      begin
        name, url = queue.pop(true)
      rescue ThreadError
        break
      end
      target = File.join(directory, name)
      next if valid_image.call(target)
      temporary = target + ".download"
      _, error, status = Open3.capture3("curl", "-fLsS", "--connect-timeout", "10", "--max-time", "45", "--retry", "1", url, "-o", temporary)
      if status.success? && valid_image.call(temporary)
        File.rename(temporary, target)
        puts "Saved #{name}"
      else
        File.delete(temporary) if File.exist?(temporary)
        failures << name
        warn "Failed #{name}: #{error.strip}"
      end
    end
  end
end.each(&:join)
abort "Some images could not be downloaded. Run this script again to retry." unless failures.empty?
# Read again to preserve edits made while downloads were running.
html = File.read(html_path)
html.sub!('"https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-dashboard/assets/img/" + name', '"assets/demo/" + name')
html.sub!('src:`https://images.unsplash.com/${demoPhotoIds[(offset+i)%demoPhotoIds.length]}?auto=format&fit=max&w=1200&q=80`', 'src:`assets/demo/${demoPhotoIds[(offset+i)%demoPhotoIds.length]}.jpg`')
File.write(html_path, html)
puts "Done: #{jobs.length} local demo images. Reload the page."
