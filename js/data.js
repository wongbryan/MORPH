var GEOMETRIES = {
	Array : [],
	current : 0
};

var gunGeom;
var modelLoader = new THREE.JSONLoader();
modelLoader.load(
	'assets/gun.json',

	function(geometry, materials){
		gunGeom = geometry;
		GEOMETRIES.Array.push(gunGeom);
	}
);

var sphereGeom = new THREE.SphereGeometry(2.5, 128, 128);
var SPHERE_VERTICES = sphereGeom.vertices;
GEOMETRIES.Array.push(sphereGeom);

var boxGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5, 256, 256);
GEOMETRIES.Array.push(boxGeom);