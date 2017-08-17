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