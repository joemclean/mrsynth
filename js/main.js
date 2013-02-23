
var C4 = 261.63,
		CS4 = 277.18,
		D4 = 293.66,
		DS4 = 311.13,
		E4 = 329.63,
		F4 = 349.23,
		FS4 = 369.99,
		G4 = 392.00,
		GS4 = 415.30,
		A4 = 440.00,
		AS4 = 466.16,
		B4 = 493.88,
		C5 = 523.25;

var context = new webkitAudioContext(),
	  oscillator = context.createOscillator();

oscillator.type = 0; // sine wave
oscillator.frequency.value = 220;
oscillator.start(0);
	
var updateFrequency = function(frequency){
	oscillator.frequency.value = frequency;
};
	
$(function() {
		
$('#start').click(function(){
	oscillator.connect(context.destination);
	$('#start').hide();
	$('#stop').show();
});
	
$('#stop').click(function(){
	oscillator.disconnect(context.destination);
	$('#start').show();
	$('#stop').hide();
});
	
	
$('#C4').click(function(){
	updateFrequency(C4);
});	
$('#CS4').click(function(){
	updateFrequency(CS4);
});
$('#D4').click(function(){
	updateFrequency(D4);
});
$('#DS4').click(function(){
	updateFrequency(DS4);
});
$('#E4').click(function(){
	updateFrequency(E4);
});
$('#F4').click(function(){
	updateFrequency(F4);
});
$('#FS4').click(function(){
	updateFrequency(FS4);
});	
$('#G4').click(function(){
	updateFrequency(G4);
});
$('#GS4').click(function(){
	updateFrequency(GS4);
});
$('#A4').click(function(){
	updateFrequency(A4);
});
$('#AS4').click(function(){
	updateFrequency(AS4);
});
$('#B4').click(function(){
	updateFrequency(B4);
});
$('#C5').click(function(){
	updateFrequency(C5);
});

$('.white_key').mousedown(function(){
	$(this).addClass("key_press");
});

$('.white_key').mouseup(function(){
	$(this).removeClass("key_press");
});

$('.white_key').mouseleave(function(){
	$(this).removeClass("key_press");
});
	
});