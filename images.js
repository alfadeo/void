unvisited = Object.keys(distances)
current = null
selected = []

document.addEventListener('keyup', function(event) {
  if(event.keyCode == 37) { prev() } // left
  else if(event.keyCode == 39) { next() } // right
  else if(event.keyCode == 32) {
    if ( $("#play").attr("onclick") == "stop()" ) { stop() }
    else { play() }
    //next()
  } // space
  else if(event.keyCode == 13) { reload() } // enter
  //else { alert(event.keyCode) }
});

function init() {
  path = location.pathname.replace("/","")
  if (path == '' || path == 'index.html') {
    current = unvisited[Math.floor(Math.random()*unvisited.length)]
    selected = []
  }
  else { current = path.replace(".html","") }
  select()
  update()
  play()
}

function reload() {
  current = unvisited[Math.floor(Math.random()*unvisited.length)]
  selected = []
  select()
  update()
}

function select() {
  tuples = []
  for (key in distances[current]) {
    if (unvisited.indexOf(key) > -1) {
      tuples.push([key, distances[current][key]])
    }
  }
  selected = tuples.sort(function(a,b) {
    a = a[1]
    b = b[1]
    return a < b ? -1 : (a > b ? 1 : 0)
  }).slice(0,8).map(function(a) { return a[0] })
  for (i=0;i<8;i++) {
    idx = unvisited.indexOf(selected[i])
    unvisited.splice(idx,1)
  }
  if (unvisited.length < 8) { unvisited = Object.keys(distances) }
}

function play() {
  playing = setInterval(function () { next() }, 3000);
  $("#play-indicator").attr("src", "/icons/stop.svg")
  $("#play").attr("onclick","stop()")
  $(".prev").hide()
  $(".next").hide()
}

function stop() {
  clearInterval(playing)
  $("#play-indicator").attr("src", "/icons/play.svg")
  $("#play").attr("onclick","play()")
  $(".prev").show()
  $(".next").show()
}


function prev() {
  i = (selected.indexOf(current)-1+selected.length) % selected.length // js % cannot handle negative values
  current = selected[i]
  update()
}

function next() {
  i = (selected.indexOf(current)+1) % selected.length
  current = selected[i]
  update()
}

function update() {
  history.pushState(null, null, current+".html")
  $("#image").attr("src","/images/"+current)
  $("#download").attr("href","/images/"+current)
  $("#download").attr("download","/images/"+current)
  $("#buy").attr("href","mailto:void@alfadeo.de?subject="+current+"&body=Please specify your preferred size:")
  $("#mail").attr("href","mailto:?subject="+current)
  $(".fb-like").attr("data-href",window.location.href)
}

$(document).ready( init )
