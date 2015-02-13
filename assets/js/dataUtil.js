'use strict';

var logDate = function() {
	console.log(new Date().getDate());
}

var logMonth = function() {
	console.log(new Date().getMonth() + 1);
}

exports.logDate = logDate;
exports.logMonth = logMonth;