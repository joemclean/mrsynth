var hold = false;

var leftButtonDown = false;

var notes = {
	C3:  130.81,
	CS3: 138.59,
	D3:  146.83,
	DS3: 155.56,
	E3:  164.81,
	F3:  174.61,
	FS3: 185.00,
	G3:  196.00,
	GS3: 207.65,
	A3:  220.00,
	AS3: 233.08,
	B3:  246.94,
	C4:  261.63,
	CS4: 277.18,
	D4:  293.66,
	DS4: 311.13,
	E4:  329.63,
	F4:  349.23,
	FS4: 369.99,
	G4:  392.00,
	GS4: 415.30,
	A4:  440.00,
	AS4: 466.16,
	B4:  493.88,
	C5:  523.25
};

$(document).disableSelection();

//custom node creation
var delayEffectNode = function(){
    //create the nodes we’ll use
    this.input = context.createGainNode();
    this.output = context.createGainNode();
    this.delay = context.createDelayNode();
    this.feedback = context.createGainNode();
    this.wetLevel = context.createGainNode();

    //set some decent values
    this.delay.delayTime.value = 0.30; //100 ms delay
    this.feedback.gain.value = 0.10;
    this.wetLevel.gain.value = 0.5;

    //set up the routing
    this.input.connect(this.delay);
    this.input.connect(this.output);
    this.delay.connect(this.feedback);
    this.delay.connect(this.wetLevel);
    this.feedback.connect(this.delay);
    this.wetLevel.connect(this.output);

    this.connect = function(target){
       this.output.connect(target);
    };
};

//initialize basic nodes
var context = new webkitAudioContext();
var oscillatorOneNode = context.createOscillator();
var oscillatorOneGainNode = context.createGainNode();
var oscillatorTwoNode = context.createOscillator();
var oscillatorTwoGainNode = context.createGainNode();
var filterNode = context.createBiquadFilter();
var envelopeNode = context.createGainNode();
var volumeNode = context.createGainNode();

//initialize custom no
var delayNode = new delayEffectNode();

//initialize values
oscillatorOneNode.type = 1; // sawtooth wave
oscillatorOneNode.start(0);

oscillatorTwoNode.type = 0; // sine wave
oscillatorTwoNode.start(0);

filterNode.type = 0; //low pass
filterNode.frequency.value = 20000;

volumeNode.gain.value = 0.75;
envelopeNode.gain.value = 0.0;
oscillatorOneGainNode.gain.value = 0.75;
oscillatorTwoGainNode.gain.value = 0.75;

oscillatorOneNode.connect(oscillatorOneGainNode);
oscillatorOneGainNode.connect(filterNode);
oscillatorTwoNode.connect(oscillatorTwoGainNode);
oscillatorTwoGainNode.connect(filterNode);
filterNode.connect(envelopeNode);
envelopeNode.connect(delayNode.input);
delayNode.connect(volumeNode);
volumeNode.connect(context.destination);
	
var updateFrequency = function(frequency){
	oscillatorOneNode.frequency.value = frequency;
	oscillatorTwoNode.frequency.value = frequency;
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

  $( "#filterSelect" ).change(function () {
    console.log( 'Set filter to '+ $( "#filterSelect" ).val());
    filterNode.type = parseInt($( "#filterSelect" ).val());
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

  $('#oscillatorTwoVolume').knob({
		'change' : function(volume) {
			oscillatorTwoGainNode.gain.value = (volume/100);
		}
	});

	$('#oscillatorTwoDetune').knob({
		'change' : function(detune) {
			oscillatorTwoNode.detune.value = detune;
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

	$('#delay_time').knob({
		'change' : function(time) {
			delayNode.delay.delayTime.value = (time/100);
		}
	});

	$('#delay_feedback').knob({
		'change' : function(feedback) {
			delayNode.feedback.gain.value = (feedback/100);
		}
	});

	$('#delay_level').knob({
		'change' : function(level) {
			delayNode.wetLevel.gain.value = (level/100);
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
      startDecay();
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
