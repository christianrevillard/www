var Vector = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;	
};

var Basis = function(v1, v2, v3) {
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3 || new Vector(0, 0, 1);		
};

Vector.scalarProduct = function(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z || 0 * v2.z || 0;
};

Vector.vectorProduct = function(v1,v2) {
	return new Vector(
			v1.y * v2.z - v1.z * v2.y,				
			v1.z * v2.x - v1.x * v2.z,	
			v1.x * v2.y - v1.y * v2.x);
};	

Vector.sum = function(v1,v2) {
	return new Vector(
			v1.x + v2.x,				
			v1.y + v2.y,				
			v1.z + v2.z);
};	

Vector.getBasisFromFirstVector = function(v1) {
	return new Basis(
		v1,
		new Vector(-v1.y, v1.x, 0),
		new Vector(0,0,1));
};

Vector.prototype.getCoordinates = function(base) {
	return {
		x: Vector.scalarProduct(this,base.v1),
		y: Vector.scalarProduct(this,base.v2),
		z: Vector.scalarProduct(this,base.v3)
	};
};

exports.Vector = Vector;
