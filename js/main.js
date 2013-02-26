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

var attackTime = 0.0;
var decayTime = 0.0;

$(document).disableSelection();

var context = new webkitAudioContext(),
	  oscillator = context.createOscillator(),
	  volumeNode = context.createGainNode(),
	  envelopeNode = context.createGainNode();

oscillator.type = 0; // sine wave
oscillator.frequency.value = 220;
oscillator.start(0);
volumeNode.gain.value = 0.75; //refactor to a variable so that dial can also preload value
envelopeNode.gain.value = 0.0;

oscillator.connect(envelopeNode);
envelopeNode.connect(volumeNode);
volumeNode.connect(context.destination);
	
var updateFrequency = function(frequency){
	oscillator.frequency.value = (frequency/2);
};

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

$(window).load(function() {
	
	$('#volume').knob({
		'change' : function(volume) {
			volumeNode.gain.value = (volume/100);
		}
	});
	
	$('#attack').knob({
		'change' : function(attack) {
			attackTime = ((attack)/20);
		}
	});
	
	$('#decay').knob({
		'change' : function(decay) {
			decayTime = ((decay)/20);
		}
	});

	var leftButtonDown = false;
	$(document).mousedown(function(){
		leftButtonDown = true;
	});
	
	$(document).mouseup(function(){
		leftButtonDown = false;
	});


	$('.key').mousedown(function(){
		$(this).addClass("key_press");
		var keyID = $(this).attr('id');
		updateFrequency(notes[keyID]);
		startAttack();
	});

	$('.key').mouseup(function(){
		$(this).removeClass("key_press");
		startDecay();
	});

	$('.key').mouseenter(function(){
		if (leftButtonDown === true) {
			$(this).addClass("key_press");
			var keyID = $(this).attr('id');
			updateFrequency(notes[keyID]);
			startAttack();
		};
	});

	$('.key').mouseleave(function(){
		$(this).removeClass("key_press");
		startDecay();
	});

});
