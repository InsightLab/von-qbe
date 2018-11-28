application = function() {	
	var logged = localStorage.getItem("mapa-exp-logged");
	if (logged != null && (logged === 'true')) {
		hideLogin();
		enableApp();
	} else {
		showLogin();
	}	
};

showLogin = function() {
	$("#langs").text("");
	$("#input-search").hide();
	$("#langs").empty();
	$("#langs").hide();
	$("#results").empty();
	$("#results").hide();
	$("#content").empty();
	$("#content").hide();
	$("#botao-conceitos").hide();
	$("#botao-provedores").hide();
	$("#botao-check").hide();
	$("#botao-fundamentacao").hide();
	$("#botao-creditos").hide();
	$("#botao-gestores").hide();
	$("#login-form").show();
};

hideLogin = function() {
	$("#login-form").hide();
	$("#langs").text("");
	$("#input-search").show();
	$("#langs").empty();
	$("#langs").show();
	$("#results").empty();
	$("#results").show();
	$("#content").empty();
	$("#content").show();
	$("#botao-conceitos").show();
	$("#botao-provedores").show();
	$("#botao-check").show();
	$("#botao-fundamentacao").show();
	$("#botao-gestores").show();
	$("#botao-creditos").show();
};

enableApp = function() {
	//Inicializa evento de clique sobre botão de load dos conceitos e provedores
	$("#botao-conceitos").click(reloadConcepts);	
	$("#botao-provedores").click(reloadProviders);
	$("#botao-check").click(showPropriedadesNaoExistentes);
	$("#botao-fundamentacao").click(loadFundamentacao);
	$("#botao-creditos").click(showAutores);
	scrollAnimate(0);
	getProvedor();
	//Dispara timeout para inicializar o load dos glossários distintos na base
	setTimeout(function() {
		document.body.classList.remove('is-unloaded')
		//
		setTimeout(function() {			
			loadConcepts('./hierarquia/disciplinas', {});	
		}, 500);
	}, 100);
};

logar = function() {
	var user = $("#usuario").val();
	var pass = $("#senha").val();
	
	$.ajax({
		url: "./autenticar",
		type: "POST",
		data: JSON.stringify({"usuario": {"chave": user, "senha": pass}}),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(result, textStatus, jqXHR) {
			$("#usuario").val('');
			$("#senha").val('');
			$("#login-msg").text("");
			localStorage.setItem("mapa-exp-logged", 'true');
			localStorage.setItem("token", result);
			hideLogin();
			enableApp();	
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$("#login-msg").text(JSON.parse(jqXHR.responseText));
			$("#usuario").val('');
			$("#senha").val('');
		}
	});
};

logout = function() {
	localStorage.removeItem("mapa-exp-logged");
	localStorage.removeItem("token");
	showLogin();
};

function loadFundamentacao(){
	window.location.href = "fundamentacao.html";
}

function loadConcepts(url, header) {
	var container = $("#results");
	//Limpa elemento container e adicionar feedback visual
	container.empty();
	$("#content").empty();
	container.append(addAjaxFeedback());
	//Dispara requisição
	$.get(url, header, function(data) {
		var res = [];
		$.each(data, function(index, object) {
			res.push(objectMapping(object));
		});
		// Remove o ajax load feedback
		container.empty();		
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		window.results.innerHTML += template_results(res);
	});
};

function loadGrupo(url, header) {
	var results = $("#results");
	var content = $("#content");
	//Limpa elemento container e adicionar feedback visual
	results.empty();
	results.append(addAjaxFeedback());
	//Dispara requisição
	$.get(url, header, function(data) {
		// Remove o ajax load feedback
		results.empty();
		content.empty();
		
		if (data.propriedades.length > 0) {
			var isNormal = true;
			$.each(data.propriedades, function(i, propriedade) {
				if (isNormal && propriedade.nome == "definicao") {
					$("#hierarquia-3").remove();
					isNormal = false;
					// Apresenta os resultados na interface
					window.results.innerHTML += template_card(data, 3, true);		
					setTimeout(function() {
						$(".card.is-hidden").removeClass("is-hidden");
					}, 30);
					content.empty();
					window.content.innerHTML += spaPageTitle('Relações do grupo', 'Dados Brutos e Produtos')
					loadNormal(data.dados, window.content);
				}
			});
			if (isNormal) {
				results.empty();
				loadNormal(data.dados, window.results);
			}
		} else {
			results.empty();
			loadNormal(data.dados, window.results);
		}			
	});
	
	function loadNormal(dados, element) {
		var res = [];
		$.each(dados, function(index, object) {
			res.push(objectMapping(object));
		});	
				
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		element.innerHTML += template_results(res);
	}
};

function loadDisciplinasGraphView(url, header) {
	var container = $("#results");
	//Limpa elemento container e adicionar feedback visual
	container.empty();
	container.append(addAjaxFeedback());
	//Zera o objeto global do dataset
	window.dataset = {};
	//Dispara requisição
	$.get(url, header, function(data) {
		var res = [];
		$.each(data, function(index, object) {
			res.push(objectMapping(object));
		});
		// Remove o ajax load feedback
		container.empty();		
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		createGraph("#results", res, mapDataDisciplinas);
	});
};

function loadDominiosGraphView(url, header) {
	var container = $("#results");
	//Limpa elemento container e adicionar feedback visual
	container.empty();
	container.append(addAjaxFeedback());
	//Dispara requisição
	$.get(url, header, function(data) {
		var res = [];
		$.each(data, function(index, object) {
			res.push(objectMapping(object));
		});
		// Remove o ajax load feedback
		container.empty();		
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		createGraph("#results", res, mapDataDominios);
	});
};

function loadSubdominiosGraphView(url, header) {
	var container = $("#results");
	//Limpa elemento container e adicionar feedback visual
	container.empty();
	container.append(addAjaxFeedback());
	//Dispara requisição
	$.get(url, header, function(data) {
		var res = [];
		$.each(data, function(index, object) {
			res.push(objectMapping(object));
		});
		// Remove o ajax load feedback
		container.empty();		
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		createGraph("#results", res, mapDataSubdominios);
	});
};

function loadGruposGraphView(url, header) {
	var container = $("#results");
	//Limpa elemento container e adicionar feedback visual
	container.empty();
	container.append(addAjaxFeedback());
	//Dispara requisição
	$.get(url, header, function(data) {
		var res = [];
		$.each(data, function(index, object) {
			res.push(objectMapping(object));
		});
		// Remove o ajax load feedback
		container.empty();		
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		createGraph("#results", res, mapDataGrupos);
	});
};

function loadDadosGraphView(url, header) {
	var container = $("#results");
	//Limpa elemento container e adicionar feedback visual
	container.empty();
	container.append(addAjaxFeedback());
	//Dispara requisição
	$.get(url, header, function(data) {
		var res = [];
		$.each(data.dados, function(index, object) {
			res.push(objectMapping(object));
		});
		// Remove o ajax load feedback
		container.empty();		
		// Ordena alfabeticamente
		res.sort(function(a, b) {
		    if(a.nome < b.nome) return -1;
		    if(a.nome > b.nome) return 1;
		    return 0;
		});		
		// Apresenta os resultados na interface
		createGraph("#results", res, mapDataDados);
	});
};

function loadTerms(url, header, callBack, more) {
	var container = $("#results");
		
	$.get(url, header, function(data) {
		var res = [];
		if (callBack instanceof Function) {
			$.each(data, function(index, object) {
				res.push(callBack(object));
			});
		};
		if (more != true) {
			window.results.innerHTML += template_results(res);
		} else {
			
		};
	});
};

/**
 * Função para requisitar os conceitos distintos.
 */
reloadConcepts = function() {
	$(window).unbind('scroll');
	//Limpa campo de buscas
	$("#content").empty();
	//Limpa o componente de idiomas
	$("#langs").empty();
	$("#input-search").val("");
	window.viewer = window.VIEWER_CARD;
	window.disciplinaAtual = undefined;
	window.dominioAtual = undefined;
	window.subdominioAtual = undefined;
	window.grupoAtual = undefined;
	loadConcepts('./hierarquia/disciplinas', {});
};

showPropriedadesNaoExistentes = function() {
	//Limpa campo de buscas
	var content = $("#content");
	content.empty();
	content.show();
	$("#results").empty();
	$("#results").removeAttr("style");
	//Limpa o componente de idiomas
	$("#hierarquia-navegacao").empty();
	$("#input-search").val("");
	window.viewer = window.VIEWER_CARD;
	window.disciplinaAtual = undefined;
	window.dominioAtual = undefined;
	window.subdominioAtual = undefined;
	window.grupoAtual = undefined;
	content.append(addAjaxFeedback());	
	
	$.get('./estatisticas/nao-existentes', {}, function(data) {	
		
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
		
		content.empty();
		
		var titulo = $('<div/>', {class: "creditos-titulo"}).text("Checagem da Completude dos Dados");
		content.append(titulo);
		
		var tabela = $('<table></table>', {class: "tabela-estatistica"});
		
		var cabecalho = $('<tr></tr>', {class: ""});
		
		cabecalho.append($('<th></th>', {class: "tabela-estatistica-coluna-titulo"}).text('Propriedade'));
		cabecalho.append($('<th></th>', {class: "tabela-estatistica-coluna-titulo"}).text('Quantidade Não Informada'));
		
		tabela.append(cabecalho);
		
		content.append(tabela);
		
		$.each(res, function(index, item) {			
			var linha = $('<tr></tr>', {class: ""});
			linha.append($('<td></td>', {class: ""}).text(item.alias));
			linha.append($('<td></td>', {class: ""}).text(item.valor));
			linha.click(function() {
				var titulo = $('<div/>', {class: "creditos-titulo"}).text("Dados/Produtos sem a propriedade: " + item.alias);
				$("#langs").append(titulo);
				apresentarDadosSemProp(item.propriedade);				
			});
			tabela.append(linha);
		});		
	});
};

aplicarFiltroIdiomaConceitos = function(conceitos) {
	//Limpa o componente de idiomas
	$("#langs").empty();
	//Verifica se existe o idioma inglês e adiciona as bandeiras
	var flag = false;
	$.each(window.idiomasConceitos, function(index, idioma) {		
		if (idioma === "ptbr") { flag = true; }
		addFlagIdioma(idioma, selecionarIdiomaConceitos);		
	});
	//Seta o idioma inicial
	var idioma = (flag) ? "ptbr" : window.idiomasConceitos[0];
	//Aplica efeito no idioma selecionado
	$("#flag-"+idioma).addClass("clicado");
	//Retorna os conceitos filtrados
	return $.grep(conceitos, function(c) {
		return c.lang === idioma;
	});
};

/**
 * Função para requisitar os provedores distintos.
 */
reloadProviders = function() {
	$("#content").empty();
	$("#content").hide();
	$("#langs").empty();
	$("#results").empty();
	$("#results").addClass("graph");
	$("#results").css({'width': window.innerWidth+'px', 'height': (window.innerHeight - 300)+'px'});
	window.viewer = window.VIEWER_GRAPH;
	loadDisciplinasGraphView('./hierarquia/disciplinas', {});
};

appendTerms = function(url, header, callBack) {
	$.get(url, header,function(data) {
		var res = [];
		if (callBack instanceof Function) {
			$.each(data, function(index,object) {
				res.push(termsMapping(object));
			});
		};
		$("#container-termos").append(callBack(res));
		if (data.length == 0){
			window.processing = true;
			window.finished = true;
		} else {
			window.processing = false;
		}
		$("#ajax-load").remove();
	});
};

selecionarIdiomaConceitos = function() {
	if (!$(this).hasClass("clicado")) {
		var container = $("#results");
		//Limpa elemento container e adicionar feedback visual
		container.empty();
		container.append(addAjaxFeedback());
		//Aplica tratamentos de efeitos e troca de eventos
		$(this).off('click');
		var idioma = $(this).attr("id").replace("flag-", "");
		var selecionado = $("div.clicado");
		selecionado.off('click');
		selecionado.removeClass("clicado");
		selecionado.click(selecionarIdiomaConceitos);
		$(this).addClass("clicado");
		//Seleciona conceitos do idioma
		var conceitos = [];
		$.each(window.conceitos, function(key, value) {
			if (value.lang === idioma) {
				conceitos.push(value)
			}
		});		
		//Apresenta os resultados na interface
		container.empty();
		window.results.innerHTML += template_results(conceitos);
	}
};

addFlagIdioma = function(idioma, callback) {
	var flag = $('<div/>', {id: 'flag-' + idioma, class: 'lang ' + idioma});
	flag.click(callback);
	$("#langs").append(flag);
};

getProvedor = function() {
	$.get('./provedor/todos', {}, function(data) {
		window.provedor = providerMapping(data[0]);
	});
};