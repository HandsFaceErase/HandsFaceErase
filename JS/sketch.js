$(document).ready( function() {

//Fade-in logo parts
   $("#HandsLogo").delay(2000).fadeIn();
   $("#FaceLogo").delay(4000).fadeIn();
   $("#EraseLogo").delay(6000).fadeIn();
   $("#PlayNow").delay(6000).fadeIn();

//Information modal
   $("#information").click(function(){
     $("#infoModal").modal({backdrop: true});
   });

//Leaderboard modal and sound
   $("#leaderboard").click(function(){
     $("#leaderModal").modal({backdrop: true});

     var borisAudioElement = document.createElement('audio');
     borisAudioElement.setAttribute('src', 'Assets/Boris.mp3');

     $('#boris').click(function() {
         borisAudioElement.play();
         $("#status").text("Status: Playing");
     });
   });

$("#playInfoModal").modal({backdrop: true});

//Hands sound
   var handsAudioElement = document.createElement('audio');
   handsAudioElement.setAttribute('src', 'Assets/hands.mp3');

   $('#hands').click(function() {
      handsAudioElement.play();
       $("#status").text("Status: Playing");
   });

//Face sound
   var faceAudioElement = document.createElement('audio');
   faceAudioElement.setAttribute('src', 'Assets/face.mp3');

   $('#face').click(function() {
      faceAudioElement.play();
       $("#status").text("Status: Playing");
   });

//Erase sound
   var eraseAudioElement = document.createElement('audio');
   eraseAudioElement.setAttribute('src', 'Assets/erase.mp3');

   $('#erase').click(function() {
       eraseAudioElement.play();
       $("#status").text("Status: Playing");
   });

});

//Background music not applied as we decided it wasn't needed but can be done
// $(document).ready(function() {
//     var audioElement = document.createElement('audio');
//     audioElement.setAttribute('src', 'Assets/Background.mp3');
//
//     audioElement.addEventListener('ended', function() {
//         this.play();
//     }, false);
//
//     // audioElement.addEventListener("canplay",function(){
//     //     $("#length").text("Duration:" + audioElement.duration + " seconds");
//     //     $("#source").text("Source:" + audioElement.src);
//     //     $("#status").text("Status: Ready to play").css("color","green");
//     // });
//     //
//     // audioElement.addEventListener("timeupdate",function(){
//     //     $("#currentTime").text("Current second:" + audioElement.currentTime);
//     // });
//
//     $('#background').click(function() {
//         audioElement.play();
//         $("#status").text("Status: Playing");
//     });
//
//     $('#pause').click(function() {
//         audioElement.pause();
//         $("#status").text("Status: Paused");
//     });
//
//     // $('#restart').click(function() {
//     //     audioElement.currentTime = 0;
//     // });
// });
