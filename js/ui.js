var UI = document.getElementById('ui');
var scrambleText;

function toggleUI(on){
	var text = UI.getElementsByTagName('p')[0];
	scrambleText = new ScrambleText(text, {
		timeOffset: 5
	});
	if(on){
		UI.classList.remove('hidden');
		UI.classList.add('show');
		scrambleText.start();
	}
	else{
		UI.classList.remove('show');
		UI.classList.add('hidden');
	}
}