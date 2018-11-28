
/**
 * cria o layout principal - com header (verde e amarela), titulo, usuario logado, .. e #page
 * #page contém a pagina atual - tela de login, ou listagem de gestores, ou gestor, etc
 */
function spaLayout() {
	var html = ''
		+ '<div id="header">'
		+     '<div class="width">'
		+         '<div class="title">Virtual Ontology Query-by-Example <span>Von-QBE</span></div>'
		+			'<div id="logo"><img src="img/logo-insight.png"/></div>'
		+     '</div>'
		+ '</div>'
		+ ''
		+ ''
		+ '<div id="status-bar">'
		+     '<div class="width">'
		+         ''
		+         '<div class="path" id="links">'
		+              '<button></button>'
		//+              '<button onclick="spaLayoutOnClickGestores()">Gestores</button>'
		//+              '' // outros botoes.. podendo ser gerados dinamicamente... nao implementado
		+         '</div>'
		+     '</div>'
		+ '</div>'
		+ ''
		+ '<div id="page"></div>'		
	//
	$('body').html('<div id="layout">' + html + '</div>')
};

$(window).scroll(function() {
	var y = $(window).scrollTop()
	if (y < 50)
		$('body').removeClass('scrolling')
	else
		$('body').addClass('scrolling')
});