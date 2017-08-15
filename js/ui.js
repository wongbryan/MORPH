/*MAIN TITLE*/
var main = document.getElementsByClassName('main')[0];
var sub = main.getElementsByTagName('h2')[0];

/*INFO SCREEN*/
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

var UI = document.getElementById('ui');

function toggleUI(on){
	if(on){
		UI.classList.remove('hidden');
		UI.classList.add('show');
		// var scrambleText = document.getElementById('scramble');
		// fx = new TextScramble(scrambleText);
		// next();
	}
	else{
		UI.classList.remove('show');
		UI.classList.add('hidden');
	}
}