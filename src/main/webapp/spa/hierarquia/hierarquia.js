
function spaHierarquia(callback) {
	$('#layout').css('min-height', '130vh');
	var html = ''
		+ spaPageTitle('', '')
		+ spaHierarquiaNavegacao()
		+ '<div id="results"></div>'
		+ '<div id="content"></div>';

	$('#page').html('<div id="page-hierarquia">' + html + '</div>');	

	if (callback != null && typeof callback === "function") {
		callback();
	}
};

function spaHierarquiaNavegacao() {
	var html = ''
		+ '<div class="tarja">'
		+     '<div class="table">'
		+         '<div id="hierarquia-navegacao" class="row header">'
		+				'<form id="search-field" onsubmit="spaRunQuery(); return false">'
		+					'<input id="input-search" placeholder="Search" autocomplete="off" onkeyup="spaPesquisarOnKeyup(this)"/>'
		+					'<input id="run" type="submit" value="" title="Click to execute the search."/>'
		+				'<div id="search-results"> </div>'
		+				'</form>'
		
		
		+ '</div></div></div>';
	return html;
};

/**
 * search - direcionando usuario para tela de pesquisa baseado no valor digitado
 */
var timerSearchKeyup = 0

function spaPesquisarOnKeyup(input) {
	clearTimeout(timerSearchKeyup)
	timerSearchKeyup = setTimeout(function() {
		if (input.value.trim().length > 0 && (input.value != window.searchTexto)) {
			window.searchTexto = input.value;
			spaPesquisa(input);
		}	
	}, 1000)
};