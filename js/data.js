/* Use max # vertices to avoid having to redefine arrays */
const MAX_VERTICES = 2000000;

var GEOMETRIES = {
	Array : [],
	current : 0
};

var sphereGeom = new THREE.SphereGeometry(2.5, 256, 256);
var SPHERE_VERTICES = sphereGeom.vertices;
GEOMETRIES.Array.push(sphereGeom);

var boxGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5, 256, 256);
var BOX_VERTICES = boxGeom.vertices;
GEOMETRIES.Array.push(boxGeom);

var TARGETS = {
	Array: [],
	current : 0
};

var TARGET_BUFFERS = {
	Array : [],
	current: 0
};

var sphereTargets = new Float32Array(MAX_VERTICES*3);
for (var i=0; i<sphereGeom.vertices.length; i++){
	var target = SPHERE_VERTICES[i];
	var index = i*3;

	sphereTargets[index] = target.x;
	sphereTargets[index+1] = target.y;
	sphereTargets[index+2] = target.z;
}
var sphereTargetBuffer = new THREE.BufferAttribute(sphereTargets, 3);
TARGETS.Array.push(sphereTargets);
TARGET_BUFFERS.Array.push(sphereTargetBuffer);

var boxTargets = new Float32Array(MAX_VERTICES*3);
for (var i=0; i<boxGeom.vertices.length; i++){
	var target = BOX_VERTICES[i];
	var index = i*3;

	boxTargets[index] = target.x;
	boxTargets[index+1] = target.y;
	boxTargets[index+2] = target.z;
}
var boxTargetBuffer = new THREE.BufferAttribute(boxTargets, 3);
TARGET_BUFFERS.Array.push(boxTargetBuffer);
TARGETS.Array.push(boxTargets);

var tetsuoTargets;
var tetsuoTargetBuffer;


