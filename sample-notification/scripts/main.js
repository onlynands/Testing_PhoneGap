document.addEventListener("deviceready", onDeviceReady, false);  
             
function id(element) {
	return document.getElementById(element);
}
             
function onDeviceReady() {
    navigator.splashscreen.hide();
	notificationApp = new notificationApp();
	notificationApp.run();
}

function notificationApp() {
}

notificationApp.prototype = {
	alertCount:0,
	run:function() {
		var that = this;
		id("alertButton").addEventListener("click", function() {
			that._showAlert.apply(that, arguments);
		});
		id("confirmButton").addEventListener("click", function() {
			that._showConfirm.apply(that, arguments);
		});
		id("beepButton").addEventListener("click", function() {
			that._playBeep.apply(that, arguments);
		});
		id("vibrateButton").addEventListener("click", function() {
			that._vibrate.apply(that, arguments);
		});
	},
    
	_showAlert:function () {
		var that = this;
		navigator.notification.alert('Alert #' + that.alertCount,
									 function() {
										 that._alertDismissed.apply(that, arguments);
									 },
									 'Count Alerts', 
									 'Done'     
		); 
	},
    
	_alertDismissed:function() {
		this.alertCount++;
	},
    
	_showConfirm:function() {
		var that = this;
		navigator.notification.confirm('Reset the alert count?', 
									   function() {
										   that._onConfirm.apply(that, arguments);
									   }, 
									   'Reset alert', 
                                       new Array("Reset","Cancel")
		);  
	},
    
	_onConfirm:function(button) {
		if (button === 1) {
			this.alertCount = 0;
		}
	},
    
	_playBeep:function() {
		// On the iPhone, this code will only have an effect if
		// you place a file named beep.wav in the root of the project.
		// The beep sound can be at most 30 seconds long.
		// The iPhone disregards the beep count, so will only beep once.
		// Android phones play the default Notification ringtone.
		navigator.notification.beep(2);  
	},
    
	_vibrate:function() {
		// Note that iPhone ignores the duration parameter and vibrates for
		// a pre-determined amount of time. Some iOS devices would only vibrate when volume is turned off
		navigator.notification.vibrate(3000);
	} 
}