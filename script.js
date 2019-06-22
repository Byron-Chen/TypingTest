const testWrapper = document.querySelector(".text-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const timerDisplay = document.querySelector(".timer");
const wpmDisplay = document.querySelector(".wpm");
const accDisplay = document.querySelector(".acc");

var timer = 0;
var wordList = [];
var wordsToType = [];
var interval = null;
var timerRunning = false;
var frontText = "";
var firstLineList = "";

//words per minute calculations
var typedWords = ""
var incorrectWord = ""
var accuracy = 0;
var wpm = 0;

function runTimer(){
  timerDisplay.innerHTML = (6000 - timer)/100;
  timer++;
  if (timer >= 6000){
    timerRunning = false;
    clearInterval(interval);
    interval = null;
  }
  console.log(typedWords.length, incorrectWord.length)
  wpmDisplay.innerHTML = "WPM: " + Math.floor((((typedWords.length/5) - 5)/ (timer/6000)));
  c = typedWords.split(" ").length - 1;
  i = incorrectWord.split(" ").length - 1;
  t = c + i
  accDisplay.innerHTML = "ACC: " + Math.floor((c / t) * 100) + "%";
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
        typedWords += wordsToType[0] + " ";
        frontText += '<span class="correct">'+wordsToType.shift() + " "+'</span>';     
      } else {
        incorrectWord += wordsToType[0] + " ";
        frontText += '<span class="incorrect">'+wordsToType.shift() + " "+'</span>';
      }
      if (firstLineList.length + wordsToType[0].length>= 48){
        wordsToType.concat(getRandomLine(wordList, 47));
        firstLineList = "";
        frontText = "";
      }
      _originText.innerHTML = frontText;
      setOriginText(wordsToType);
    }
  }

}

function reset(){
  clearInterval(interval);
  interval = null;
  timerRunning = false;
  timer = 0;
  frontText = "";
  wordList = [];
  wordsToType = [];
  document.querySelector("#origin-text p").innerHTML = "";

  testArea.value = "";
  timerDisplay.innerHTML = "1:00";

  typedWords = ""
  ncorrectWord = ""
  accuracy = 0;
  wpm = 0;

  wpmDisplay.innerHTML = "WPM: 0"
  accDisplay.innerHTML = "ACC: 0%"

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

function getRandomLine(list, words){
  returnList = [];
  stringCheck = "";
  i = 0;
  while (stringCheck.length + list[0].length + i <= words){
    stringCheck += list[0];
    returnList.push(list[0]);
    wordsToType.push(list[0]);
    list.shift();
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
    setOriginText(getRandomLine(wordList, 92));
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
