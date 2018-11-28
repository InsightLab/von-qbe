
/**
 * onde tudo se inicia...
 */
$(function() {
	
	loadPage(spaHierarquia, function() {
		spaControles();
	});	
})

function loadPage(func, param1, param2) { // ... paramN
	var $body = $('body')

	//
	if ($('#layout').length == 0)
		spaLayout()
	$('#page').html('')
	//
	setTimeout(function() {
		$body.addClass('page-loading')
		func(param1, param2)
		//
		$('html,body').scrollTop(0)
		setTimeout(function() {
			$body.removeClass('page-loading')
		}, 10)
	}, 10)
}



