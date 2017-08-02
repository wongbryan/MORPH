var camera, scene, renderer, controls, gui;
var mouse = {x: 0, y: 0};

var startTime = new Date().getTime();
var buffer = 100;
var time;
var nextUpdate = buffer;

var parameters;

function resize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function updateGUI(){
	shaderMat.uniforms['fSpeed'].value = parameters['speed'];
	shaderMat.uniforms['fOpacity'].value = parameters['opacity'];
	shaderMat.uniforms['amtRed'].value = parameters['red'];
	shaderMat.uniforms['amtGreen'].value = parameters['green'];
	shaderMat.uniforms['amtBlue'].value = parameters['blue'];
}

function changeToSphere(){
	shaderPlane.geometry = new THREE.SphereBufferGeometry(1, 256, 256);
}

function changeToBox(){
	shaderPlane.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 256, 256);
}

function changeToCircle(){
	shaderPlane.geometry = new THREE.CircleBufferGeometry(1, 256, 256);
}

function changeToCone(){
	shaderPlane.geometry = new THREE.ConeBufferGeometry(1, .001, 256, 256);
}

function changeToPlane(){
	shaderPlane.geometry = new THREE.PlaneBufferGeometry(1, 256, 256);
}

function changeToTorus(){
	shaderPlane.geometry = new THREE.TorusBufferGeometry(1, .5, 256, 256);
}

function changeToKnot(){
	shaderPlane.geometry = new THREE.TorusKnotBufferGeometry(1, .5, 256, 256);
}

function changeToRing(){
	shaderPlane.geometry = new THREE.RingBufferGeometry(.5, 1, 256, 256);
}

function init() {
		var container = document.getElementById( 'container' );
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCSoftShadowMap;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight);
		container.appendChild( renderer.domElement );
		
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(4, 8, 10);
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.rotateSpeed = 2.0;
		controls.panSpeed = 0.8;
		controls.zoomSpeed = 1.5;

		gui = new dat.GUI({
			height: 6 * 32 - 1
		});

		parameters = {
			speed: 50.0,
			opacity: 0.05,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			sphere: changeToSphere,
			cube: changeToBox,
			circle: changeToCircle,
			plane: changeToPlane,
			cone: changeToCone,
			torus: changeToTorus,
			knot: changeToKnot,
			ring: changeToRing
		};

		var properties = gui.addFolder('properties');

		properties.add(parameters, 'speed').min(0.0).max(1000.0).step(1.0);
		properties.add(parameters, 'opacity').min(0.0).max(1.0).step(0.01);
		properties.add(parameters, 'red').min(0.0).max(1.0).step(0.01);
		properties.add(parameters, 'green').min(0.0).max(1.0).step(0.01);
		properties.add(parameters, 'blue').min(0.0).max(1.0).step(0.01);

		var shape = gui.addFolder('shape');
		shape.add(parameters, 'sphere');
		shape.add(parameters, 'cube');
		shape.add(parameters, 'circle');
		shape.add(parameters, 'plane');
		shape.add(parameters, 'cone');
		shape.add(parameters, 'torus');
		shape.add(parameters, 'knot');
		shape.add(parameters, 'ring');

		scene = new THREE.Scene();

		var directionalLight = new THREE.DirectionalLight(0xffffff, .7);
		directionalLight.position.set(1, -1, 0).normalize();
		directionalLight.castShadow = true;
		var ambientLight = new THREE.AmbientLight(0xffffff);
		
		scene.add(ambientLight);
		scene.add(directionalLight);

		var noiseTex = THREE.ImageUtils.loadTexture("/assets/rgb texture.png");
		noiseTex.wrapT = noiseTex.wrapS = THREE.RepeatWrapping;
		var zoomDivider = 12;
		shaderMat = new THREE.ShaderMaterial( {
			transparent: true,
			wireframe: true,
			//shading: THREE.FlatShading,
			wireframe: true,
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"tPerlin": { type: "t", value: noiseTex },
				"fSpeed" : { type: "f", value: 50.0},
				"fOpacity" : {type: "f", value: .05},
				"amtRed" : {type: "f", value: 1.0},
				"amtBlue" : {type: "f", value: 1.0},
				"amtGreen" : {type: "f", value: 1.0}
			},
			depthTest: false,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );
		var shaderGeom = new THREE.BoxBufferGeometry(1, 1, 1, 256, 256);

		shaderPlane = new THREE.Mesh(shaderGeom, shaderMat);
		shaderPlane.scale.set(5, 5, 5);
		scene.add(shaderPlane);

		window.addEventListener('resize', resize);
	}

	function update(){
		camera.lookAt(scene.position);
		updateGUI();
		controls.update();
		
		time = new Date().getTime() - startTime;
		shaderMat.uniforms['uTime'].value = time * .000000250;
		if (time>nextUpdate){ //if we passed update point, set new update point 
			nextUpdate = time + buffer;
		}
		
	}
	function animate(){
		update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}
	init();
	animate();


