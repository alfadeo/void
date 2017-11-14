use Rack::Session::Pool
use Rack::Static, :urls => ["/images","/icons"] 

def select env
  distances = Marshal.load(File.read("images/meta.marshal"))
  images = distances.keys
  env['rack.session'][:visited] ||= []
  env['rack.session'][:visited] = [] if env['rack.session'][:visited].size >= images.size
  env['rack.session'][:current] ||= (images-env['rack.session'][:visited]).sample
  env['rack.session'][:selection] = distances[env['rack.session'][:current]].sort_by{|d| d[1]}.select{|d| !env['rack.session'][:visited].include?(d[0])}[0..7].collect{|d| d[0]}.shuffle
  if env['rack.session'][:selection].include?(nil)
    env['rack.session'][:visited] = []
    env['rack.session'][:selection] = distances[env['rack.session'][:current]].sort_by{|d| d[1]}.select{|d| !env['rack.session'][:visited].include?(d[0])}[0..7].collect{|d| d[0]}.shuffle
  end
  env['rack.session'][:visited] += env['rack.session'][:selection]
  env
end

run Proc.new { |env|

  case env["REQUEST_PATH"]

  when "/"
    env['rack.session'][:current] = nil
    env = select env
    [ 302, {'Location' => env['rack.session'][:current]+".html"}, [] ]

  when /html/

    env['rack.session'][:current] = env["REQUEST_PATH"].sub(/^\//,'').sub(/\.html$/,"")
    path = File.join "/images",env['rack.session'][:current]
    puts "RELOAD" unless env['rack.session'][:selection]
    env = select(env) unless env['rack.session'][:selection]
    i = env['rack.session'][:selection].index(env['rack.session'][:current])
    puts env['rack.session'][:selection]
puts '--'
puts env['rack.session'][:current]
puts i.class
    n = (i+1)%env['rack.session'][:selection].size
    p = (i-1)%env['rack.session'][:selection].size
    uri = CGI::escape("http://"+File.join(env["HTTP_HOST"], env["REQUEST_URI"])) # redirects don't have env["HTTP_REFERER"]

    html = "
      <html5>
        <head>
          <meta charset='utf-8'/>
          <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        </head>
        <body bgcolor='black' text='white'>
          <div id='fb-root'></div>
          <script>(function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));</script>
          <script type='text/javascript' async defer src='//assets.pinterest.com/js/pinit.js'></script>
          <style>
            body {max-width:100%;max-height:100%;text-align:center}
            img {max-width:90%; }
            .nav {color: black; font-size:20em;}
            .nav:hover {color: darkgrey; text-decoration: none; }
          </style>
<div>
          <a class='nav' href=#{env['rack.session'][:selection][p]+'.html'}>&lt;</a>
          <img src=#{path}/>
          <a class='nav' href=#{env['rack.session'][:selection][n]+'.html'}>&gt;</a>
</div>
          <div color='white'>
slideshow: 
            <a href='/about'>about</a>
            <a href='/'>next slideshow</a>
            <a href='mailto:void@alfadeo.de?subject=#{env['rack.session'][:current]}&body=Please specify your preferred size:'>original artwork</a>
            Share
          	<a rel='license' href='http://creativecommons.org/licenses/by-sa/4.0/'><img alt='Creative Commons License' style='border-width:0' src='https://i.creativecommons.org/l/by-sa/4.0/80x15.png' /></a>:
            <a href=#{path} download=#{env['rack.session'][:current]}><img src='/icons/download.png' alt='download'></a>
            <a href='mailto:?subject=#{env['rack.session'][:current]}&body=#{uri}'><img src='/icons/mail.png' alt='mail'></a>
<div class='fb-like' data-href='#{uri}' data-layout='button' data-action='like' data-size='small' data-show-faces='false' data-share='true'></div>
            <a href='https://twitter.com/share?ref_src=twsrc%5Etfw' class='twitter-share-button' data-show-count='false'></a>
            <script async src='//platform.twitter.com/widgets.js' charset='utf-8'></script>
            <a class='tumblr-share-button' data-color='blue' data-notes='none' href='https://embed.tumblr.com/share'></a>
            <script>!function(d,s,id){var js,ajs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://assets.tumblr.com/share-button.js';ajs.parentNode.insertBefore(js,ajs);}}(document, 'script', 'tumblr-js');</script>
            <a href='https://www.pinterest.com/pin/create/button/' data-pin-do='buttonBookmark'> </a>
          </div>
        </body>
      </html>"

    ['200', {'Content-Type' => 'text/html'}, [html]]

  when "/about"
    html = "slideshows are generated by a simple algorithm (github link). Results are sometimes 'interesting'. like in real life there is no undo button.if you have missed an image, you will never find it again (unless you are *very* patient. BUT you can downlad images that you like or share it on social media. Your followers will see a completely different picture of my work."
    ['200', {'Content-Type' => 'text/html'}, [html]]

  else
    [ 302, {'Location' => "/"}, [] ]
  end
}
