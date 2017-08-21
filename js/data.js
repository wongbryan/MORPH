/* Use max # vertices to avoid having to redefine arrays */
const MAX_VERTICES = 200000;
// const MAX_VERTICES = 140523;

const NUM_MODELS = 4;

var TARGET_BUFFERS = {
	Array: [],
	current : 0
};

/*OTHER CONSTANTS*/

var MORPH_SPEED = .0001;
const MIN_MORPH = .05;
const MAX_MORPH = .95;

const COLORS = {
	Black : new THREE.Color(0x110000),
	BlackHighlight : new THREE.Color(0x636363),
	Red : new THREE.Color(0xcc390e),
	DarkRed : new THREE.Color(0x510400),
	White : new THREE.Color(0xf9f2f2)
};

/*PARTICLE SYSTEM*/
var Particulate = window.Particulate;
var particleCount = MAX_VERTICES;
var relaxIterations = 2;

var system = Particulate.ParticleSystem.create(particleCount, relaxIterations);
var dist = Particulate.DistanceConstraint.create(10, [0, 1, 1, 2, 2, 3, 3, 4]);
var pin = Particulate.PointConstraint.create([0, 0, 0], 0);
var gravity = Particulate.DirectionalForce.create([0, -0.05, 0]);

system.addConstraint(dist);
system.addPinConstraint(pin);
system.addForce(gravity);

/*LOAD MODELS*/

var initialGeom; 

var modelLoader = new THREE.JSONLoader();
modelLoader.load(
	'assets/tetsuo-compressed.json',

	function(geometry, materials){
		initialGeom = geometry;
	}
)

function loadModel( path, modelNum){ //give index of which model you're loading
	var targets, vertices, targetAttributeBuffer;

	var modelLoader = new THREE.JSONLoader();
	modelLoader.load(
		path,

		function(geometry, materials){
			//POPULATE DATA
		    targets = new Float32Array(MAX_VERTICES*3);
		    vertices = geometry.vertices;
		    var i, j=0; //j is the flag
		    for (i=0; i<MAX_VERTICES; i++){
		    	var index = i*3;
		    	if(i>=vertices.length){ //point at which we would just have 0s
		    		if (j >= vertices.length) //loop through geometry as many times as needed
		    			j=0;
		    		var target = vertices[j];;
					j++;
		    	}
		    	else{
					var target = vertices[i];
		    	}

		    	targets[index] = target.x;
				targets[index+1] = target.y;
				targets[index+2] = target.z;
			}

			targetAttributeBuffer = new THREE.BufferAttribute(targets, 3);
			TARGET_BUFFERS.Array[modelNum] = targetAttributeBuffer;

			if (modelNum == NUM_MODELS-1){ //if last model loaded

				//INITIALIZE FIRST MESH
				box = new ParticleObject(initialGeom, 0x486686, .05);
				console.log(box);
			    // box.mesh.scale.set(5, 5, 5);
			    box.mesh.rotation.y = 3.5*Math.PI/2;
			    boxMeshesArray.push(box.mesh);
			    scene.add( box.mesh );

			    loadedBox = true;

			    var loading = document.getElementById('loading');
			    toggleVisibility(loading, 0);

			    toggleVisibility(plotPoints[0], 1);
			    // document.body.removeChild(loading);
			}

			return targetAttributeBuffer;
		}
	)
}

//Normal Tetsuo

loadModel('assets/tetsuo-compressed.json', 0);

//Arm Tetsuo

loadModel('assets/tetsuo-baby.json', 1);

//Blob Tetsuo

loadModel('assets/tetsuo-blob.json', 2);

//Baby Tetsuo

loadModel('assets/tetsuo-baby.json', 3);







