
function speech_init() {
  prop.speech = {};
  prop.speech.synthesis = window.speechSynthesis;
  prop.speech.enabled = false;

  if('atc-speech-enabled' in prop.storage && prop.storage['atc-speech-enabled'] == 'true') {
    prop.speech.enabled = true;
    $(".speech-toggle").addClass("active");
  }
}

function speech_say(textToSay, lang, rate) {
  if(prop.speech.synthesis != null && prop.speech.enabled) {
    // Split numbers into individual digits e.g. Speedbird 666 -> Speedbird 6 6 6
    textToSay = textToSay.replace(/[0-9]/g, "$& ").replace(/\s0/g, " zero");
    var utt = new SpeechSynthesisUtterance(textToSay);
    utt.lang = lang || 'en-US';
    utt.rate = rate || 1;
    prop.speech.synthesis.speak(utt);
  }
}

function speech_toggle() {
  prop.speech.enabled = !prop.speech.enabled;

  if(prop.speech.enabled) {
    $(".speech-toggle").addClass("active");
  } else {
    $(".speech-toggle").removeClass("active");
    prop.speech.synthesis.cancel();
  }

  prop.storage['atc-speech-enabled'] = prop.speech.enabled;
}
