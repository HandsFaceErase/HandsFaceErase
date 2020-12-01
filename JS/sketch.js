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

$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'Assets/Boris.mp3');

    // audioElement.addEventListener('ended', function() {
    //     this.play();
    // }, false);

  //   $('#pause').click(function() {
  //     audioElement.pause();
  //     $("#status").text("Status: Paused");
  // });

    $('#boris').click(function() {
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
