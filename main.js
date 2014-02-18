
var main = {
	init: function () {
		console.log ('main.js initialized');
	},

	resize: function (e) {

	},

	update: function (e) {

	},

	render: function (e) {
		bits.graphics.clear ();

		bits.graphics.setTextAlign ('left');
		bits.graphics.setColour ('#f00');
		bits.graphics.circle ('fill', 128, 128, 64);
		bits.graphics.setColour ('#fff');
		bits.graphics.circle ('line', 200, 128, 64);
		bits.graphics.setColour ('#f0f');
		bits.graphics.rect ('fill', 300, 128, 64, 64);
		bits.graphics.setColour ('#f00');
		bits.graphics.rect ('line', 300, 200, 128, 64);
		bits.graphics.setColourRGB (0, 255, 255);
		bits.graphics.line (30, 64, 600, 300);

		// Some debug info
		bits.graphics.setColour ('#0f0');
		bits.graphics.setFont ('30px Calibri');
		bits.graphics.print ('Hello World', 20, 30);
		bits.graphics.setFont ("12px Calibri");
		bits.graphics.print ('Screen: ' + bits.screenWidth + ', ' + bits.screenHeight, 20, 48);
		bits.graphics.print ('Mouse: ' + bits.mouse.x + ', ' + bits.mouse.y, 20, 64);

		// Drawing the mouse event
		if (bits.mouse.isDown ('l') == true)
		{
			bits.graphics.setColour ('#FFF');
			bits.graphics.circle ('fill', bits.mouse.x, bits.mouse.y, 32);
		}

		// Drawing the touch events
		for (var i = 0; i < bits.touch.list.length; i++)
		{
			bits.graphics.setColour ('#FFF');
			bits.graphics.circle ('fill', bits.touch.list [i].pageX, bits.touch.list [i].pageY, 32);
			for (var j = i; j < bits.touch.list.length; j++)
			{
				bits.graphics.line (bits.touch.list [i].pageX, bits.touch.list [i].pageY, bits.touch.list [j].pageX, bits.touch.list [j].pageY);
			}
		}

		// Drawing the advance timer
		bits.timer.advanceCounter (bits.screenWidth - 160, bits.screenHeight - 74, 150, 64);
	},

	mouseMove: function (e) {

	},

	mouseDown: function (e) {

	},

	mouseUp: function (e) {

	},

	keyUp: function (e) {

	},

	keyDown: function (e) {

	},

	click: function (e) {

	},

	touchStart: function (e) {

	},

	touchMove: function (e) {

	},

	touchEnd: function (e) {

	}
};

bits.stateManager.addState ('main', main);
bits.stateManager.setState ('main');