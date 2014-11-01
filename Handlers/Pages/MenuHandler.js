// generell redirect stuff ?

var responseHandler = require("../../ServerCore/ResponseHandler");

var handle = function (request,response) {
	responseHandler.sendFile(
		response,
		'./resources/html/menu.html',
		'text/html');
};	

exports.handle = handle;
