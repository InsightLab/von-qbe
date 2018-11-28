
function spaGestor(uri, nome) {	
	$('#layout').css('min-height', '130vh');
	var html = ''
		+ spaPageTitle('Carregando a distribuição da participação de', nome)
		+ spaGestorCreateHtmlResumo()
	
	$('#page').html('<div id="page-gestor">' + html + '</div>')
	
	initGestor(uri);
};

function initGestor(uri) {
	scrollAnimate(0);
	var container = $("#page-gestor");
	container.append(addAjaxFeedback());
	
	$.get('./gestores/gestor', {uri: uri}, function(data) {
		// Remove o ajax load feedback
		container.empty();
		
		var html = ''
			+ spaPageTitle('Distribuição da gestão de', data.nome)
			+ spaGestorCreateHtmlResumo(data.dados)
			+ spaGestorCreateHtmlCards(data.colunas)
			
		container.html(html);
	});
};

function spaGestorCreateHtmlResumo(totais) {
	var html = ''
		+ '<div class="tarja">'
		+     '<div class="table">'
		+         '<div class="row header">';
	
	if (totais != undefined && totais.length > 0) {
		for (var i = 0; i < totais.length; i++) {
			var  t = totais[i]
			html += '<div class="cell i i' + i + ' img">'
				 +      '<b class="first">' + t.valor + ' de ' + t.total + '</b>'
				 +      '<span>' + t.nome + '</span>'
				 +      '<b>' + spaCardGetPercentual(t.valor / t.total) + '</b>'
				 +  '</div>'
		}
	}
	
	return html + '</div></div></div>';
};

function spaGestorCreateHtmlCards(colunas) {
	var html = '<div class="table caixas">'
	for (var i = 0; i < colunas.length; i++) {
		var  c = colunas[i]
		html  += '<div class="cell">'
		for (var j = 0; j < c.cards.length; j++) {
			// capturando apenas o nome .. demais valores ainda para ser calculados..
			var nome       = c.cards[j].nome
			var total      = parseInt(Math.random()*100)
			var percentual = c.cards[j].valor
			var compacto   = false
			if (i == 4) { // ultima coluna sempre contem apenas 1 item (100% do dado)
				total      = 1
				percentual = "1.0"
				compacto   = true
			}
			html  += spaCard(nome, total, percentual, compacto)
		}
		html += '</div>' // end cell
	}
	return html + '</div>'
};