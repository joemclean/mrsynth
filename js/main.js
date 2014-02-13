var hold = false;

var leftButtonDown = false;

var notes = {
	C4: 261.63,
	CS4: 277.18,
	D4: 293.66,
	DS4: 311.13,
	E4: 329.63,
	F4: 349.23,
	FS4: 369.99,
	G4: 392.00,
	GS4: 415.30,
	A4: 440.00,
	AS4: 466.16,
	B4: 493.88,
	C5: 523.25
};

$(document).disableSelection();

//initialize nodes
var context = new webkitAudioContext();
var oscillatorOneNode = context.createOscillator();
var oscillatorOneGainNode = context.createGainNode();
var oscillatorTwoNode = context.createOscillator();
var oscillatorTwoGainNode = context.createGainNode();
var filterNode = context.createBiquadFilter();
var envelopeNode = context.createGainNode();
var volumeNode = context.createGainNode();



//initialize values
oscillatorOneNode.type = 0; // sine wave
oscillatorOneNode.start(0);

oscillatorTwoNode.type = 0; // sine wave
oscillatorTwoNode.start(0);

volumeNode.gain.value = 0.75;
envelopeNode.gain.value = 0.0;
oscillatorOneGainNode.gain.value = 0.75;
oscillatorTwoGainNode.gain.value = 0.75;

oscillatorOneNode.connect(oscillatorOneGainNode);
oscillatorOneGainNode.connect(filterNode);
oscillatorTwoNode.connect(oscillatorTwoGainNode);
oscillatorTwoGainNode.connect(filterNode);
filterNode.connect(envelopeNode);
envelopeNode.connect(volumeNode);
volumeNode.connect(context.destination);
	
var updateFrequency = function(frequency){
	oscillatorOneNode.frequency.value = (frequency/2);
	oscillatorTwoNode.frequency.value = (frequency/2);
};

var attackTime= 0.001;
var decayTime= 0.001;

var startAttack = function(){
	var now = context.currentTime;
	envelopeNode.gain.setTargetValueAtTime(1.0, now, (attackTime + .001));
	console.log('start note');
};

var startDecay = function(){
	var now = context.currentTime;
	envelopeNode.gain.setTargetValueAtTime(0.0, now, (decayTime + .001));
	console.log('end note');
};

//UI control

$(window).load(function() {

	$( "#oscillatorOneSelect" ).change(function () {
    console.log( 'Set oscillator one to '+ $( "#oscillatorOneSelect" ).val());
    oscillatorOneNode.type = parseInt($( "#oscillatorOneSelect" ).val());
    leftButtonDown = false;
  });

  $( "#oscillatorTwoSelect" ).change(function () {
    console.log( 'Set oscillator two to '+ $( "#oscillatorTwoSelect" ).val());
    oscillatorTwoNode.type = parseInt($( "#oscillatorTwoSelect" ).val());
    leftButtonDown = false;
  });

  $('#oscillatorOneVolume').knob({
		'change' : function(volume) {
			oscillatorOneGainNode.gain.value = (volume/100);
		}
	});

	$('#oscillatorOneDetune').knob({
		'change' : function(detune) {
			oscillatorOneNode.detune.value = detune;
		}
	});

	$('#oscillatorTwoDetune').knob({
		'change' : function(detune) {
			oscillatorTwoNode.detune.value = detune;
		}
	});


  $('#oscillatorTwoVolume').knob({
		'change' : function(volume) {
			oscillatorTwoGainNode.gain.value = (volume/100);
		}
	});

	$('#attack').knob({
		'change' : function(attack) {
			attackTime = ((attack)/60);
		}
	});
	
	$('#decay').knob({
		'change' : function(decay) {
			decayTime = ((decay)/60);
		}
	});

	$('#cutoff').knob({
		'change' : function(cutoff) {
			filterNode.frequency.value = (cutoff * 200);
		}
	});

	$('#resonance').knob({
		'change' : function(resonance) {
			filterNode.Q.value = (resonance/5);
		}
	});

	$('#volume').knob({
		'change' : function(volume) {
			volumeNode.gain.value = (volume/100);
		}
	});
	

	$('#hold').change(function() {
    if($(this).is(":checked")) {
      hold = true;
    } else {
      hold = false;
    }
  });

	$(document).mousedown(function(){
		leftButtonDown = true;
		console.log("Mouse down.")
	});
	
	$(document).mouseup(function(){
		leftButtonDown = false;
		console.log("Mouse up.")
	});


	$('.key').mousedown(function(){
		$(this).addClass("key_press");
		var keyID = $(this).attr('id');
		updateFrequency(notes[keyID]);
		startAttack();
	});

	$('.key').mouseup(function(){
		$(this).removeClass("key_press");
		if (hold == true) {
			// maintain note
		} else {
		  startDecay();
		}
	});

	$('.key').mouseenter(function(){
		if (leftButtonDown == true) {
			$(this).addClass("key_press");
			var keyID = $(this).attr('id');
			updateFrequency(notes[keyID]);
			startAttack();
		};
	});

	$('.key').mouseleave(function(){
		$(this).removeClass("key_press");
		if (hold == true) {
			// maintain note
		} else {
		  startDecay();
		}
	});

});
