/* Use max # vertices to avoid having to redefine arrays */
const MAX_VERTICES = 173130;
// const MAX_VERTICES = 140523;

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
	    var i, j=0;
	    for (i=0; i<tetsuoVertices.length; i++){
	    	var index = i*3;
    		var target = tetsuoVertices[i];
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
	    var i, j=0; //j is the flag
	    for (i=0; i<MAX_VERTICES; i++){
	    	var index = i*3;
	    	if(i>=tetsuoVertices2.length){ //point at which we would just have 0s
	    		var target = tetsuoVertices2[j];;
				j++;
	    	}
	    	else{
				var target = tetsuoVertices2[i];
	    	}
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

var MORPH_SPEED = .0005;

const COLORS = {
	Black : new THREE.Color(0x110000),
	BlackHighlight : new THREE.Color(0x636363),
	Red : new THREE.Color(0xcc390e),
	DarkRed : new THREE.Color(0x510400),
	White : new THREE.Color(0xf9f2f2)
};





