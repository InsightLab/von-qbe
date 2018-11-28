
function spaPesquisa(input) {
//	var html = ''
//		+ spaPageTitle('Pesquisando resultados para', '"' + input.value + '"')
//		+ spaPesquisaNavegacao()
//		+ '<div id="results"></div>'
//		+ '<div id="content"></div>';
//
//	$('#page').html('<div id="page-hierarquia">' + html + '</div>');
	
	runPesquisa(input);
};

function spaPesquisaNavegacao() {
	var html = ''
		+ '<div class="tarja">'
		+     '<div class="table">'
		+         '<div id="hierarquia-navegacao" class="row header">'
		+ '</div></div></div>';
	return html;
};

function runPesquisa(input) {
	var label = input.value;
	if (label) {
		//Limpa elemento container e adicionar feedback visual
//		$("#content").empty();
//		$("#results").empty();
//		$("#results").append(addAjaxFeedback());

		var url = 'helper?' + $.param({text: label});
//		var url = 'helper/'+label
		//Dispara requisição ao servidor
		$.ajax({
			url: url,
			type: 'GET',
			success: function(response) {
				console.log(response)
				if (response.length > 0) {
					var results = $("#search-results");
					
					window.searchResults = response;
					
					results.empty();
					
					$.each(response, function(key, value) {
						var aux = value;						
						
						var div = $('<div>'+aux+'</div>');
						console.log(div)
						results.append(div);
						div.click(function(){
							spaPesquisaClickSugestao(key);
						});						
					});
					
					results.css({opacity: 1});
				}				
			}
		});
	}
};

function spaPesquisaClickSugestao(key) {
	var results = $("#search-results"),
	    search = $("#input-search");
	
	results.empty();
	results.css({opacity: 0});
	
	var sug = window.searchResults[key];
	
	var texto = search.val();
	
	texto += " "+sug
	
	search.val(texto);
	search.keyup();
};

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function spaRunQuery() {
	var results = $("#search-results"),
    search = $("#input-search");

	results.empty();
	results.css({opacity: 0});
	
	var texto = search.val();
	if (texto.trim().length > 0) {
		
		var container = $("#results");
		container.empty();
		container.append(addAjaxFeedback());
		
		var url = 'query?' + $.param({text: texto});
		//Dispara requisição ao servidor
		$.ajax({
			url: url,
			type: 'GET',
			success: function(response) {
				console.log(response)
				container.empty();
				html = "";
				
				if(response.length==0){				
					html = "<h3'>Nenhum resultado encontrado</h3>";
					container.append(html);
				}
				else{					
					
					var tbl     = document.createElement("table");
			        var tblBody = document.createElement("tbody");
			        var tblHead = document.createElement("thead");
			        
			        var row = document.createElement("tr");
					row.classList.add("nome");
					$.each(response[0].values, (k,i) => { 
						var h = document.createElement("td")
						h.innerHTML = k;
						row.appendChild(h)
					});
					
					tblHead.appendChild(row);
			        tbl.appendChild(tblHead);
					
					$.each(response, (key, item) => {
						
						var row = document.createElement("tr");
						row.classList.add("nome");
						$.each(item.values, function(key, l) {
							var e = document.createElement("td");
							if(l[0] == "<")
								e.innerHTML = urlify(""+l.replace("<","").replace(">",""));
							else
								e.innerHTML = l;
							row.appendChild(e);
						});
						
						tblBody.appendChild(row)
//						
					});
					
					tbl.appendChild(tblBody);
					container.append(tbl);
				}	
				
			}
		});
	}
}

/**
 * filtra todos os gestores que tenha 'text' em seu nome
 */
function spaPesquisaFiltroGestores(gestores, text) {
	var list = []
	for (var i = 0; i < gestores.length && list.length < 5; i++) {
		var  g = gestores[i]
		if (g.nome.toLowerCase().indexOf(text) != -1)
			list.push(g)
	}
	return list
}

/**
 * coleta todos os cards (organizado por 'coluna') - filtrando por um 'text'
 */
function spaPesquisaFiltroCards(totais, rows, text) {
	var colunas = {}
	for (var i = 0; i < totais.length; i++) {
		colunas[totais[i].nome] = {}
	}
	for (var i = 0; i < rows.length; i++) {
		var  r = rows[i]
		for (var j = 0; j < totais.length; j++) {
			var coluna = totais[j].nome
			var value  = r[coluna]
			if (value.toLowerCase().indexOf(text) != -1)
				colunas[coluna][value] = true
		}
	}
	var list = []
	for (var colName in colunas) {
		var coluna = {nome: colName, cards: []}
		var cards  = colunas[colName]
		for (var cardName in cards)
			coluna.cards.push({nome: cardName})
		list.push(coluna)
	}
	return list
}

/**
 * gera HTML dos gestores 'selecioandos'
 */
function spaPesquisaCreateHtmlGestores(gestores) {
	if (gestores.length == 0)
		return ''
	//
	var html   = ''
	for (var i = 0; i < gestores.length; i++) {
		var  g = gestores[i]
		html  += '<div class="row gestor" onclick="spaGestoresOnClick(' + g.id + ')">'
			  +      '<div class="cell nome">' + g.nome + '</div>'
			  +      '<div class="cell nome right">' + spaCardGetPercentual(g.totais[4].percentual / 100) + ' em dados</div>'
			  +  '</div>'
	}
	return '<div class="table central">' + html + '</div>'
}

function spaPesquisaCreateHtmlCards(totais, colunas) {
	var html = ''
	// tarja
	html += '<div class="tarja">'
	html +=     '<div class="table">'
	html +=         '<div class="row header">'
	for (var i = 0; i < totais.length; i++) {
		html  += '<div class="cell i i' + i + ' img">'
		html  +=     '<span>' + totais[i].nome + '</span>'
		html  += '</div>'
	}
	html +=         '</div>'
	html +=     '</div>'
	html += '</div>'
	// colunas/cards
	html += '<div class="table cards">'
	for (var i = 0; i < colunas.length; i++) {
		var  c = colunas[i]
		html  += '<div class="cell">'
		for (var j = 0; j < c.cards.length; j++) {
			// capturando apenas o nome .. demais valores ainda para ser calculados..
			var nome       = c.cards[j].nome
			var total      = 1 // valor desconsiderado..
			var percentual = 1 // valor desconsiderado..
			var compacto   = true
			html  += spaCard(nome, total, percentual, compacto)
		}
		html += '</div>' // end cell
	}
	html += '</div>'
	//
	return html
}






