mr. synth
=======

A little synthesizer built with the WebAudio API.

See the live demo here: http://mr-synth.herokuapp.com/

This is intended as an accessible and extensible demo of some of the things possible with the WebAudio API. Implementation has been kept as straightforward as possible for the functionality offered.

There are three main sections to the javascript code. The first section sets up the signal chain and sets default values for all the nodes. The second binds the knobs and UI controls to the module parameters. The final section handles keyboard interaction.

First Section
---

The first section establishes the nodes and their connections. The setup is as follows:

        osc 1 -> osc 1 gain --,
                              )--> filter -> envelope -> delay -> master vol -> speakers
        osc 2 -> osc 2 gain --'      ^
                                     |
                                    LFO


**Oscillators**
Oscillators generate the raw sound of the synth. These oscillators are basic, with simple waveform selection and detune control. Sine and triangle waves are smoother and mellower. Square and saw waves are harsher and more metallic. The volume of each oscillator can be controlled independently, via the oscillator gain nodes. The combined volume of the two oscillators is sent to the filter.

**Filter + LFO**
Filters modify the sound by removing or accentuating different frequencies. The filter can be switched between low-pass (remove higher frequencies) and high-pass (remove lower frequencies) mode. The frequency knob changes the frequency where the effect kicks in. The resonance accentuates the frequencies right at the cutoff frequency, creating interesting metallic sounds.

On this synth, the LFO is set to automatically modify the cutoff of the filter. It's as if someone is repeatedly turning the frequency knob on the filter back and forth. Changing the frequency of the lfo will change how quickly this happens, and depth changes the intensity of the change.

**Envelope**
Envelope controls how long the sound takes to get from 0 to max volume after a key is pressed. It's hard to explain but easy to hear.
Whenever a start attack event is fired, the envelope gain node gets gradually turned from 0 to full at the speed determined by the attack dial. It will stay at full until a start decay event is recieved, at which point the volume returns to zero at the speed set by the decay knob. 

Changing from one pitch to another while pressing down does not affect the attack/decay cycle, allowing you to sweep over the keyboard and do slides.

**Delay**
The delay node is a custom built node. It uses the Webaudio stock delay node in conjunction with gain nodes to create a feedback loop, for a more complicated delay. It's based heavily on the code available as part of this tutorial: http://www.html5rocks.com/en/tutorials/casestudies/jamwithchrome-audio/ I modified the code here to allow for dynamic changes in the delay values.

Time controls the gap between the original sound and the echo. Feedback controls how much of the echo goes back into the delay to echo again. Volume controls the overall volume of the 'wet' signal.

**Master Volume**
The combined output of the whole chain is sent to the master volume so that you don't blow your ears out :)

Second Section
---

The second section binds UI to synth parameters. It's mainly a straightforward implementation of jQuery onChange events and the default behavior of the knob plugin I used.

Third Section
---

This section defines keyboard behavior. When you click a key, it fires a 'startAttack' event to gradually ramp up the gain of the envelope node. When you release, it triggers a startDecay event to return to zero.

The keyboard is always keeping track of the status of your mouse with the var leftButtonDown variable. If you switch to another note while still holding down the mouse button, it will update the frequency of the sound but NOT fire a startDecay event. The note will continue to sound until you release the note or your mouse leaves the keyboard completely.

The HOLD control essentially prevents the startDecay event from being triggered, meaning that the last note you played will continue indefinitely until you turn off hold. This is really handy for experimenting. You can tweak parameters while a note is playing to hear the changes in real time.


That should cover it! Please fork and experiment! Any feedback is welcome.
