var range = [
	["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
];

function random(range, n, str, r){
	var ran = Math.floor(Math.random()*range.length);
	var ran2 = Math.floor(Math.random()*range[ran].length);
	if(r!=ran)
		if(str.length<n)
			return random(range, n, str+range[ran][ran2], r);
		else
			return str;
	else
		return random(range, n, str, r);
}

module.exports = function(n){
	return random(range, n, '', -1)
}