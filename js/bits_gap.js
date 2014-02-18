
// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame    || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();


// Namespace our game
var bits = {
	backgroundColour: '#036',
	screenWidth: 1280,
	screenHeight: 720,

	canvas: null,
	ctx:  null,
	ua:  null,
	android: null,
	ios:  null,

	init: function() {
		// These will change when the screen is resize this is our canvas element
		bits.canvas = document.getElementsByTagName('canvas')[0];
		// The canvas context allows us to  interact with the canvas api
		bits.ctx = bits.canvas.getContext('2d');
		// We need to sniff out android & ios so we can hide the address bar in our resize function
		bits.ua = navigator.userAgent.toLowerCase();
		bits.android = bits.ua.indexOf('android') > -1 ? true : false;
		bits.ios = ( bits.ua.indexOf('iphone') > -1 || bits.ua.indexOf('ipad') > -1  ) ? true : false;

		window.addEventListener ('resize', bits.resize, false); //resizing the window
		window.addEventListener('mousemove', 	function (e) { e.preventDefault (); bits.mouse.getPos (e); bits.stateManager.mouseMove (e); }, false); // Mouse location
		window.addEventListener('mousedown', 	function (e) { e.preventDefault (); bits.mouse.pressed (e); bits.stateManager.mouseDown (e); }, false); // Mouse pressed
		window.addEventListener('mouseup', 		function (e) { e.preventDefault (); bits.mouse.released (e); bits.stateManager.mouseUp (e); }, false); // Mouse pressed
		window.addEventListener ('keyup', 		function (e) { e.preventDefault (); bits.key.released (e); bits.stateManager.keyUp (e); }, false); // Key released
		window.addEventListener ('keydown', 	function (e) { e.preventDefault (); bits.key.pressed (e); bits.stateManager.keyDown (e); }, false); // Key pressed
		window.addEventListener('click', 		function (e) { e.preventDefault (); bits.stateManager.click (e); }, false); // Clicked
		window.addEventListener('touchstart', 	function (e) { e.preventDefault (); bits.touch.touchStart (e); bits.stateManager.touchStart (e); }, false); // Touch Start
		window.addEventListener('touchmove', 	function (e) { e.preventDefault (); bits.touch.touchMove (e); bits.stateManager.touchMove (e); }, false); // Touch Move
		window.addEventListener('touchend', 	function (e) { e.preventDefault (); bits.touch.touchEnd (e); bits.stateManager.touchEnd (e); }, false); // Touch End

		console.log ('Game Bits Initialized');

		bits.resize();
		bits.loop();
	},


	resize: function() {
		// This will create some extra space on the page, allowing us to scroll pass the address bar, and thus hide it.
		if (bits.android || bits.ios) {
			document.body.style.height = (window.innerHeight + 50) + 'px';
		}

		bits.screenWidth = window.innerWidth;
		bits.screenHeight = window.innerHeight;

		bits.canvas.width = bits.screenWidth;
		bits.canvas.height = bits.screenHeight;

		// We use a timeout here as some mobile browsers won't scroll if there is not a small delay
		window.setTimeout(function() {
				window.scrollTo(0,1);
			}, 1);
	},

	update: function() {
		bits.stateManager.update ();
	},

	render: function() {
		bits.stateManager.render ();
	},

	loop: function() {
		requestAnimFrame (bits.loop);

		bits.timer.calcTicks ();

		bits.update();
		bits.render();
	},

	graphics: {
		clear: function () {
			bits.ctx.fillStyle = bits.backgroundColour;
			bits.ctx.fillRect (0, 0, bits.screenWidth, bits.screenHeight);
		},

		setFont: function (desiredFont) {
			bits.ctx.font = desiredFont;
		},

		setTextAlign: function (align) {
			bits.ctx.textAlign = align;
		},

		print: function (text, x, y) {
			bits.ctx.fillText (text, x, y);
		},

		setColour: function (desiredColour) {
			bits.ctx.fillStyle = desiredColour; //'rgb(0, 255, 0)'
			bits.ctx.strokeStyle = desiredColour;
		},

		setColourRGB: function (r, g, b) {
			bits.ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
			bits.ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
		},

		setColourRGBA: function (r, g, b, a) {
			bits.ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
			bits.ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
			bits.ctx.globalAlpha = a;
		},

		setAlpha: function (a) {
			bits.ctx.globalAlpha = a;
		},

		line : function (x1, y1, x2, y2) {
			bits.ctx.beginPath ();
			bits.ctx.moveTo (x1, y1);
			bits.ctx.lineTo (x2, y2);
			bits.ctx.stroke ();
		},

		rect: function(type, x, y, width, height) {
			if (type == 'fill') {
				bits.ctx.fillRect(x, y, width, height);
			} else if (type == 'line') {
				bits.ctx.strokeRect(x, y, width, height);
			}
		},

		circle: function(type, x, y, rad) {
			bits.ctx.beginPath();
			bits.ctx.arc(x + 5, y + 5, rad, 0,  Math.PI * 2, true);
			bits.ctx.closePath();
			if (type == 'fill') {
				bits.ctx.fill();
			} else if (type == 'line') {
				bits.ctx.stroke();
			}
		}
	},

	mouse: {
		btnMap: {
			1: 'l', 2: 'm', 3: 'r'
		},

		_pressed: {},
		x: null,
		y: null,

		getPos: function (e) {
			bits.mouse.x = e.x;
			bits.mouse.y = e.y;
		},

		byNumber: function (btnCode) {
			return bits.mouse.btnMap [btnCode];
		},

		isDown: function (btnCode) {
			return (bits.mouse._pressed [btnCode] ? true : false);
		},

		pressed: function (e) {
			bits.mouse._pressed [bits.mouse.byNumber (e.which)] = true;

			if (typeof mousePressed == 'function')
			{ mousePressed (bits.mouse.byNumber (e.which)) }
		},

		released: function (e) {
			delete bits.mouse._pressed [bits.mouse.byNumber (e.which)];

			if (typeof mouseReleased == 'function')
			{ mouseReleased (bits.mouse.byNumber (e.which)) }
		}
	},

	key: {
		codeMap: {
			8:'backspace', 9:'tab', 13:'return', 16:'shift', 17:'ctrl', 18:'alt', 19:'pausebreak', 20:'capslock', 27:'escape', 32:' ', 33:'pageup',
			34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down', 43:'+', 44:'printscreen', 45:'insert', 46:'delete',
			48:'0', 49:'1', 50:'2', 51:'3', 52:'4', 53:'5', 54:'6', 55:'7', 56:'8', 57:'9', 59:';',
			61:'=', 65:'a', 66:'b', 67:'c', 68:'d', 69:'e', 70:'f', 71:'g', 72:'h', 73:'i', 74:'j', 75:'k', 76:'l',
			77:'m', 78:'n', 79:'o', 80:'p', 81:'q', 82:'r', 83:'s', 84:'t', 85:'u', 86:'v', 87:'w', 88:'x', 89:'y', 90:'z',
			96:'0', 97:'1', 98:'2', 99:'3', 100:'4', 101:'5', 102:'6', 103:'7', 104:'8', 105:'9',
			106: '*', 107:'+', 109:'-', 110:'.', 111: '/',
			112:'f1', 113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 120:'f9', 121:'f10', 122:'f11', 123:'f12',
			144:'numlock', 145:'scrolllock', 186:';', 187:'=', 188:',', 189:'-', 190:'.', 191:'/', 192:'`', 219:'[', 220:'\\', 221:']', 222:"'"
		},

		_pressed: {},

		byNumber: function (keyCode) {
			return bits.key.codeMap [keyCode];
		},

		isDown: function (keyCode) {
			return bits.key._pressed [keyCode];
		},

		pressed: function (e) {
			bits.key._pressed [bits.key.byNumber (e.keyCode)] = true;

			if (typeof keyPressed == 'function')
			{ keyPressed (bits.key.byNumber (e.keyCode)) }
		},

		released: function (e) {
			delete bits.key._pressed [bits.key.byNumber (e.keyCode)];

			if (typeof keyReleased == 'function')
			{ keyReleased (bits.key.byNumber (e.keyCode)) }
		}
	},

	touch: {
		list: [],

		touchStart: function (e) {
			bits.touch.list = e.touches;
		},

		touchMove: function (e) {
			bits.touch.list = e.touches;
		},

		touchEnd: function (e) {
			bits.touch.list = e.touches;
		}
	},

	timer: {
		start: Date.now(),
		tempTime: Date.now(),
		ticks: 0,
		maxFPS: 0,
		minFPS: 999,
		fpsList: [],

		calcTicks: function () {
			bits.timer.ticks = (Date.now() - bits.timer.tempTime);
			bits.timer.tempTime = Date.now();
		},

		getFPS: function () {
			var fps = (1000 / bits.timer.ticks);
			if (fps > bits.timer.maxFPS)
			{
				bits.timer.maxFPS = Math.round (fps);
			}
			if (fps < bits.timer.minFPS)
			{
				bits.timer.minFPS = Math.round (fps);
			}
			return fps;
		},

		advanceCounter: function (x, y, width, height) {
			if (bits.timer.fpsList.length >= 100)
			{
				bits.timer.fpsList.shift ();
			}
			bits.timer.fpsList.push (bits.timer.getFPS ());

			bits.graphics.setColour ("#111");
			bits.graphics.setAlpha (0.75);
			bits.graphics.rect ("fill", x, y, width, height);
			bits.graphics.setAlpha (1.0);
			bits.graphics.setColour ("#0F0");
			var xScale = width / 100;
			var yScale = height / 70;

			for (var i = 0; i <= 70; i += 10)
			{
				bits.graphics.line (x, y + height - (i * yScale), x + 5, y + height - (i * yScale));
			}
			for (var i = 0; i < (bits.timer.fpsList.length - 1); i++)
			{
				bits.graphics.line (x + width - (bits.timer.fpsList.length * xScale) + (i * xScale),
				                    (bits.timer.fpsList [i] <= 70) ? y + height - (bits.timer.fpsList [i] * yScale) : y + height - (70 * yScale),
				                    x + width - (bits.timer.fpsList.length * xScale) + ((i + 1) * xScale),
				                    (bits.timer.fpsList [i + 1] <= 70) ? y + height - (bits.timer.fpsList [i + 1] * yScale) : y + height - (70 * yScale));
			}

			bits.graphics.setTextAlign ('right');
			bits.graphics.setFont ('24px Calibri');
			bits.graphics.print ("FPS: " + Math.round (bits.timer.getFPS()), x + width - 5, y + height - 5);

			bits.graphics.setTextAlign ('left');
			bits.graphics.setFont ('10px Calibri');
			bits.graphics.print ("Max: " + bits.timer.maxFPS, x + 5, y + height - 15);
			bits.graphics.print ("Min: " + bits.timer.minFPS, x + 5, y + height - 5);

			// border
			bits.graphics.setColour ("#000");
			bits.graphics.rect ("line", x, y, width, height);
		}
	},

	stateManager: {
		statesList: {},
		currentState: null,

		addState: function (id, stateObject) {
			bits.stateManager.statesList [id] = stateObject;
		},

		deleteState: function (id) {
			bits.stateManager.stateList.splice (id, 1);
		},

		setState: function (id) {
			bits.stateManager.currentState = id;
			bits.stateManager.init ()
		},

		init: function () {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].init == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].init ();
			}
		},

		resize: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].resize == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].resize (e);
			}
		},

		update: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].update == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].update (e);
			}
		},

		render: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].render == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].render (e);
			}
		},

		mouseMove: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].mouseMove == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].mouseMove (e);
			}
		},

		mouseDown: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].mouseDown == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].mouseDown (e);
			}
		},

		mouseUp: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].mouseUp == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].mouseUp (e);
			}
		},

		keyUp: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].keyUp == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].keyUp (e);
			}
		},

		keyDown: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].keyDown == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].keyDown (e);
			}
		},

		click: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].click == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].click (e);
			}
		},

		touchStart: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].touchStart == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].touchStart (e);
			}
		},

		touchMove: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].touchMove == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].touchMove (e);
			}
		},

		touchEnd: function (e) {
			if (typeof bits.stateManager.statesList [bits.stateManager.currentState].touchEnd == 'function') {
				bits.stateManager.statesList [bits.stateManager.currentState].touchEnd (e);
			}
		}
	}
};

window.addEventListener('load', bits.init, false);
