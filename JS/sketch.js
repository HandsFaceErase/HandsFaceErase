$(document).ready( function() {
   $("#HandsLogo").delay(2000).fadeIn();
   $("#FaceLogo").delay(4000).fadeIn();
   $("#EraseLogo").delay(6000).fadeIn();
   $("#PlayNow").delay(6000).fadeIn();
});

$(document).ready(function(){
  $("#information").click(function(){
    $("#infoModal").modal({backdrop: true});
  });
});

$(document).ready(function(){
  $("#leaderboard").click(function(){
    $("#leaderModal").modal({backdrop: true});
  });
});

//Leaderboard sound
$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Assets/Boris.mp3');

    $('#boris').click(function() {
        audioElement.play();
        $("#status").text("Status: Playing");
    });
});

//Background music
$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Assets/Background.mp3');

    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);

    // audioElement.addEventListener("canplay",function(){
    //     $("#length").text("Duration:" + audioElement.duration + " seconds");
    //     $("#source").text("Source:" + audioElement.src);
    //     $("#status").text("Status: Ready to play").css("color","green");
    // });
    //
    // audioElement.addEventListener("timeupdate",function(){
    //     $("#currentTime").text("Current second:" + audioElement.currentTime);
    // });

    $('#background').click(function() {
        audioElement.play();
        $("#status").text("Status: Playing");
    });

    $('#pause').click(function() {
        audioElement.pause();
        $("#status").text("Status: Paused");
    });

    // $('#restart').click(function() {
    //     audioElement.currentTime = 0;
    // });
});

//Hands sound
$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Assets/hands.mp3');

    $('#soundH').click(function() {
        audioElement.play();
        $("#status").text("Status: Playing");
    });
});

//Face sound
$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Assets/face.mp3');

    $('#soundF').click(function() {
        audioElement.play();
        $("#status").text("Status: Playing");
    });
});

//Erase sound
$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Assets/erase.mp3');

    $('#soundE').click(function() {
        audioElement.play();
        $("#status").text("Status: Playing");
    });
});

// Health bar
$( document ).ready(function() {
    console.log( "ready!" );

  var amt = 100;

  function attack(event){
    $('.hit').on('click', function(){
      amt = amt - 10;
      $('.healthBarValue').css('width', amt + '%' )
    });
  }

  attack();

  function fullHealth(event){
    $('.reset').on('click', function(){
      amt = 100;
      $('.healthBarValue').css('width', '100%');
    })
  }

  fullHealth();

});

$( document ).ready(function()  {
	// Load dialog on page load
	$('#basic-modal-content').modal();

	// Load dialog on click
	$('#basic-modal .basic').click(function (e) {
		$('#basic-modal-content').modal();

		return false;
	});
});
