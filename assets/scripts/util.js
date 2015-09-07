
window.AudioContext = window.AudioContext||window.webkitAudioContext;

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				 timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

var sin_cache={};

function round(n) {
  return Math.round(n);
}

function abs(n) {
  return Math.abs(n);
}

function sin(v) {
  return(Math.sin(v));
  if(!v in sin_cache)
    sin_cache[v]=Math.sin(v);
  return(sin_cache[v]);
}

function cos(v) {
  return(sin(v+Math.PI/2));
}

function tan(v) {
  return Math.tan(v);
}

function normalize(v,length) {
  var x=v[0];
  var y=v[1];
  var angle=Math.atan2(x,y);
  if(!length)
    length=1;
  return([
    sin(angle)*length,
    cos(angle)*length
  ]);
}

function fl(n) {
  return Math.floor(n);
}

function randint(l,h) {
  return(Math.floor(Math.random()*(h-l+1))+l);
}

function elements(obj) {
  var n=0;
  for(var i in obj)
    n+=1;
  return n;
}

function s(i) {
  if(i == 1)
    return "";
  else
    return "s";
}

function within(n,c,r) {
  if((n > c+r) || (n < c-r))
    return false;
  return true;
}

function trange(il,i,ih,ol,oh) {
  return(ol+(oh-ol)*(i-il)/(ih-il));
  i=(i/(ih-il))-il;
  return (i*(oh-ol))+ol;
}

function clamp(l,i,h) {
  if(h == null) {
    if(l > i)
      return l;
    return i;
  }
  var temp;
  if(l > h) {
    temp=h;
    h=l;
    l=temp;
  }
  if(l > i)
    return l;
  if(h < i)
    return h;
  return i;
}

function crange(il,i,ih,ol,oh) {
  return clamp(ol,trange(il,i,ih,ol,oh),oh);
}

function srange(il,i,ih) {
  //    return Math.cos();
}

function distance2d(a,b) {
  var x=a[0]-b[0];
  var y=a[1]-b[1];
  return Math.sqrt((x*x)+(y*y));
}

function degrees(radians) {
  return (radians/(Math.PI*2))*360;
}

function radians(degrees) {
  return (degrees/360)*(Math.PI*2);
}

function choose(l) {
  return l[Math.floor(Math.random()*l.length)];
}

function choose_weight(l) {
  if(l.length == 0) return;
  if(typeof l[0] != typeof []) return choose(l);
  // l = [[item, weight], [item, weight] ... ];
  var weight  = 0;
  for(var i=0;i<l.length;i++) {
    weight += l[i][1];
  }
  var random = Math.random() * weight;
  weight     = 0;
  for(var i=0;i<l.length;i++) {
    weight += l[i][1];
    if(weight > random) {
      return l[i][0];
    }
  }
  console.log("OHSHIT");
  return(null);
}


function mod(a, b) {
  return ((a%b)+b)%b;
};

function lpad(n, width) {
  if (n.toString().length >= width) return n.toString();
  var x = "0000000000000" + n;
  return x.substr(x.length-width, width);
}

function angle_offset(a, b) {
  a = degrees(a);
  b = degrees(b);
  var invert=false;
  if(b > a) {
    invert=true;
    var temp=a;
    a=b;
    b=temp;
  }
  var offset=mod(a-b, 360);
  if(offset > 180) offset -= 360;
  if(invert) offset *= -1;
  offset = radians(offset);
  return offset;
}

function average() {
  var sum = 0;
  for(var i=0;i<arguments.length;i++) sum += arguments[i];
  return sum / arguments.length;
}

function heading_to_string(heading) {
  heading = round(mod(degrees(heading), 360));
  if(heading == 0) heading = 360;
  return heading;
}

var radio_names = {
  0:"zero",
  1:"one",
  2:"two",
  3:"three",
  4:"four",
  5:"five",
  6:"six",
  7:"seven",
  8:"eight",
  9:"niner",
  a:"alpha",
  b:"bravo",
  c:"charlie",
  d:"delta",
  e:"echo",
  f:"foxtrot",
  g:"golf",
  h:"hotel",
  i:"india",
  j:"juliet",
  k:"kilo",
  l:"lima",
  m:"mike",
  n:"november",
  o:"oscar",
  p:"papa",
  q:"quebec",
  r:"romeo",
  s:"sierra",
  t:"tango",
  u:"uniform",
  v:"victor",
  w:"whiskey",
  x:"x-ray",
  y:"yankee",
  z:"zulu",
  "-":"dash",
  ".":"point",
};

var radio_compass_names = {
  "n":"north",
  "w":"west",
  "s":"south",
  "e":"east",
};

var radio_runway_names = clone(radio_names);

radio_runway_names.l = "left";
radio_runway_names.c = "center";
radio_runway_names.r = "right";

function radio(input) {
  input = input + "";
  input = input.toLowerCase();
  var s = [];
  for(var i=0;i<input.length;i++) {
    var c = radio_names[input[i]];
    if(c) s.push(c);
  }
  return s.join(" ");
}

function radio_runway(input) {
  input = input + "";
  input = input.toLowerCase();
  var s = [];
  for(var i=0;i<input.length;i++) {
    var c = radio_runway_names[input[i]];
    if(c) s.push(c);
  }
  return s.join(" ");
}

function radio_compass(input) {
  input = input + "";
  input = input.toLowerCase();
  var s = [];
  for(var i=0;i<input.length;i++) {
    var c = radio_compass_names[input[i]];
    if(c) s.push(c);
  }
  return s.join(" ");
}

// Convert position relative to origin to a radio text.
function radio_position(pos, origin) {
  if (!origin) origin = [0, 0];
  var position = "";
  var distance = round(distance2d(origin, pos) * 0.62);
  position += distance + " mile" + s(distance);
  var angle = Math.atan2(pos[0] - origin[0], pos[1] - origin[1]);
  position += " " + radio_compass(compass_direction(angle));
  return position;
}

function radio_trend(category, measured, target) {
  var CATEGORIES = {
    "altitude": ["descend to", "climb to",  "maintaining"],
    "speed":    ["set speed",  "set speed", "maintaining"]
  };
  if(measured > target) return CATEGORIES[category][0];
  if(measured < target) return CATEGORIES[category][1];
  return CATEGORIES[category][2];
}

var DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function compass_direction(angle) {
  angle /= Math.PI*2;
  angle = round(mod(angle, 1) * 8);
  if(angle == 8) return "NW";
  angle = DIRECTIONS[round(angle)];
  return angle;
}

// Return a random number within the given interval
// With one argument return a number between 0 and argument
// With no arguments return a number between 0 and 1
function random(low, high) {
  if (low == high) return low;
  if (low == null) return Math.random();
  if (high == null) return Math.random() * low;
  return (low + (Math.random() * (high - low)));
}

function to_canvas_pos(pos) {
  return [prop.canvas.size.width / 2 + prop.canvas.panX + km(pos[0]),
          prop.canvas.size.height / 2 + prop.canvas.panY - km(pos[1])];
}

// Compute a point of intersection of a ray with a rectangle.
// Args:
//   pos: array of 2 numbers, representing ray source.
//   dir: array of 2 numbers, representing ray direction.
//   rectPos: array of 2 numbers, representing rectangle corner position.
//   rectSize: array of 2 positive numbers, representing size of the rectangle.
//
// Returns:
// - undefined, if pos is outside of the rectangle.
// - undefined, in case of a numerical error.
// - array of 2 numbers on a rectangle boundary, in case of an intersection.
function positive_intersection_with_rect(pos, dir, rectPos, rectSize) {
  var left = rectPos[0];
  var right = rectPos[0] + rectSize[0];
  var top = rectPos[1];
  var bottom = rectPos[1] + rectSize[1];

  dir = normalize(dir);

  // Check if pos is outside of rectangle.
  if (clamp(left, pos[0], right) != pos[0] || clamp(top, pos[1], bottom) != pos[1]) {
    return undefined;
  }

  // Check intersection with top segment.
  if (dir[1] < 0) {
    var t = (top - pos[1]) / dir[1];
    var x = pos[0] + dir[0] * t;
    if (clamp(left, x, right) == x) {
      return [x, top];
    }
  }

  // Check intersection with bottom segment.
  if (dir[1] > 0) {
    var t = (bottom - pos[1]) / dir[1];
    var x = pos[0] + dir[0] * t;
    if (clamp(left, x, right) == x) {
      return [x, bottom];
    }
  }

  // Check intersection with left segment.
  if (dir[0] < 0) {
    var t = (left - pos[0]) / dir[0];
    var y = pos[1] + dir[1] * t;
    if (clamp(top, y, bottom) == y) {
      return [left, y];
    }
  }

  // Check intersection with right segment.
  if (dir[0] > 0) {
    var t = (right - pos[0]) / dir[0];
    var y = pos[1] + dir[1] * t;
    if (clamp(top, y, bottom) == y) {
      return [right, y];
    }
  }

  // Failed to compute intersection due to numerical precision.
  return undefined;
}
