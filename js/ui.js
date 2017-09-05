/*MAIN TITLE*/
var main = document.getElementsByClassName('main')[0];
var sub = main.getElementsByTagName('h2')[0];

/*PLOT POINTS*/
var storyContainer = document.getElementById('storyContainer');
var plotPoints = document.getElementsByClassName('plotPoint');

/*INFO SCREEN*/
var UI = document.getElementById('ui');
var fx;

const phrases = [
  'KANEDA!',
  'A FISH OUT OF WATER DIES, HUH?',
  'Let\'s run away somewhere',
  'Amoebas don\'t make motorcycles and atomic bombs!'
];

let counter = 0
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800)
  })
  counter = (counter + 1) % phrases.length
}

function toggleVisibility(element, on){
	if(on){
		element.classList.remove('hide');
		element.classList.add('show');
		// var scrambleText = document.getElementById('scramble');
		// fx = new TextScramble(scrambleText);
		// next();
	}
	else{
		element.classList.remove('show');
		element.classList.add('hide');
	}
}

/* MOUSE INTERACTION */

var mouse = new THREE.Vector2(0, 0);

function onMouseDown(){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(rockMeshes, true);

	if (!loadedBox)
		return;

	if (intersects.length > 0){
		MORPH_SPEED *= 5;
		var rock = intersects[0].object.parent;
		var point = new THREE.Vector3(rock.position.x, rock.position.y, rock.position.z,);
		var target = point.multiplyScalar(2.);
		var tween = new TWEEN.Tween(camera.position).to(target, 1500);
		tween.easing(TWEEN.Easing.Quintic.InOut);
		tween.onComplete(function(){
			toggleVisibility(UI, 1);
		});
		tween.start();

		// var tween2 = new TWEEN.Tween(cameraTarget).to(point, 1500);
		// tween2.start();
		rock.nodeObject.animate();
	}
}

function onMouseMove(){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}