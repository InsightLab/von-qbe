
function spaGestores() {	
	$('#layout').css('min-height', '130vh');
	var html = ''
		+ spaPageTitle('Carregando a distribuição por participação dos', 'Gestores de dados')
		+ spaGestoresCreateHtmlResumo()
		
	$('#page').html('<div id="page-gestores">' + html + '</div>')
	
	initGestores();	
};

function initGestores() {	
	scrollAnimate(0);
	var container = $("#page-gestores");
	container.append(addAjaxFeedback());
	
	//Dispara requisição
	$.get('./gestores/resumo', function(data) {		
		// Remove o ajax load feedback
		container.empty();
		
		var html = ''
			+ spaPageTitle('Distribuição por participação dos', 'Gestores de dados')
			+ spaGestoresCreateHtmlResumo(data.totais)
			+ spaGestoresCreateHtmlTable(data.gestores)
			
		container.html(html);
	});	
};

function spaGestoresCreateHtmlResumo(totais) {
	$('#layout').css('min-height', '130vh');
	var html = ''
		+ '<div class="tarja">'
		+     '<div class="table">'
		+         '<div class="row header">'
		+             '<div class="cell nome"></div>';
	
	if (totais != undefined && totais.length > 0) {
		for (var i = 0; i < totais.length; i++) {
			html += '<div class="cell i i' + i + ' img">'
				 +      '<b>' + totais[i].total + '</b>'
				 +      '<span>' + totais[i].nome + '</span>'
				 +  '</div>'
		}
	}
	
	return html + '</div></div></div>'
}

function spaGestoresCreateHtmlTable(gestores) {	
	var ordered = orderGestores(gestores);
	var html = ''
	for (var i = 0; i < ordered.length; i++) {
		var  g = ordered[i]
		//
		html += "<div class='row gestor' onclick='spaGestoresOnClick(\""+g.uri+"\", \""+g.nome+"\")'>"
		     +      '<div class="cell nome">' + g.nome + '</div>'
		for (var j = 0; j < g.dados.length; j++)
			html  += '<div class="cell i i' + j + ' data">' + g.dados[j].valor + '</div>'
		html += '</div>'
	}
	return '<div class="table">' + html + '</div>'
}


/**
 * ao clicar em alguma linha, redirecionamos para página de gestor
 */
function spaGestoresOnClick(gestorUri, nome) {	
	loadPage(spaGestor, gestorUri, nome);
}

function orderGestores(array) {
	var naoInformado = _.remove(array, function(gestor) { return gestor.nome.toLowerCase() === 'não informado'; });
	var ordered = _.orderBy(array, ['nome']);
	return _.concat(naoInformado, ordered);
}








