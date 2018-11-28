
function spaCard(nome, total, percentual, compacted) {
	var className = compacted ? 'compacted' : ''
	return ''
		+ '<div class="caixa ' + className + '">'
		+	 '<div class="container">'
		//+		 '<div class="total">' + total + '</div>'
		+		 ''
		+		 '<div class="percentual">' + Number(percentual).toFixed(2) + '%</div>'
		+		 ''
		+		 '<div class="bar">'
		+			 '<div class="live" style="width:' + percentual.replace(',','.') + '%"></div>'
		+		 '</div>'
		+		 ''
		+		 '<div class="name">' + nome + '</div>'
		+	 '</div>'
		+ '</div>'
}

/**
 * recebe valor entre 0 e 1 para '50,3%', por exemplo
 */
function spaCardGetPercentual(percentual) {
	return (percentual * 100)
		.toFixed(2)
		.replace(/(\.\w?)(0+)$/, '$1')
		.replace(/\.0+$/, '')
		.replace(/\.$/, '')
		.replace(/\./, ',') + '%'
};