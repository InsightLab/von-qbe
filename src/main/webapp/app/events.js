/**
 * Função para adicionar efeito de load na interface.
 * @returns {String}
 */
addAjaxFeedback = function(classe) {
	if (classe != undefined) {
		return "<div id='ajax-load' class='"+ classe +"'><img src='./img/flickr.gif'></div>"
	} else {
		return "<div id='ajax-load' class='ajax-load'><img src='./img/flickr.gif'></div>"
	}	
};

/**
 * Função de controle do efeito de clique sobre um card.
 * @param clicked {card clicado}
 * @param cards {lista total de cards}
 */
applyCardClickEffect = function(clicked, cards) {
	//Percorre os cards para aplicar efeito visual
	$.each(cards, function(index, card) {
		if (card == clicked) {
			//Destaca o card clicado
			$(card).addClass('is-zoom-in');
		} else {
			//Diminui os de mais cards
			$(card).addClass('is-zoom-out');
		}
	});
};

/**
 * Função de controle do campo de buscas - Disparado vai botão enter
 * @param event
 * @param elemento
 */
searchChange = function(event, elemento) {
	//Limpa o componente de idiomas
	$("#langs").empty();
	//Verifica se a tecla enter foi pressionada, caso sim, dispara a requisição ao servidor
	if (event.keyCode == 13) {				
		//Recupera texto digitado
		var label = elemento.value;
		if (label) {
			//Limpa elemento container e adicionar feedback visual
			$("#content").empty();
			$("#results").empty();
			$("#results").append(addAjaxFeedback());
			window.disciplinaAtual = undefined;
			window.dominioAtual = undefined;
			window.subdominioAtual = undefined;
			window.grupoAtual = undefined;
			//Dispara requisição ao servidor
			$.ajax({
				url: './indice/buscar/' + label,
				type: 'GET',
				data: {f: true},
				success: function(response) {				
					//Remove o ajax load feedback					
					$("#results").empty();
					
					//Volta a interface para o início do scroll
					scrollAnimate(0);
					
					if (response.length > 0) {
						var series = [];
						$.each(response, function(index, termo) {
							
							termo['id'] = hashCode(termo.uri);
							
							if (_.includes(termo.uri, '/dado')) {
								termo['classe'] = "dado";
							} else if (_.includes(termo.uri, '/produto')) {
								termo['classe'] = "produto";
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
								termo['categoria'] = 4;
							}
							
							if (termo.categoria < 4) {
								termo['main'] = true;
							} else {
								termo['main'] = false;
							}
							
							window.dataset[termo.id] = termo;							
							series.push(termo);						
						});
						
						//Ordena o resultado com base do label informado pelo usuário
						series.sort(function(a, b) {
						    return levenshteinDistance(a.nome, label) - levenshteinDistance(b.nome, label);
						});
						
						window.results.innerHTML += template_results(series);
						
						setTimeout(function() {
							$('.template-results .content.is-hidden').removeClass('is-hidden');
						}, 10);
					} else {
						window.results.innerHTML += template_no_results('Nenhum produto ou dado bruto foi encontrado.');
					}															
				}
			});
		}		
	}
};

addRouteHierarquia = function(nivel, nome, title, callback, id) {
	var flag = $('<div/>', {id: "hierarquia-"+nivel, class: "cell i i"+nivel+" img"})
	   .append('<b>'+title+'</b>')
	   .append('<span>'+nome+'</span>');
	
	flag.click(callback);
	
	if (typeof(id)==='undefined') id = "#hierarquia-navegacao";
	
	$(id).append(flag);
};

openDisciplina = function(element, id) {
	$("#langs").empty();
	//Recupera objeto da disciplina
	var item = window.dataset[id];
	//Seleciona todos os card de disciplina
	var buttons = $('.template-results .result-item');
	//Aplicar efeito visual
	applyCardClickEffect(element, buttons);
	//Aguarda efeito e realiza requisição a disciplina clicada
	setTimeout(function() {
		//Zera o objeto global do dataset
		window.dataset = {};
		//Atualiza o objeto global da disciplina atual
		window.disciplinaAtual = item;
		window.dominioAtual = undefined;
		window.subdominioAtual = undefined;
		window.grupoAtual = undefined;
		
		$("#hierarquia-0").remove();
		
		addRouteHierarquia(0, item.nome, 'Disciplina', function() {
			$("#hierarquia-1").remove();
			$("#hierarquia-2").remove();
			$("#hierarquia-3").remove();
			loadConcepts('./hierarquia/disciplina/dominios', {uri: item.uri});
		});
		
		//Solicita requisição ao serviço
		loadConcepts('./hierarquia/disciplina/dominios', {uri: item.uri});
	}, 1000);
};

openDominio = function(element, id) {
	//Recupera objeto do dominio
	var item = window.dataset[id];
	//Seleciona todos os card de dominio
	var buttons = $('.template-results .result-item');
	//Aplicar efeito visual
	applyCardClickEffect(element, buttons);
	//Aguarda efeito e realiza requisição ao dominio clicado
	setTimeout(function() {
		//Zera o objeto global do dataset
		window.dataset = {};
		//Atualiza o objeto global do domínio atual
		window.dominioAtual = item;
		window.subdominioAtual = undefined;
		window.grupoAtual = undefined;
		
		addRouteHierarquia(1, item.nome, 'Domínio', function() {
			$("#hierarquia-2").remove();
			$("#hierarquia-3").remove();
			loadConcepts('./hierarquia/dominio/relacoes', {uri: item.uri});
		});
		
		//Solicita requisição ao serviço
		loadConcepts('./hierarquia/dominio/relacoes', {uri: item.uri});
	}, 1000);
};

openSubdominio = function(element, id) {
	//Recupera objeto do subdominio
	var item = window.dataset[id];
	//Seleciona todos os card de subdominio
	var buttons = $('.template-results .result-item');
	//Aplicar efeito visual
	applyCardClickEffect(element, buttons);
	//Aguarda efeito e realiza requisição ao dominio clicado
	setTimeout(function() {
		//Atualiza o objeto global do subdomínio atual
		window.subdominioAtual = item;
		window.grupoAtual = undefined;
		
		addRouteHierarquia(2, item.nome, 'Subdomínio', function() {
			$("#hierarquia-3").remove();
			loadConcepts('./hierarquia/subdominio/relacoes', {uri: item.uri});
		});
		
		//Solicita requisição ao serviço
		loadConcepts('./hierarquia/subdominio/relacoes', {uri: item.uri});
	}, 1000);
};

openGrupo = function(element, id) {
	//Recupera objeto do subdominio
	var item = window.dataset[id];
	//Seleciona todos os card de subdominio
	var buttons = $('.template-results .result-item');
	//Aplicar efeito visual
	applyCardClickEffect(element, buttons);
	//Aguarda efeito e realiza requisição ao dominio clicado
	setTimeout(function() {
		//Atualiza o objeto global do grupo atual
		window.grupoAtual = item;
		
		//Verifica se já existe hierarquia montada ou se o grupo foi aberto via a pesquisa de key word
		if ($("#hierarquia-navegacao").find("div").length > 0) {
			addRouteHierarquia(3, item.nome, 'Grupo', function() {
				loadGrupo('./hierarquia/grupo/dados', {uri: item.uri});
			});
		} else {
			//Monta a hierarquia do grupo que foi clicado a partir da pesquisa de key word
			if (item.disciplina) {				
				var disciplina = {uri: item.disciplina.nome, nome: item.disciplina.valor};
				window.disciplinaAtual = disciplina;
				
				addRouteHierarquia('inicio', 'Início', '', reloadConcepts);				
				addRouteHierarquia(0, item.disciplina.valor, 'Disciplina', function() {
					$("#hierarquia-1").remove();
					$("#hierarquia-2").remove();
					$("#hierarquia-3").remove();
					loadConcepts('./hierarquia/disciplina/dominios', {uri: item.disciplina.nome});
				});
			}
			if (item.dominio) {				
				var dominio = {uri: item.dominio.nome, nome: item.dominio.valor};
				window.dominioAtual = dominio;
				
				addRouteHierarquia(1, item.dominio.valor, 'Domínio', function() {
					$("#hierarquia-2").remove();
					$("#hierarquia-3").remove();
					loadConcepts('./hierarquia/dominio/relacoes', {uri: item.dominio.nome});
				});
			}
			if (item.subdominio) {				
				var subdominio = {uri: item.subdominio.nome, nome: item.subdominio.valor};
				window.subdominioAtual = subdominio;
				
				addRouteHierarquia(2, item.subdominio.valor, 'Subdomínio', function() {
					$("#hierarquia-3").remove();
					loadConcepts('./hierarquia/subdominio/relacoes', {uri: item.subdominio.nome});
				});
			}
			addRouteHierarquia(3, item.nome, 'Grupo', function() {
				loadGrupo('./hierarquia/grupo/dados', {uri: item.uri});
			});
		}		
		
		//Solicita requisição ao serviço
		loadGrupo('./hierarquia/grupo/dados', {uri: item.uri});
	}, 1000);
};

backDisciplina = function() {
	var elemento = $("#hierarquia-navegacao");
	window.dominioAtual = undefined;
	window.subdominioAtual = undefined;
	window.grupoAtual = undefined;
	
	if (window.viewer === window.VIEWER_CARD) {		
		if (elemento.html().length == 0) {
			addRouteHierarquia('inicio', 'Início', '', reloadConcepts);		
			addRouteHierarquia(0, window.disciplinaAtual.nome, 'Disciplina', function() {
				$("#hierarquia-1").remove();
				$("#hierarquia-2").remove();
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/disciplina/dominios', {uri: window.disciplinaAtual.uri});
			});
		}	
		loadConcepts('./hierarquia/disciplina/dominios', {uri: window.disciplinaAtual.uri});		
	} else if (window.viewer === window.VIEWER_GRAPH) {
		$("#results").addClass("graph");
		$("#results").css({'width': '100%', 'height': (window.innerHeight - 150)+'px'});
		loadDominiosGraphView('./hierarquia/disciplina/dominios', {uri: window.disciplinaAtual.uri});		
	}	
};

backDominio = function() {
	var elemento = $("#hierarquia-navegacao");
	window.subdominioAtual = undefined;
	window.grupoAtual = undefined;
	
	if (window.viewer === window.VIEWER_CARD) {
		if (elemento.html().length == 0) {			
			addRouteHierarquia('inicio', 'Início', '', reloadConcepts);		
			addRouteHierarquia(0, window.disciplinaAtual.nome, 'Disciplina', function() {
				$("#hierarquia-1").remove();
				$("#hierarquia-2").remove();
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/disciplina/dominios', {uri: window.disciplinaAtual.uri});
			});
			addRouteHierarquia(1, window.dominioAtual.nome, 'Domínio', function() {
				$("#hierarquia-2").remove();
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/dominio/relacoes', {uri: window.dominioAtual.uri});
			});
		}
		loadConcepts('./hierarquia/dominio/relacoes', {uri: window.dominioAtual.uri});
	} else if (window.viewer === window.VIEWER_GRAPH) {
		$("#results").addClass("graph");
		$("#results").css({'width': '100%', 'height': (window.innerHeight - 150)+'px'});
		loadSubdominiosGraphView('./hierarquia/dominio/relacoes', {uri: window.dominioAtual.uri});
	}	
};

backSubdominio = function() {
	var elemento = $("#hierarquia-navegacao");
	window.grupoAtual = undefined;
	
	if (window.viewer === window.VIEWER_CARD) {
		if (elemento.html().length == 0) {		
			addRouteHierarquia('inicio', 'Início', '', reloadConcepts);		
			addRouteHierarquia(0, window.disciplinaAtual.nome, 'Disciplina', function() {
				$("#hierarquia-1").remove();
				$("#hierarquia-2").remove();
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/disciplina/dominios', {uri: window.disciplinaAtual.uri});
			});
			addRouteHierarquia(1, window.dominioAtual.nome, 'Domínio', function() {
				$("#hierarquia-2").remove();
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/dominio/relacoes', {uri: window.dominioAtual.uri});
			});
			addRouteHierarquia(2, window.subdominioAtual.nome, 'Subdomínio', function() {
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/subdominio/relacoes', {uri: window.subdominioAtual.uri});
			});
		}
		loadConcepts('./hierarquia/subdominio/relacoes', {uri: window.subdominioAtual.uri});
	} else if (window.viewer === window.VIEWER_GRAPH) {
		$("#results").addClass("graph");
		$("#results").css({'width': '100%', 'height': (window.innerHeight - 150)+'px'});
		loadGruposGraphView('./hierarquia/subdominio/relacoes', {uri: window.subdominioAtual.uri});
	}	
};

backGrupo = function() {
	var elemento = $("#hierarquia-navegacao");
	
	if (window.viewer === window.VIEWER_CARD) {
		if (elemento.html().length == 0) {
			addRouteHierarquia('inicio', 'Início', '', reloadConcepts);		
			addRouteHierarquia(0, window.disciplinaAtual.nome, 'Disciplina', function() {
				$("#hierarquia-1").remove();
				$("#hierarquia-2").remove();
				$("#hierarquia-3").remove();
				loadConcepts('./hierarquia/disciplina/dominios', {uri: window.disciplinaAtual.uri});
			});
			
			if (window.dominioAtual !== undefined) {
				addRouteHierarquia(1, window.dominioAtual.nome, 'Domínio', function() {
					$("#hierarquia-2").remove();
					$("#hierarquia-3").remove();
					loadConcepts('./hierarquia/dominio/relacoes', {uri: window.dominioAtual.uri});
				});
			}			
			
			if (window.subdominioAtual !== undefined) {
				addRouteHierarquia(2, window.subdominioAtual.nome, 'Subdomínio', function() {
					$("#hierarquia-3").remove();
					loadConcepts('./hierarquia/subdominio/relacoes', {uri: window.subdominioAtual.uri});
				});
			}
			
			if (window.grupoAtual !== undefined) {
				addRouteHierarquia(3, window.grupoAtual.nome, 'Grupo', function() {
					loadGrupo('./hierarquia/grupo/dados', {uri: window.grupoAtual.uri});
				});
			}			
		}
		loadGrupo('./hierarquia/grupo/dados', {uri: window.grupoAtual.uri});
	} else if (window.viewer === window.VIEWER_GRAPH) {
		$("#results").addClass("graph");
		$("#results").css({'width': '100%', 'height': (window.innerHeight - 150)+'px'});
		loadDadosGraphView('./hierarquia/grupo/dados', {uri: window.grupoAtual.uri});
	}	
};

openDado = function(element, id) {
	scrollAnimate(0);
	//Recupera objeto do dado pelo id recebido
	var termo = window.dataset[id];
	//Seleciona todos os card de dado
	var buttons = $('.template-results .result-item');
	//Aplicar efeito visual
	applyCardClickEffect(element, buttons);
	//Limpa o componente de rotas
	$("#hierarquia-navegacao").empty();
	
	$("#page-label").text("Gestão dos Dados");
	$("#page-title").text("Hierarquia da Informação");
	
	//Aguarda efeito e realiza requisição das relações do termo clicado
	setTimeout(function() {		
		//Limpa elemento container e adicionar feedback visual
		$("#results").empty();
		$("#content").empty();
		$("#results").append(addAjaxFeedback());
		//Dispara requisição pelas requisições		
		$.get('relacoes',{uri: termo.uri}, function(data) {
			//Remove o ajax load feedback
			$("#results").empty();
			//Apresenta os resultados na interface
			window.countCard = 0;
			window.termosClicados = [];
			window.termosClicados[0] = data;
			
			checkHierarquiaExistente(termo);
			
			data["classe"] = termo.classe;
			data["funcional"] = termo.funcional;
			
			window.results.innerHTML += template_card(data, termo.categoria);		
			setTimeout(function() {
				$(".card.is-hidden").removeClass("is-hidden");
			}, 30);		
		});			
	}, 700);
};

clickImage = function(element, index) {
	var e = element.find('.card')
	//
	var items = e.findAll('.selected')
	for (var i = 0; i < items.length; i++)
		items[i].classList.remove('selected')
	//
	e.find('.img'+index).classList.add('selected')
	e.find('.btn'+index).classList.add('selected')
	//
	var z = parseInt(e.querySelector('.images').getAttribute('z')) + 1
	e.find('.img'+index).style.zIndex = z
}

/*
 * mesma action de 'click' em botao 'plus (+)'
 */
clickResumoBtnPlus = function(element) {
	element.find('.btn-plus').click();
}

/**
 * clique no botao para detalhar listagem de relacoes
 */
clickBtnPlus = function(element) {
	// abrindo/fechando...
	var idParent = parseInt($(element).closest("div.template-card").attr("id").replace("card-termo-", ""));
	element.parentNode.classList.toggle('extended')
	
	// removendo 'in-relation' se estamos em tela extendida
	if (element.parentNode.classList.contains('extended')) {
		element.parentNode.classList.remove('in-relation');
		
		for (var card = idParent+1; card < window.termosClicados.length; card++) {
			$("#card-termo-"+card).remove();
		}	
		window.countCard = idParent+1;
		window.termosClicados.splice(idParent + 1);		
	}

	// dando scroll automaticamente, se necessario
	if (element.parentNode.classList.contains('extended')) {
		var card = $(element);	
		var altura = card.offset().top + card.height();
		scrollAnimate(altura - 150);
	}

/*	// procurando por cards a partir do atual, se houver, entao removemos!
	var top   = element.parentNode.offsetTop
	var cards = document.querySelectorAll('.card')
	var i     = cards.length
	while (i-- >= 0) {
		if (cards[i].offsetTop <= top)
			break
		var svg = d3.select(cards[i]).select('svg')
		if (svg)
			svg.remove()
		cards[i].remove()
	}*/
	
	var elem = element.find('.panel-relacoes');
	var idParent = parseInt($(element).closest("div.template-card").attr("id").replace("card-termo-", ""));
	var data = window.termosClicados[idParent];	
	d3.select(elem).select('svg').remove();
	elem.classList.add('in-graph');	
	createGraph(elem.querySelector('.view.graph'), data);	
}


changeDictionary = function(posicaoExactMatch) {
	//Limpa o componente de idiomas
	$("#langs").empty();
	var arrayExactMatch = window.termosClicados[0].relacoes[posicaoExactMatch];
	var length = arrayExactMatch.length-1;
	var random = Math.floor((Math.random() * length));
	var uri = arrayExactMatch[1][random];
	
	//Limpa elemento container e adicionar feedback visual
	$("#results").empty();
	$("#content").empty();
	$("#results").append(addAjaxFeedback());
	
	$.get('./relacoes', {uri: uri}, function(data) {
		$("#results").empty();
		window.countCard = 0;
		window.termosClicados = [];
		window.termosClicados[0] = data;
		window.results.innerHTML += template_card(data, Math.floor((Math.random() * 3) + 1));	
		setTimeout(function() {
			$(".card.is-hidden").removeClass("is-hidden");
		}, 10);
	});
}


clickTipoVisualizacao = function(element, target) {
	var elem = element.find('.panel-relacoes');
	var svg  = d3.select(elem).select('svg').size() == 1;
	var idParent = parseInt($(element).closest("div.template-card").attr("id").replace("card-termo-", ""));
	var data = window.termosClicados[idParent];
	
	if (target == 'graph') {
		if (elem.classList.contains('in-graph')) {
			d3.select(elem).select('svg').remove()
			return createGraph(elem.querySelector('.view.graph'), data)
		}
	}

	if (target == 'links') {
		elem.classList.remove('in-graph')
	} else {
		elem.classList.add('in-graph')
		if (svg == false)
			createGraph(elem.querySelector('.view.graph'), data)
	}
}


clickRelacao = function(element, categoria, tipoRelacao, idioma, termo) {
	
	var idParent = parseInt($(element).closest("div.template-card").attr("id").replace("card-termo-", ""));	
	
	var relacao  = element.find('.group-name').innerText;	
	
	var vetorAutoRelacoes = $.grep(window.termosClicados[idParent].autoRelacoes[tipoRelacao][1], function(r) {
		return r[0] == idioma;
	})[0][1];
	
	var uriDesejada = vetorAutoRelacoes[termo].uri;	
	
	var e = element.find('.card')
	e.querySelector('.relation-name').innerHTML = relacao
	e.querySelector('.btn-relacao').innerHTML   = element.innerText
	var c = e.querySelector('.panel-relacao')
	c.classList.remove('c1')
	c.classList.remove('c2')
	c.classList.remove('c3')
	c.classList.add('c' + categoria)
	//
	e.classList.remove('extended')
	e.classList.add('in-relation')
	
	//Limpa elemento container e adicionar feedback visual
	$("#content").append(addAjaxFeedback("ajax-load-relacao"));	
	
	// open new card ...
	$.get('./relacoes', {uri: uriDesejada}, function(data) {
		//console.log(data)
		$("#ajax-load").remove();
		window.termosClicados[idParent + 1] = data;
		window['content'].innerHTML += template_card(data, categoria);	
		setTimeout(function() {
			$(".card.is-hidden").removeClass("is-hidden");
		}, 10);		
	});
	
	//Atualiza posição do scroll
	var cards = $('.card');
	var card = $(cards[cards.length - 1]);	
	var altura = card.offset().top + card.height();
	scrollAnimate(altura + 100)
};

scrollTermList = function() {
	var conceito = window.conceitoAtual;
	var offset = window.offset + 10;
	//Criar estrategia para alterar a lingua
	if (window.processing) {
		if (window.finished) {
			$("#container-termos").append("<p>Todos os termos foram carregados!</p>");
			window.finished = false;
		}
		return false;
	} else {
		if ($(window).scrollTop() >= ($(document).height()-$(window).height())*0.7){
			$("#margin-bottom").append(addAjaxFeedback());
			window.offset = offset;
			window.processing = true;			
			appendTerms(conceito+'/termos', {lang: window.idioma, offset:offset, limit:10}, show_buttons)		
		}
	}
};

scrollTermListProvedor = function() {
	var provedor = window.conceitoAtual;
	var offset = window.offset + 10;
	//Criar estrategia para alterar a lingua
	if (window.processing) {
		if (window.finished) {
			$("#container-termos").append("<p>Todos os termos foram carregados!</p>");
			window.finished = false;
		}
		return false;
	} else {
		if ($(window).scrollTop() >= ($(document).height()-$(window).height())*0.7) {
			$("#margin-bottom").append(addAjaxFeedback());
			window.offset = offset;
			window.processing = true;
			appendTerms('./provedor/buscar/termos', {uri: provedor, offset: offset, limit: 10}, show_buttons)		
		}
	}
};

trocarIdiomaTermo = function() {
	if (!$(this).hasClass("clicado")) {
		//Limpa elemento container e adicionar feedback visual
		$("#content").empty();
		$("#results").empty();
		$("#results").append(addAjaxFeedback());	
		//Aplica tratamentos de efeitos e troca de eventos
		$(this).off('click');
		var idioma = $(this).attr("id").replace("flag-", "");
		var selecionado = $("div.clicado");
		selecionado.off('click');
		selecionado.removeClass("clicado");
		selecionado.click(trocarIdiomaTermo);
		$(this).addClass("clicado");			
		//Apresenta os resultados na interface
		window.countCard = 0;
		$("#results").empty();
		window.results.innerHTML += template_card(window.termosClicados[0], window.termosClicados[0].categoria, idioma);		
		setTimeout(function() {
			$(".card.is-hidden").removeClass("is-hidden");
		}, 30);		
	}
};


