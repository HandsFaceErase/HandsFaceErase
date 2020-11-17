$(document).ready( function() {
   $("#HandsLogo").delay(2000).fadeIn();
   $("#FaceLogo").delay(4000).fadeIn();
   $("#EraseLogo").delay(6000).fadeIn();
});

function on() {
  document.getElementById("#overlay").style.display = "block";
}

function off() {
  document.getElementById("#overlay").style.display = "none";
}
