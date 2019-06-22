const testWrapper = document.querySelector(".text-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const timerDisplay = document.querySelector(".timer");

var timer = 0;
var wordList = [];
var wordsToType = [];
var interval = null;
var timerRunning = false;
var frontText = "";
var firstLineList = "";

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
  let _originText = document.querySelector("#origin-text p");
  //console.log(textEntered, wordsToType[0]);
  if (e.keyCode == 32 || e.keyCode == 13){
    if (testArea.value == " "){
      testArea.value = "";
    }else{
      testArea.value = "";
      firstLineList += wordsToType[0] + 1;
      if(textEntered.trim() == wordsToType[0]){
        frontText += '<span class="correct">'+wordsToType.shift() + " "+'</span>';
        //console.log("yayers");
      } else {
        frontText += '<span class="incorrect">'+wordsToType.shift() + " "+'</span>';
        //console.log("popop");
      }
      //console.log(wordsToType)
      console.log(firstLineList.length)
      if (firstLineList.length + wordsToType[0].length>= 48){
        console.log("LMAO");
      }
      _originText.innerHTML = frontText;
      setOriginText(wordsToType);
    }
  }

}

function reset(){
  console.log("reset");
  clearInterval(interval);
  interval = null;
  timerRunning = false;
  timer = 0;
  frontText = "";
  wordList = [];
  wordsToType = [];
  document.querySelector("#origin-text p").innerHTML = "";

  testArea.value = "";
  timerDisplay.innerHTML = "00";

  setWords();
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
  while (stringCheck.length + list[i].length + i<= 89){
    stringCheck += list[i];
    returnList.push(list[i]);
    wordsToType.push(list[i]);
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
    wordList = myJson.slice();
    wordList = shuffle(wordList);
    setOriginText(getRandomLine(wordList));
  });
}

function setOriginText(list){
  var s = "";
  for (var w in list){
    if (w == 0){
      document.querySelector("#origin-text p").innerHTML += '<span class="current">'+list[w] + " "+'</span>';
    }
    else {
      s += " " + list[w] + " ";
    }
  }
  document.querySelector("#origin-text p").innerHTML += '<span class="default">'+s+'</span>';
}

function init(){
  setWords();
  testArea.value = "";
  testArea.addEventListener("keypress", startTimer, false);
  testArea.addEventListener("keyup", spellCheck, false);
  resetButton.addEventListener("click", reset, false);
}
window.onload = init;
