var serverElement = require('../ServerElement')
/*
 * Trying inheritance...
 * 
 * */
var AxeAlignedBox = function(controller, elementTemplate) {
	this.initialize(controller, elementTemplate);
};

console.log('aab: ' + serverElement.Element);

AxeAlignedBox.prototype = Object.create(serverElement.Element.prototype);
	
exports.AxeAlignedBox = AxeAlignedBox; 