$(document).ready(function() {
   $('#HandsLogo').delay(2000).fadeIn();
   $('#FaceLogo').delay(4000).fadeIn();
   $('#EraseLogo').delay(6000).fadeIn();
});

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

// Create function to display buttons

function showButton(buttonKey) {
  buttonToShow.style.display = "block";
}
// Create event listeners

let playButton = document.getElementById("playButton");

playButton.addEventListener("click", start);
