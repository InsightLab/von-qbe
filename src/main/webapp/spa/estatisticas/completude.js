
function spaCompletude() {
	$('#layout').css('min-height', '130vh');
	var html = ''
		+ spaPageTitle('Carregando as estatísticas', 'Completude dos Dados')
		+ spaCompletudeCabecalho()
		
	$('#page').html('<div id="page-completude">' + html + '</div>');
	
	initCompletude();
};

function initCompletude() {
	window.viewer = window.VIEWER_CARD;
	window.disciplinaAtual = undefined;
	window.dominioAtual = undefined;
	window.subdominioAtual = undefined;
	window.grupoAtual = undefined;
	$("#input-search").val("");
	
	scrollAnimate(0);
	var container = $("#page-completude");
	container.append(addAjaxFeedback());
	
	$.get('./estatisticas/nao-existentes', {}, function(data) {
		// Remove o ajax load feedback
		container.empty();		
		
		var html = spaPageTitle('Estatísticas', 'Completude dos Dados')
		         + spaCompletudeCabecalho()
				 + spaCompletudeCreateHtmlTable(data);

		container.html(html);
	});	
};

function spaCompletudeCabecalho() {
	var html = ''
		+ '<div class="tarja">'
		+     '<div class="table">'
		+         '<div class="row header">'
		+ 			  '<div class="cell i img">'
		+      			  '<span>Propriedade Não Informada</span>'
		+  			  '</div>'
		+ 			  '<div class="cell i img">'
		+      			  '<span>Quantidade</span>'
		+  			  '</div>'
		+ '</div></div></div>';
	return html;
}

function spaCompletudeCreateHtmlTable(data) {
	var html = '';
     		 
	var res = [];
	
	$.each(data, function(index, object) {
		res.push(estatisticaNaoExistenteMapping(object));
	});	
	
	// Ordena pelo valor
	res.sort(function(a, b) {
	    if(a.valor < b.valor) return -1;
	    if(a.valor > b.valor) return 1;
	    return 0;
	});
	
	$.each(res, function(index, item) {			
		html += "<div class='row gestor' onclick='apresentarDadosSemProp(\""+item.alias+"\", \""+item.propriedade+"\")'>"
        	 + 		'<div class="cell nome">' + item.alias + '</div>'
        	 + 		'<div class="cell i faltando data">' + item.valor + '</div>'
     		 + '</div>'
	});
	
	return '<div class="table">' + html + '</div>'
};


function apresentarDadosSemProp(alias, prop) {
	
	var html = ''
		+ spaPageTitle('Pesquisando resultados para', alias)
		+ spaPesquisaNavegacao()
		+ '<div id="results"></div>'
		+ '<div id="content"></div>';

	$('#page').html('<div id="page-hierarquia">' + html + '</div>');	
	
	var content = $("#content");
	content.append(addAjaxFeedback());
	
	$.get('./estatisticas/sem-propriedade', {prop: prop}, function(data) {
		if (data.length > 0) {
			var series = [];
			$.each(data, function(index, termo) {
				
				termo['id'] = hashCode(termo.uri);
				
				// verifica se o objeto é um produto funcional	
				if (_.includes(termo['nome'], '#Funcional')) {
					termo['nome'] = termo['nome'].replace('#Funcional', '');
				}
				
				if (_.includes(termo.uri, '/dadoBruto')) {
					termo['classe'] = "bruto";
				} else if (_.includes(termo.uri, '/dadoInterpretado')) {
					termo['classe'] = "interpretado";
				} else if (_.includes(termo.uri, '/produto')) {
					termo['classe'] = "produto";
				} else {
					termo['classe'] = "hierarquia";
				}
				
				// mapeia o ID da classe
				if (_.includes(termo.uri, '/disciplina')) {
					termo['categoria'] = 0;
				} else if (_.includes(termo.uri, '/dominio')) {
					termo['categoria'] = 1;
				} else if (_.includes(termo.uri, '/subdominio')) {
					termo['categoria'] = 2;
				} else if (_.includes(termo.uri, '/grupo')) {
					termo['categoria'] = 3;
				} else {
					termo['categoria'] = 9;
				}
				
				if (termo.categoria < 9) {
					termo['main'] = true;
				} else {
					termo['main'] = false;
				}
				
				window.dataset[termo.id] = termo;							
				series.push(termo);						
			});
			
			$("#page-label").text("Dados/Produtos sem a propriedade");
			content.empty();
			window.results.innerHTML += template_results(series);
			
			setTimeout(function() {
				$('.template-results .content.is-hidden').removeClass('is-hidden');
			}, 10);
		} else {
			window.results.innerHTML += template_no_results('Nenhum produto ou dado bruto foi encontrado sem esta propriedade.');
		}
	});
};