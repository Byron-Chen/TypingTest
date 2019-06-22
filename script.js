const testWrapper = document.querySelector(".text-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const timerDisplay = document.querySelector(".timer");

var timer = 0;
var wordList = [];
var interval = null;
var timerRunning = false;

function runTimer(){
  timerDisplay.innerHTML = timer;
  timer++;
}

function startTimer(){
  let textEnteredLength = testArea.value.length;
  if(textEnteredLength === 0 && !timerRunning){
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

function spellCheck(e){
  let textEntered = testArea.value;
  let _originText = document.querySelector("#origin-text p").innerHTML;
  let originTextMatch = _originText.substring(0, textEntered.length);
  let realTextEntered = "";
  console.log(textEntered, originTextMatch);

  if (e.keyCode == 32){
    if (testArea.value == " "){
      testArea.value = "";
    }
  }

  //if(textEntered == _originText){
  //  console.log("yay");
  //} else {
  if(textEntered == originTextMatch){

    console.log("yayers");
  } else {
    console.log("popop");
  }
}

function reset(){
  console.log("reset");
  clearInterval(interval);
  interval = null;
  timerRunning = false;
  timer = 0;

  testArea.value = "";
  timerDisplay.innerHTML = "00";
}

function shuffle(list){
  var m = list.length, t, i;
  while (m !== 0){
    i = Math.floor(Math.random() * m);
    m -= 1;
    t = list[m];
    list[m] = list[i]
    list[i] = t;
  }
  return list;
}

function getRandomLine(list){
  returnList = [];
  stringCheck = "";
  i = 0;
  while (stringCheck.length + list[i].length + i<= 46){
    stringCheck += list[i];
    returnList.push(list[i]);
    i++;
  }
  return returnList;
}

function setWords(){
  fetch("words.json")
  .then(function(response){
    return response.json();
  })
  .then(function(myJson){
    wordList = myJson.slice()
    wordList = shuffle(wordList);
    setOriginText(getRandomLine(wordList));
  });
}

function setOriginText(list){
  var s = "";
  for (var w in list){
    s += list[w] + " ";
  }
  document.querySelector("#origin-text p").innerHTML += s;
}

function init(){
  setWords();
  testArea.value = "";
  testArea.addEventListener("keypress", startTimer, false);
  testArea.addEventListener("keyup", spellCheck, false);
  resetButton.addEventListener("click", reset, false);
}
window.onload = init;
