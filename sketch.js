let a;
let num = 0;
let aMonthAgo = '01/07/2020'
let daysAgo = '20/07/2020';
let tags = {};
let selectString = '';
let stringBuffer = '';

// INTERACTION
function keyTyped () {
  if (keyCode === ENTER) {
    selectString = stringBuffer;
    stringBuffer = '';
    sel(selectString);
  } else {
    stringBuffer += key;
  }
}

function mousePressed () {
  a.children.forEach( b => {
    if (dist(mouseX-width/2, mouseY-height/2, b.pos[0],b.pos[1]) < 5) {
      console.log(b.children[0].content);
      console.log(b.children[10].content);
    }
  })
}

//DATA
function preload() {
  // a = loadXML('https://www.senado.cl/wspublico/tramitacion.php?fecha=01/07/2020'+aMonthAgo);
  a = loadXML('proyectos 20-07-29');
  data = loadJSON('bulletins-july29.json');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(a);
  // dataFromXML(a);
  // console.log(data);
  createTags();
  sel('');
}

function draw() {
  clear();
  //ENCODING
  translate(width/2,height/2);
  let i = 0;
  let k = min(windowWidth, windowHeight)/2-20;
  a.children.forEach( b => {
    fill(b.v? 'white': 'gray'), noStroke();
    b.pv = lerp(b.pv,b.v,.05);
    let r = k - b.pv*k*10;
    b.pos = [r*sin(i/283*TWO_PI),r*cos(i/283*TWO_PI)];
    let d = sqrt(b.content.length)/10;
    ellipse(b.pos[0],b.pos[1],d,d);
    i++;
  });
  noStroke(), textAlign(CENTER), fill('white'), textFont('Courier'), textSize(12);
  text (selectString,0,0);

}

function sel(s) {

  let r = 200;
  selectString = s;
  a.children.forEach( b => {
    b.v = 0;
    b.pv? null: b.pv = 0;
    let area = b.children[0].content;
    let counts = countWords(area);
    selectString.split(' ').forEach( s => {
      b.v += counts[s]? counts[s]/area.length*s.length: 0;
    })
    counts = countWords(b.children[10].content);
    selectString.split(' ').forEach( s => {
      b.v += counts[s]? counts[s]/area.length*s.length: 0;
    })
    // console.log(b.content);
  })
  // draw_();
}

// DATA PROCESSING
function dataFromXML (xml) {
  let projects = [];
  for (let i in a.children) {
    let project = a.children[i];
    projects.push({'id': project.content.split(',')[1],
      'name': project.content.split(',')[2],
      // 'tags': project.children.filter(a => a.name === 'materias')[0].content.split('\n')
      'tags': project.children.filter(a => a.name === 'materias')[0].children.map( a => a.content)
    });
  }
  saveJSON(projects, 'bulletins-july.json');
}

function createTags() {
  for (let i = 0; i < Object.keys(data).length; i++) {
    let p = data[i];
    p.links = [];
    p.pos = [random()*width,random()*height];
    let keywords = p.tags;
    p.tags.forEach( k => {
      tags[k]? null: tags[k] = [];
      for (let p2 = 0; p < tags[k].length; p++){
        tags[k][p2].links.push(p);
        p.links.push(tags[k][p2]);
      }
      tags[k].push(p);
    })
  }
  console.log(tags);
  console.log(Object.keys(tags).length + " different tags");
}

function countWords (string) {
  var pattern = /\w+/g,
      matchedWords = string.match( pattern ) || [];
  var counts = matchedWords.reduce(function ( stats, word ) {
      if ( stats.hasOwnProperty( word ) ) {
          stats[ word ] = stats[ word ] + 1;
      } else {
          stats[ word ] = 1;
      }
      return stats;
  }, {} );
  return counts;
};

// AUX
function getChildrenRec(xml, lvl) {
  lvl++;
  stroke(220);
  // line(0,num*10,width,num*10);
  textSize (9), noStroke(), fill(0), textStyle(ITALIC);
  text(xml.getName(),lvl*10,num*10);
  textStyle(NORMAL);
  // if (xml.getContent()) text( xml.getContent().substring(0,100) ,220,num*10);

  console.log(xml.getName());

  if (xml.hasChildren()) {
    let children = xml.getChildren();
    let lastName = '';
    for (let i = 0; i < children.length; i++) {
      if (children[i].getName() === lastName) break;
      getChildrenRec(children[i],lvl,num++);
      lastName = children[i].getName();
    }

  } else {
    return xml;
  }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
