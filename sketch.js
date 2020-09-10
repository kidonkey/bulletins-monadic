// Monadic Congress Bulletins Explorer
// Baltazar Perez
// @ibltzr
//
// Instructions
// Type and Enter to look up words
// Click on a node to display on console

let a;
let selectedString = '';
let stringBuffer = '';



function foo(obj) {
  console.log(obj);
}

// INTERACTION
function keyTyped () {
  if (keyCode === ENTER) {
    selectedString = stringBuffer;
    stringBuffer = '';
    makeSelection(selectedString);
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

function aMonthAgo() { // Generate date for a month ago (needs FIXING)
  let today = new Date();
  let dd = String(today.getDate()+1).padStart(2, '0');
  let mm = String((today.getMonth()-1 < 0? 11: today.getMonth()-1)+1).padStart(2, '0'); //January is 0!
  let yyyy = today.getMonth()-1 < 0? today.getFullYear()-1: today.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

function preload() {
  // To load directly from Congress API (very slow)
  // 'fecha' must not surpass a month from present date
  // a = loadXML('https://www.senado.cl/wspublico/tramitacion.php?fecha=13/08/2020');
  a = loadXML('tramitacion.php');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log('Encontrados' + a.children.length + ' proyectos con actividad entre 19/08/2020 al 10/09/2020')

  console.log(a);
  // dataFromXML(a);
  // noLoop();
  makeSelection('');
}

function draw() {
  clear();
  translate(width/2,height/2);
  let i = 0;
  let k = min(windowWidth, windowHeight)/2-20;
  let n = a.children.length;
  a.children.forEach( b => {
    fill(b.v? 'white': 'gray'), noStroke();
    b.pv = lerp(b.pv,b.v,.05);
    let r = k - b.pv*k*10;
    b.pos = [r*sin(i/n*TWO_PI),r*cos(i/n*TWO_PI)];
    let d = sqrt(b.content.length)/10;
    ellipse(b.pos[0],b.pos[1],d,d);
    i++;
  });
  noStroke(), textAlign(CENTER), fill('white'), textFont('Courier'), textSize(12);
  text (selectedString,0,0);

}

function makeSelection(s) {
  let r = 200;
  selectedString = s;
  a.children.forEach( b => {
    b.v = 0;
    b.pv? null: b.pv = 0;
    let area = b.children[0].content;
    let counts = countWords(area);
    selectedString.split(' ').forEach( s => {
      b.v += counts[s]? counts[s]/area.length*s.length: 0;
    })
    counts = countWords(b.children[10].content);
    selectedString.split(' ').forEach( s => {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
