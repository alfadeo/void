tags = Object.keys(subjects).sort()
tag = tags[Math.floor(Math.random()*tags.length)]
img = subjects[tag][0]

function about() {
  document.body.innerHTML = ''
  $('body').append('<h1 id="h1">void</h1>')

  $('<button/>', {
    text: "explore", 
    id: "explore",
    click: explore
  }).appendTo('body')

  $('<button/>', {
    text: "portfolio", 
    id: "portfolio",
    click: portfolio
  }).appendTo('body')
}

function explore() {
  document.body.innerHTML = ''
}

function clear_images() {
  for (var i= document.images.length; i-->0;)
    document.images[i].parentNode.removeChild(document.images[i]);
}

function prev() {
  i = subjects[tag].indexOf(img)-1
  if (i<0) i = subjects[tag].length -1
  img = subjects[tag][i]
  show()
}

function next() {
  i = subjects[tag].indexOf(img)+1 % (subjects[tag].length-1)
  if (i >= subjects[tag].length) i = 0
  img = subjects[tag][i]
  show()
}

function show_img(event) {
  img = event.data.param
  show()
}

function show() {
  document.body.innerHTML = ''
  box = $('<div/>', {
    height: "100%",
    style: 'text-align:center'
  })
  $('<img/>', {
    id: img,
    src: "/images/"+img,
    height: "80%"
  }).appendTo(box)
  m = $('<div/>')
  m.css("background","none")
  //b.css("foreground","grey")
  m.css("border","none")
  m.css("margin","10pt")
  m.css("padding","0")
  m.css("color","white")
  b = $('<button/>', {
    text: "prev", 
    id: "prev",
  })
  b.click(prev)
  b.appendTo(m)
  b = $('<button/>', {
    text: "index", 
    id: "index",
  })
  b.click(portfolio)
  b.appendTo(m)

  $('<a/>', {
    text: "download",
    href: "/images/"+img, 
    download: img, 
    id: img,
  }).appendTo(m)
 m.append('<div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button" data-action="like" data-size="small" data-show-faces="false" data-share="true">test</div>')
  /*
  $('<div/>', {
    class: "fb-like" ,
    "data-href": "/images/"+img ,
    "data-layout": "standard" ,
    "data-action": "like" ,
    "data-show-faces": "true",
  }).appendTo(m)
  */

  m.append('<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>')

  b = $('<button/>', {
    text: "next", 
    id: "next",
  })
  b.click(next)
  b.appendTo(m)
  m.appendTo(box)
  box.appendTo('body')
}

function select_tag(event) {
  tag = event.data.param
  portfolio()
}

function index(event) {
  clear_images()
  for (i=0;i<subjects[tag].length;i++) {
    img = $('<img/>', {
      id: subjects[tag], 
      src: "/images/"+subjects[tag][i], 
      height: "10%"
    })
    img.click({param: subjects[tag][i]},show_img)
    img.appendTo('body')
  }
}

function portfolio() {
  document.body.innerHTML = ''
  m = $('<div/>', {text: "void:"})
  m.css("font-weight","Bold")
  m.css("font-size","150%")
  m.css("font-family","Sans")
  for (i=0;i<tags.length;i++) {
    b = $('<button/>', {
      text: tags[i], 
      id: tags[i],
    })
    b.css("background","none")
    //b.css("foreground","grey")
    b.css("border","none")
    b.css("margin","10pt")
    b.css("padding","0")
    b.css("color","white")
    if (tags[i] == tag) {b.css("font-weight","Bold"); b.css("font-size","100%")}//b.css("color","white")
    else {b.css("font-weight","Normal"); b.css("font-size","75%")}//b.css("color","grey")
    b.click({param: tags[i]},select_tag)
    
    b.appendTo(m)
  }
  m.appendTo('body')
  index(tag)
}

$(document).ready( portfolio )
