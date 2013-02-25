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

var context = new webkitAudioContext(),
	  oscillator = context.createOscillator();
	  gainNode = context.createGainNode();

oscillator.type = 0; // sine wave
oscillator.frequency.value = 220;
oscillator.start(0);
gainNode.gain.value = 0.0;

oscillator.connect(gainNode);
gainNode.connect(context.destination);
	
var updateFrequency = function(frequency){
	oscillator.frequency.value = frequency;
};
	
$(function() {
	
$('#volume').knob({
	'change' : function(volume) {
		console.log(volume);
		gainNode.gain.value = (volume/100);
	}
});
 

$("#slider").simpleSlider();

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
});

$('.key').mouseup(function(){
	$(this).removeClass("key_press");
});

$('.key').mouseenter(function(){
	if (leftButtonDown === true) {
		$(this).addClass("key_press");
		var keyID = $(this).attr('id');
		updateFrequency(notes[keyID]);
	};
});

$('.key').mouseleave(function(){
	$(this).removeClass("key_press");
});
	
});