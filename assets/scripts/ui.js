
function ui_init_pre() {
  prop.ui = {};
  prop.ui.scale_default = 8; // pixels per km
  prop.ui.scale_max = 80; // max scale
  prop.ui.scale_min = 1; // min scale
  prop.ui.scale         = prop.ui.scale_default;

  if('atc-scale' in localStorage) prop.ui.scale = localStorage['atc-scale'];
}

function ui_zoom_out() {
  var lastpos = [round(pixels_to_km(prop.canvas.panX)), round(pixels_to_km(prop.canvas.panY))];
  prop.ui.scale *= 0.9;
  if(prop.ui.scale < prop.ui.scale_min) prop.ui.scale = prop.ui.scale_min;
  ui_after_zoom();
  prop.canvas.panX = round(km(lastpos[0]));
  prop.canvas.panY = round(km(lastpos[1]));
}

function ui_zoom_in() {
  var lastpos = [round(pixels_to_km(prop.canvas.panX)), round(pixels_to_km(prop.canvas.panY))];
  prop.ui.scale /= 0.9;
  if(prop.ui.scale > prop.ui.scale_max) prop.ui.scale = prop.ui.scale_max;
  ui_after_zoom();
  prop.canvas.panX = round(km(lastpos[0]));
  prop.canvas.panY = round(km(lastpos[1]));
}

function ui_zoom_reset() {
  prop.ui.scale = prop.ui.scale_default;
  ui_after_zoom();
}

function ui_after_zoom() {
  localStorage['atc-scale'] = prop.ui.scale;
  prop.canvas.dirty = true;
}

function ui_init() {

  $(".fast-forwards").prop("title", "Set time warp to 2");

  $(".fast-forwards").click(function() {
    game_timewarp_toggle();
  });

  $(".speech-toggle").click(function() {
    speech_toggle();
  });

  $(".switch-airport").click(function() {
    ui_airport_toggle();
  });

  $(".toggle-tutorial").click(function() {
    tutorial_toggle();
  });

  $(".pause-toggle").click(function() {
    game_pause_toggle();
  });

  $("#paused img").click(function() {
    game_unpause();
  });
}

function ui_complete() {
  var airports = []

  for(var i in prop.airport.airports) airports.push(i);

  airports.sort();

  for(var i=0;i<airports.length;i++) {
    var airport = prop.airport.airports[airports[i]];

    var html = $("<li class='airport icao-"+airport.icao.toLowerCase()+"'><span class='icao'>" + airport.icao + "</span><span class='name'>" + airport.name + "</span></li>");

    html.click(airport.icao.toLowerCase(), function(e) {
      if(e.data != airport_get().icao) {
        airport_set(e.data);
        ui_airport_close();
      }
    });

    $("#airport-switch .list").append(html);

  }
}

function pixels_to_km(pixels) {
  return pixels / prop.ui.scale;
}

function km(kilometers) {
  return kilometers * prop.ui.scale;
}

function comm_announce(warn, message) {
  ui_log(warn, message);
  speech_say(message, 'en-US', 1.2);
}

function comm_tower(warn, aircraft, message) {
  message = aircraft.getRadioCallsign() + ", " + message;
  ui_log(warn, message);
  speech_say(message, 'en-GB', random(1, 1.2));
}

function comm_aircraft(warn, aircraft, message) {
  message = airport_get().radio + " tower, " + aircraft.getRadioCallsign() + " " + message;
  ui_log(warn, message);
  speech_say(message, 'en-IN', random(1, 1.2));
}

function ui_log(warn, message) {
  var html = $("<span class='item'><span class='message'>"+message+"</span></span>");
  if (warn) html.addClass("warn");
  $("#log").append(html);
  $("#log").scrollTop($("#log").get(0).scrollHeight);
  game_timeout(function(html) {
    html.addClass("hidden");
    setTimeout(function() {
      html.remove();
    }, 10000);
  }, 3, window, html);
}

function ui_airport_open() {
  $(".airport").removeClass("active");
  $(".airport.icao-"+airport_get().icao.toLowerCase()).addClass("active");

  $("#airport-switch").addClass("open");
  $(".switch-airport").addClass("active");
}

function ui_airport_close() {
  $("#airport-switch").removeClass("open");
  $(".switch-airport").removeClass("active");
}

function ui_airport_toggle() {
  if($("#airport-switch").hasClass("open")) ui_airport_close();
  else                                      ui_airport_open();
}
