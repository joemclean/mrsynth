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
        osc 2 -> osc 2 gain --'

The delay node is custom built. It uses a delay node in conjunction with gain nodes to create a feedback loop over the delay node. It's based heavily on the code available as part of this tutorial: http://www.html5rocks.com/en/tutorials/casestudies/jamwithchrome-audio/ I modified the code here to allow for dynamic changes in the delay values.


Second Section
---

The second section binds UI to synth parameters. It's mainly a straightforward implementation of jQuery onChange events and the default behavior of the knob plugin I used.

Third Section
---

This section defines keyboard behavior. More on that coming soon.


