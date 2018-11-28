function spaGlossarios() {
	window.open('http://mapaconceituald.petrobras.com.br/glossario/', '_blank');
	//window.open('http://mapaconceitualh.petrobras.com.br/glossario/', '_blank');
	//window.open('http://mapaconceitual.petrobras.com.br/glossario/', '_blank');
};

function spaControles() {	
	var html =	
//	  '<div id="botao-conceitos" class="botao-conceitos" onclick="reloadHierarquia()" title="Clique para listar as disciplinas."></div>'
//	+ '<div id="botao-provedores" class="botao-provedores" onclick="reloadOperacionais()" title="Clique para trocar para a visualização dos produtos operacionais."></div>'
//	+ '<div id="botao-check" class="botao-check" onclick="spaCompletude()" title="Clique para visualizar a completude dos dados."></div>'
//	+ '<div id="botao-gestores" class="botao-gestores" onclick="spaGestores()" title="Clique para visualizar a distribuição da gestão dos dados."></div>'
//	'<div id="botao-fundamentacao" class="botao-fundamentacao" onclick="spaRunQuery()" title="Clique para executar a consulta aos dados."></div>';
//	+ '<div id="botao-creditos" class="botao-creditos" onclick="spaCreditos()" title="Clique para visualizar a equipe do projeto.">Créditos</div>'
//	'<div id="botao-glossarios" class="botao-glossarios" onclick="spaGlossarios()" title="Clique para visualizar o Mapa de Glossários.">Mapa de Glossários</div>';
	
	$('body').append(html);
};