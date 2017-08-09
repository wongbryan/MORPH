/* Use max # vertices to avoid having to redefine arrays */
const MAX_VERTICES = 1500000;
const NUM_MODELS = 2;

var TARGET_BUFFERS = {
	Array: [],
	current : 0
};

/*LOAD MODELS*/

var initialGeom; 

//Normal Tetsuo
var tetsuoTarget1;
var tetsuoTargetAttributeBuffer1;

var modelLoader = new THREE.JSONLoader();
modelLoader.load(
	'assets/tetsuo-compressed.json',

	function(geometry, materials){
		//POPULATE DATA
	    tetsuoTarget1 = new Float32Array(MAX_VERTICES*3);
	    var tetsuoVertices = geometry.vertices;
	    for (var i=0; i<tetsuoVertices.length; i++){
			var target = tetsuoVertices[i];
			var index = i*3;

			tetsuoTarget1[index] = target.x;
			tetsuoTarget1[index+1] = target.y;
			tetsuoTarget1[index+2] = target.z;
		}
		tetsuoTargetAttributeBuffer1 = new THREE.BufferAttribute(tetsuoTarget1, 3);

		TARGET_BUFFERS.Array.push(tetsuoTargetAttributeBuffer1);
		initialGeom = geometry;
	}
)

//Arm Tetsuo
var testuoTargets2;
var testuoTargetAttributeBuffer2;

modelLoader.load(
	'assets/tetsuo-transform.json',

	function(geometry, materials){
		tetsuoTarget2 = new Float32Array(MAX_VERTICES*3);
	    var tetsuoVertices2 = geometry.vertices;
	    for (var i=0; i<tetsuoVertices2.length; i++){
			var target = tetsuoVertices2[i];
			var index = i*3;

			tetsuoTarget2[index] = target.x;
			tetsuoTarget2[index+1] = target.y;
			tetsuoTarget2[index+2] = target.z;
		}
		tetsuoTargetAttributeBuffer2 = new THREE.BufferAttribute(tetsuoTarget2, 3);

		TARGET_BUFFERS.Array.push(tetsuoTargetAttributeBuffer2);

		//INITIALIZE FIRST MESH
		box = new ParticleObject(initialGeom, 0x486686, .05);
	    // box.mesh.scale.set(5, 5, 5);
	    box.mesh.rotation.y = 3.5*Math.PI/2;
	    boxMeshesArray.push(box.mesh);
	    scene.add( box.mesh );

	    loadedBox = true;

	    var loading = document.getElementById('loading');
	    document.body.removeChild(loading);
	}
)

/*OTHER CONSTANTS*/

var MORPH_SPEED = .0001;





