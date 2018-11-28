
scrollAnimate = function(y, duration, callback) {
	if (typeof duration == 'function') {
		callback = duration
		duration = undefined
	}
	duration = duration || 1000 // default: 1seg
	//
	var begin = document.body.scrollTop
	var end   = y
	var t     = 0 // to 1
	var int = setInterval(function() {
		t += 0.05
		var alpha = t*t
		document.body.scrollTop = begin + (end - begin) * alpha
		if (alpha >= 1) {
			clearInterval(int)
			if (callback)
				setTimeout(function() {
					callback()
				}, 10)
		}
	}, 16)
}