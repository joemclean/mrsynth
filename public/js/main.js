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
	C5:  523.25,
  CS5: 554.37,
  D5:  587.33,
  DS5: 622.25,
  E5:  659.25,
  F5:  698.46,
};

$(document).disableSelection();


// |--------------------|
// | Signal Chain Setup |
// |--------------------|


//custom node creation
var delayEffectNode = function(){
    //create the nodes we’ll use
    this.input = context.createGain();
    this.output = context.createGain();
    this.delay = context.createDelay();
    this.feedback = context.createGain();
    this.wetLevel = context.createGain();

    //set some default values
    this.delay.delayTime.value = 0.30;
    this.feedback.gain.value = 0.10;
    this.wetLevel.gain.value = 0.5;

    //set up the delay's internal routing
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

//initialize nodes
var context = new webkitAudioContext();
var oscillatorOneNode = context.createOscillator();
var oscillatorOneGainNode = context.createGain();
var oscillatorTwoNode = context.createOscillator();
var oscillatorTwoGainNode = context.createGain();
var filterNode = context.createBiquadFilter();
var lfoNode = context.createOscillator();
var lfoGainNode = context.createGain();
var envelopeNode = context.createGain();
var volumeNode = context.createGain();
var delayNode = new delayEffectNode();

//initialize values
oscillatorOneNode.type = "sawtooth"; // sawtooth wave
oscillatorTwoNode.type = "sine"; // sine wave
oscillatorOneGainNode.gain.value = 0.75;
oscillatorTwoGainNode.gain.value = 0.75;
lfoNode.type = "sine";
lfoNode.frequency.value = 1;
lfoNode.start;
lfoGainNode.gain.value = 1000;
filterNode.type = "lowpass"; //low pass
filterNode.frequency.value = 6666;
filterNode.Q.value = 10;
envelopeNode.gain.value = 0.0;
volumeNode.gain.value = 0.75;

//connect nodes
oscillatorOneNode.connect(oscillatorOneGainNode);
oscillatorOneGainNode.connect(filterNode);
oscillatorTwoNode.connect(oscillatorTwoGainNode);
oscillatorTwoGainNode.connect(filterNode);
filterNode.connect(envelopeNode);
envelopeNode.connect(delayNode.input);
delayNode.connect(volumeNode);
lfoNode.connect(lfoGainNode);
lfoGainNode.connect(filterNode.frequency);
volumeNode.connect(context.destination);

oscillatorOneNode.start(0);
oscillatorTwoNode.start(0);
lfoNode.start();
	
//keyboard interfacing
var updateFrequency = function(frequency){
	oscillatorOneNode.frequency.value = frequency;
	oscillatorTwoNode.frequency.value = frequency;
};

var attackTime= 0.001;
var decayTime= 0.001;

var startAttack = function(){
	var now = context.currentTime;
	envelopeNode.gain.setTargetAtTime(1.0, now, (attackTime + .001));
	console.log('start note');
};

var startDecay = function(){
	var now = context.currentTime;
	envelopeNode.gain.setTargetAtTime(0.0, now, (decayTime + .001));
	console.log('end note');
};

// |--------------------|
// |     UI Controls    |
// |--------------------|
  

$(window).load(function() {

  //oscillators

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

	$( "#oscillatorOneSelect" ).change(function () {
    console.log( 'Set oscillator one to '+ $( "#oscillatorOneSelect" ).val());
    oscillatorOneNode.type = $( "#oscillatorOneSelect" ).val();
    leftButtonDown = false;
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

  $( "#oscillatorTwoSelect" ).change(function () {
    console.log( 'Set oscillator two to '+ $( "#oscillatorTwoSelect" ).val());
    oscillatorTwoNode.type = $( "#oscillatorTwoSelect" ).val();
    leftButtonDown = false;
  });

  //filter

  $( "#filterSelect" ).change(function () {
    console.log( 'Set filter to '+ $( "#filterSelect" ).val());
    filterNode.type = $( "#filterSelect" ).val();
    leftButtonDown = false;
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

  //lfo

  $('#lfoFrequency').knob({
    'change' : function(frequency) {
      lfoNode.frequency.value = (frequency/10);
    }
  });

  $('#lfoDepth').knob({
    'change' : function(lfoDepth) {
      lfoGainNode.gain.value = (lfoDepth * 20);
    }
  });

  $( "#lfoSelect" ).change(function () {
    console.log( 'Set lfo to '+ $( "#lfoSelect" ).val());
    lfoNode.type = $( "#lfoSelect" ).val();
    leftButtonDown = false;
  });

  //envelope

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

  //delay

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

  //volume

	$('#volume').knob({
		'change' : function(volume) {
			volumeNode.gain.value = (volume/100);
		}
	});
 
// |--------------------|
// |  Keyboard Controls |
// |--------------------|
	
  var octaveMultiplier = 1;
  var hold = false; 
  var leftButtonDown = false;

  $( "#octaveControl" ).change(function () {
    console.log( 'Set lfo to '+ $( "#octaveControl" ).val());
    var octave = $( "#octaveControl" ).val()
    switch (octave) {
    case "-2":
      octaveMultiplier = 0.25;
      break;
    case "-1":
      octaveMultiplier = 0.5;
      break;
    case "+1":
      octaveMultiplier = 2;
      break;
    case "+2":
      octaveMultiplier = 4;
      break;
    default:
      octaveMultiplier = 1;
    }
    leftButtonDown = false;
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
		updateFrequency(notes[keyID]*octaveMultiplier);
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
			updateFrequency(notes[keyID]*octaveMultiplier);
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
