var hidebonusQns = function() {

	bonusBox.setAttribute("style", "display: none");
	factBox.setAttribute("style", "display: visible");
}

var hideFactQns = function() {

	bonusBox.setAttribute("style", "display: visible");
	factBox.setAttribute("style", "display: none");
}

// updates Earth's mood -------------------------------------
var earthMood = function() {

	if (affected === 1175) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Crushed</span>';
	} else if (affected >= 950) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Devastated</span>';
	} else if (affected >= 800) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Upset</span>';
	} else if (affected >= 550) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Distressed</span>';
	} else if (affected >= 300) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Pessimistic</span>';
	} else if (affected >= 100) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Anxious</span>';
	} else if (affected >= 0) {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">Hopeful</span>';
	} else {
		earthStats.innerHTML = 'Earth\'s Mood :<br><span id="earthMood">WTF</span>';
	}

}

// what happens when click right answer -----------------------------------------
var win = function(answer) {

	console.log('right')

	if (affected === 0) {
		affectedCount.innerHTML = 'Affected Area :<br>' + '<span id="affectedCount">' + affected + ' / 1175 </span>';
		generateQnsLoop();
		return answer
	}

	// generate random count for affected
	var randomAffected = Math.floor((Math.random() * 50) + 10);		// range: 10 to 60
	affected -= randomAffected;

	if (affected > 0) {
		c.clearRect(0, 0, 800, 430);
		generateNewMap();
		affectedCount.innerHTML = 'Affected Area :<br>' + '<span id="affectedCount">' + affected + ' / 1175 </span>';
		generateQnsLoop();
	} else if (affected < 0) {
		affected = 0;
		c.clearRect(0, 0, 800, 430);
		generateNewMap();
		affectedCount.innerHTML = 'Affected Area :<br>' + '<span id="affectedCount">' + affected + ' / 1175 </span>';
		generateQnsLoop();
	}
}

var bonusy;
// what happens when click wrong answer ----------------------------------
var lose = function(answer) {

	// generate random count for affected
	var randomAffected = Math.floor((Math.random() * 100) + 50)		// range: 50 to 150
	affected += randomAffected;

	// if there is a form, remove the eventListener to trigger stuff when you press enter
	if (document.querySelector('#form')) {
		document.querySelector('#form').removeEventListener('keyup', bonusy);
	}

	// shows popup with correct answer
	// upon click popup it will close by default
	// then it will generate new question
	// but if affected = 1175, then it add eventlistener, so that when click again, it will show endgame popup
	showPopup(answer);
	console.log('The correct answer is ' + answer);

	// default; continues the qns
	if (affected < 1175) {
		c.clearRect(0, 0, 800, 430);
		generateNewMap();
		affectedCount.innerHTML = 'Affected Area :<br>' + '<span id="affectedCount">' + affected + ' / 1175 </span>';


	// when lose liao, ends the qns
	// sets gameover when lose
	} else if (affected >= 1175) {
		
		// updates affected score and map
		affected = 1175;
		c.clearRect(0, 0, 800, 430);
		generateNewMap();
		earthMood();
		affectedCount.innerHTML = 'Affected Area :<br>' + '<span id="affectedCount">' + affected + ' / 1175 </span>';
	}
}

// check if the answer is right or wrong ----------------------------------
var checkIfCorrect = function(event){

	// check if selected box textContent is the same as answer
	if (this.textContent === selectedQnObj.answer) {    				
		win();


	// if the selected box textContent is NOT the same as answer
	} else {
		lose(selectedQnObj.answer);
	}
}

// generate a factual question -------------------------------------------
var factQn = function(e) {

	// set style for Factual Questions first
	hidebonusQns();
	choice4Box.setAttribute("style", "display: inline-block");

	// ---------- real thing starts here ---
	if (questions.length !== 0) {
		// picks a random number
		pickQnRandomIndex = Math.floor(Math.random() * questions.length); // length is 8 means the max number that can random until is 7. The max index for an array is 7 when length is 8

		// picks a random question
		selectedQnObj = questions[pickQnRandomIndex];

		// remove question from array of questions
		questions.splice(pickQnRandomIndex, 1);

		factQns.textContent = selectedQnObj.question;
		choice1Box.textContent = selectedQnObj.choices[0];
		choice2Box.textContent = selectedQnObj.choices[1];
		choice3Box.textContent = selectedQnObj.choices[2];
		choice4Box.textContent = selectedQnObj.choices[3];

	// no more questions!!
	} else if (questions.length === 0) {
		generateNewMap();
	}

	// if choice4Box is empty
	if (choice4Box.textContent === "") {
		choice4Box.setAttribute("style", "display: none");
	}

	// add the eventlistener to the choices
	for (var i = 0; i < allChoices.length; i++) {
		allChoices[i].addEventListener('click', checkIfCorrect)
	}
}

// generate a bonus question ---------------------------------
var bonusQuestionsClone = bonusQuestions;
var bonusQn = function() {

	// so that eventlistener does not stack when click
	popup.removeEventListener('click', afterClickPopup);

	// set style for bonus qn
	hideFactQns();

	// duplicate bonusQuestions array
	// empty bonusQuestionsClone arr
	// when empty bonusQuestionsClone then it will equals bonusQuestions

	// bonusQuestionsClone[3]();	// !! FOR TEST RUN !!

	if (bonusQuestionsClone.length !== 0) {
		// picks a random number
		pickbonusQnRandomIndex = Math.floor(Math.random() * bonusQuestionsClone.length); // length is 8 means the max number that can random until is 7. The max index for an array is 7 when length is 8

		// execute function
		bonusQuestionsClone[pickbonusQnRandomIndex]();

		// remove question from array of questions
		bonusQuestionsClone.splice(pickbonusQnRandomIndex, 1);


	} else if (bonusQuestions.length === 0) {
		bonusQuestionsClone = bonusQuestions;
	};

};

// create a new input form so that the value does not stack! For bonus questions -----------------------
var inputForm;
var inputClone;

var createNewInput = function() {

	inputForm = document.querySelector('#form');
	inputClone = inputForm.cloneNode(true);
	document.querySelector('.input-form').removeChild(inputForm);
	document.querySelector('.input-form').appendChild(inputClone);

}





