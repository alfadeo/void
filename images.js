unvisited = Object.keys(distances)
current = null
selected = []

function init() {
  path = location.pathname.replace("/","")
  if (path == '' || path == 'index.html') {
    current = unvisited[Math.floor(Math.random()*unvisited.length)]
    selected = []
  }
  else { current = path.replace(".html","") }
  select()
  update()
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
  console.log(unvisited.length)
  if (unvisited.length < 8) { unvisited = Object.keys(distances) }
  console.log(unvisited.length)
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
