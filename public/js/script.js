// variable initialising
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var socket = io();
var i="off";

//listening to the button
document.getElementById("btn").addEventListener('click', () => {
  //if statement because SpeechRecognition doesn't have a toggle method
  if (i==="on"){
    recognition.stop();
    i="off";
    console.log(i+" stopped");
  } else{
    recognition.start();
    i="on";
    console.log(i+" started");
    }
  //ui changes on btn click
  btn.classList.toggle("on");
  btn.textContent="Listening...";
});

//ui changes when SpeechRecognition stops recorgnising
recognition.addEventListener('audioend', ()=>{
  btn.classList.remove("on");
  btn.classList.add("off");
  btn.textContent="Press to gain my attention";
});
 
//listening to the result of SpeechRecognition
recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    //logging the accuracy
    console.log('Confidence: ' + e.results[0][0].confidence);
    
    //sending the text recorgnised to the aiAPI logic on index.io
    socket.emit('chat message', text);
});

//turn text to speech in browser
function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

//recieve text from the aiAPI and translate that to speech.
socket.on('bot reply', function(replyText) {
    synthVoice(replyText);
});
