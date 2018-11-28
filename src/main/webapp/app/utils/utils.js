
HTMLElement.prototype.findAll = function(query) {
	return this.querySelectorAll(query)
}

HTMLElement.prototype.find = function(query) {
	var that = this
	while (true) {
		var e = that.querySelector(query)
		if (e)
			return e
		that = that.parentNode
		if (that.nodeName == 'BODY')
			return
	}
}
