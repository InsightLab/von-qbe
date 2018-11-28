window.searchResults = [];
window.searchTexto = "";




//Objetos globais responsável por armazenar os conceitos e termos pesquisados
window.idioma = "ptbr";
window.VIEWER_CARD = 1;
window.VIEWER_GRAPH = 2;
window.viewer = window.VIEWER_CARD;

window.idiomasConceitos = [];
window.idiomasDominios = [];

window.countCard = 0;
window.termosClicados = [];

window.provedores = {};
window.disciplinas = {};
window.dominios = {};
window.subdominios = {};
window.conceitos = {};
window.termos = {};

window.dataset = {};
window.provedor = {};

window.prefLabelsMapeados = {
	"language": "Idiomas", 
	"creator": "Provedor", 
	"grupo": "Grupo",
	"abrangencia": "Abrangência",
	"gerador": "Gerência que gera o dado",
	"aplicacaoCadastro": "Aplicação Cadastro",
	"gestao": "Unidade Gestora",
	"gestor": "Gestor",
	"definicao": "Descrição",
	"ppdm": "PPDM",
	"referencia": "Referência",
	"dominio": "Domínio",
	"subdominio": "Subdomínio"
};

window.conceitoAtual = "";
window.disciplinaAtual = undefined;
window.dominioAtual = undefined;
window.subdominioAtual = undefined;
window.grupoAtual = undefined;
window.offset = 0;
window.processing = false;
window.finished = false;

window.autoria = [
	{titulo: "Coordenador da Iniciativa",
	 lista: ["JORGE ALEXANDRE LOPES POLONIA"]},
	{titulo: "Participantes",
	 lista: ["RAPHAEL SISTON HATUSHIKA",
	         "LAURY MEDEIROS DE ARAUJO",
	         "GUSTAVO GARCIA",
	         "VANESSA MADRUCCI",
	         "ALEXANDRE DE AZEVEDO GRASSI",
	         "BRUNO TOSTA BITTENCOURT",
	         "FERNANDO JORGE PEDROSA MAIA JUNIOR",
	         "PEDRO BEVILACQUA DA M P DE VASCONCELLOS",
	         "LEA MARIA DE AGUIAR DE PEDRO",
	         "BRUNA SOUZA DA SILVA",
	         "LUIS DE CAMPOS",
	         "KATIA REGINA NOGUEIRA MENDONCA",
	         "MARCELO FAGUNDES DE REZENDE",
	         "DEAN PEREIRA DE MELO",
	         "LUCIANA BORBA",
	         "ANTONIO ENRIQUE SAYAO SANJINES",
	         "VINICIUS MARTINS BOTELHO",
	         "LAURA SILVEIRA MASTELLA",
	         "LUIS CLAUDIO RIBEIRO MACHADO",
	         "CICERO PEREIRA BATISTA JUNIOR",
	         "FERNANDO COLLO CORREA E CASTRO",
	         "CAMILA WENSE DIAS DOS ANJOS",
	         "GABRIEL DO NASCIMENTO FREITAS",
	         "ISABELA DE OLIVEIRA CARMO",
	         "GABRIEL MEDEIROS MARINS",
	         "JOSELITO CABRAL VAZQUEZ",
	         "MARCELO VASCONCELOS BRANDAO",
	         "CECÍLIA CUNHA LANA",
	         "ALEXSANDRE CAVALCANTE DE LIMA",
	         "EDSON JORGE TAVARES",
	         "ALFREDO FERNANDO LOURENCO DE ARAUJO"]},
	{titulo: "Aprovadores",
	 lista: ["LINDEMBERG PINHEIRO BORGES",
	         "PEDRO FRANCISCO DALTOE CEZAR",
	         "HENRIQUE LUIZ DE BARROS PENTEADO",
	         "MARCOS ROBERTO FETTER LOPES",
	         "HELGA ELISABETH VOELCKER",
	         "OSCAR STROHSCHOEN JUNIOR",
	         "ROBERTO SALVADOR FRANCISCO D AVILA",
	         "JULIANA MOURA VALPASSOS ABREU",
	         "VINICIUS DE FRANCA MACHADO",
	         "MARIO DUNCAN RANGEL",
	         "MONICA ALVES PEQUENO"]}
];


/**
 * Função para criar o ID a partir de um hash da uri
 * @param str
 * @returns {Number}
 */
function hashCode(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

/**
 * Função para identificar de qual classe o objeto é instância
 * @param uri
 * @returns {Number} ID da classe na interface
 */
function checkClasse(uri) {
	if (_.includes(uri, 'disciplina')) {
		return 0;
	} else if (_.includes(uri, 'dominio')) {
		return 1;
	} else if (_.includes(uri, 'subdominio')) {
		return 2;
	} else if (_.includes(uri, 'grupo')) {
		return 3;
	//caso contrário, é um dado
	} else {
		return 4;
	}
};

function checkHierarquiaExistente(object) {
	if (object.disciplina != undefined) {
		var disciplina = {uri: object.disciplina.nome, nome: object.disciplina.valor};
		window.disciplinaAtual = disciplina;
	}		
	if (object.dominio != undefined) {
		var dominio = {uri: object.dominio.nome, nome: object.dominio.valor};
		window.dominioAtual = dominio;
	}		
	if (object.subdominio != undefined) {
		var subdominio = {uri: object.subdominio.nome, nome: object.subdominio.valor};
		window.subdominioAtual = subdominio;
	}
	if (object.grupo != undefined) {
		var grupo = {uri: object.grupo.nome, nome: object.grupo.valor};
		window.grupoAtual = grupo;
	}
}

function mappingCategoria(uri, mapped) {
	// mapeia o ID da classe
	if (_.includes(uri, '/disciplina')) {
		mapped['categoria'] = 0;
	} else if (_.includes(uri, '/dominio')) {
		mapped['categoria'] = 1;
	} else if (_.includes(uri, '/subdominio')) {
		mapped['categoria'] = 2;
	} else if (_.includes(uri, '/grupo')) {
		mapped['categoria'] = 3;
	} else if (_.includes(uri, '/cenario/')) {
		mapped['categoria'] = 4;
	} else if (_.includes(uri, '/produtoOperacional/')) {
		mapped['categoria'] = 5;
	} else if (_.includes(uri, '/categoria/')) {
		mapped['categoria'] = 6;
	} else if (_.includes(uri, '/produtoFuncional/')) {
		mapped['categoria'] = 7;
	} else if (_.includes(uri, '/produtoOperacionalInicial/')) {
		mapped['categoria'] = 8;
	} else {
		mapped['categoria'] = 9;
	}
}

/**
 * Função para mapear um objeto de tripla recebido do servidor
 * @param object
 * @returns mapped object
 */
function objectMapping(object) {
	
	var mapped = {};
	
	// verifica se o objeto é um produto funcional
	var nome = (object.obj.label.value) ? object.obj.label.value.$ : object.obj.label.$;	
	if (_.includes(nome, '#Funcional')) {
		mapped['nome'] = nome.replace('#Funcional', '');
		mapped['funcional'] = true;
	} else {
		mapped['nome'] = nome;
		mapped['funcional'] = false;
	}
	
	mapped['uri'] = (object.subj.label) ? object.subj.label.$ : object.subj.label.value.$;
	mapped['lang']  = object.obj.label.lang;
	
	// gera ID único para o objeto
	mapped['id'] = hashCode(mapped.uri);
	
	// mapeia o ID da classe
	mappingCategoria(mapped.uri, mapped);
		
	if (_.includes(mapped.uri, '/dadoBruto')) {
		mapped['classe'] = "bruto";
	} else if (_.includes(mapped.uri, '/dadoInterpretado')) {
		mapped['classe'] = "interpretado";
	} else if (_.includes(mapped.uri, '/produto/')) {
		mapped['classe'] = "produto";
	} else {
		mapped['classe'] = "hierarquia";
	}
	
	// flag 'main' que identifica se é hierarquia ou dado
	if (mapped.categoria < 9) {
		mapped['main'] = true;
	} else {
		mapped['main'] = false;
	}
	
	if (object.sameAs) {
		mapped['sameAs'] = object.sameAs;
	}
	
	// salva o objeto mapeado e retorna o mesmo
	window.dataset[mapped.id] = mapped;	
	return mapped;
};

function providerMapping(provider) {
	var item = {
		"uri": provider[0],
		"nome": provider[1].nome.obj.label.value.$,
		"main": true,
		"data": provider[1].date.obj.label.value.$,
		"url": (provider[1].url != undefined) ? provider[1].url.obj.label.value.$ : undefined,
		"categoria": 5
	};
	return item;
};

function estatisticaNaoExistenteMapping(object) {
	var mapped = {};
	
	mapped['propriedade'] = object.uri;
	mapped['alias'] = window.prefLabelsMapeados[object.nome];
	mapped['valor'] = parseInt(object.valor);
	
	return mapped;
};

function levenshteinDistance(a, b) {
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
  
    var matrix = [];
  
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
  
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
  
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
    	for(j = 1; j <= a.length; j++){
    		if(b.charAt(i-1) == a.charAt(j-1)){
    			matrix[i][j] = matrix[i-1][j-1];
    		} else {
    			matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
    					Math.min(matrix[i][j-1] + 1, // insertion
    							matrix[i-1][j] + 1)); // deletion
    		}
    	}
    }
  
	return matrix[b.length][a.length];
};

function zerarSistema() {
	$("#user-name").text("");
	$("#botao-conceitos").remove();
	$("#botao-provedores").remove();
	$("#botao-check").remove();
	$("#botao-creditos").remove();
	$("#botao-gestores").remove();
	$("#botao-fundamentacao").remove();
	window.idioma = "ptbr";
	window.VIEWER_CARD = 1;
	window.VIEWER_GRAPH = 2;
	window.viewer = window.VIEWER_CARD;
	window.idiomasConceitos = [];
	window.idiomasDominios = [];
	window.countCard = 0;
	window.termosClicados = [];
	window.provedores = {};
	window.disciplinas = {};
	window.dominios = {};
	window.subdominios = {};
	window.conceitos = {};
	window.termos = {};
	window.dataset = {};
	window.provedor = {};
	window.conceitoAtual = "";
	window.disciplinaAtual = undefined;
	window.dominioAtual = undefined;
	window.subdominioAtual = undefined;
	window.grupoAtual = undefined;
	window.offset = 0;
	window.processing = false;
	window.finished = false;
};