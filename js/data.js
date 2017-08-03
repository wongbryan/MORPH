const MAX_VERTICES = 200000;

var GEOMETRIES = {
	Array : [],
	current : 0
};

var sphereGeom = new THREE.SphereGeometry(2.5, 128, 128);
var SPHERE_VERTICES = sphereGeom.vertices;
GEOMETRIES.Array.push(sphereGeom);

var boxGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5, 256, 256);
GEOMETRIES.Array.push(boxGeom);