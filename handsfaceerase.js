//Declare Global variables
var normalCamera, normalScene, controls, normalRenderer, geometry, material, texture;
var normalRaycaster = new THREE.Raycaster();
var arToolkitContext;
var arToolkitSource;
var initfly;
var covid = 25;
var covidStart = 25;
var activeCovid = 25;
var covid19 = new THREE.Group();
var ARcovid19 = new THREE.Group();
var cameraPosition = new THREE.Vector2();
var erase = false;
var reset = false;
var covidIntialised = false;
var covidAttack = false;
var health = 500;
var healthStart = 500;
var gameOver = false;
var faceActive = false;
var covidAttackAudioElement = document.createElement('audio');
var borisAudioElement = document.createElement('audio');
cameraPosition.x = 0;
cameraPosition.y = 0;
cameraPosition.z = 0;

//Initialise
function init(){
//Initialise AR base scene and rendering preferences

      // Set-up AR.js scene
      var video =  arToolkitSource;

      // Create a scene for the AR content (only displayed when marker is found)
      scene = new THREE.Scene();

      // Create a scene for content which is always displayed
      normalScene = new THREE.Scene();

      // Create a camera for each scene
      normalCamera = new THREE.PerspectiveCamera();
      normalCamera.position.set(0,0,0);
      normalScene.add(normalCamera);

      //Enable orientation controls so user can look around the scene (also updated at render)
      controls = new THREE.DeviceOrientationControls( normalCamera );
      controls.update();

      // Create a WebGL renderer and add prefernces
      normalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      // Set the size of the renderers to the inner width and inner height of the window
      normalRenderer.setSize( window.innerWidth, window.innerHeight );

      // Add in the created DOM elements to the body of the document
      document.body.appendChild( normalRenderer.domElement );

      // Set source type to webcam for AR content
      arToolkitSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
      })

// Event Listeners and on action calls

      // Resize conent when camera is ready
      arToolkitSource.init(function onReady(){
        onResize()
      })

      // Listen for resize
      window.addEventListener('resize', function(){
        onResize()
      })

      // Listen for Erase button to be pressed and sent global var 'Erase' to true (used at render raycast)
      $('#erase').click(function() {
        erase = true;
        event.stopImmediatePropagation();
      });

      // Listen for face button pressed to display mask
      $('#face').click(function() {

          if(faceActive == false) {
            document.getElementById("maskOverlay").style.display = "flex";
            faceActive = true;
          } else {
            document.getElementById("maskOverlay").style.display = "none";
            faceActive = false;
          }

      });

      // Listen for start of play
      $('#playInfoModal').on('hidden.bs.modal', function () {
        covidAttack = false;
        erase = true;
      });

      // Listen for Play Again
      $('#gameOver').on('hidden.bs.modal', function () {
        resetGame()
      });

// Set-up sounds to play

    // Set-up covid attack sound
    covidAttackAudioElement.setAttribute('src', 'Assets/Covid Attack.mp3');
    covidAttackAudioElement.loop = true;

    // Set-up Boris' Speech sound
    borisAudioElement.setAttribute('src', 'Assets/Boris.mp3');

// AR initialisation

      function onResize(){
        arToolkitSource.onResizeElement()
        arToolkitSource.copyElementSizeTo( normalRenderer.domElement)
        if( arToolkitContext.arController !== null ){
          arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
        }
      }

      // Create atToolkitContext
      arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono',
      })

      // Initialize AR scene
      arToolkitContext.init(function onCompleted(){
        // Copy projection matrix to camera
        normalCamera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
      })

      //Set scene to invivible (set back to visbile in render when marker detected)
      scene.visible = false;

// Create covid object and setup scene lighting

      //Lighting
            // Add a directional light
            var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
            directionalLight.position.set(1,0.5,1);
            normalScene.add( directionalLight );

            // Add weak ambient light
            var ambientlight = new THREE.AmbientLight( 0x404040, 0.5);
            normalScene.add( ambientlight );

            // Add ambient ligh to scene
          	var light = new THREE.AmbientLight( 0x404040, 3);;
          	light.position.set(0,10,0);
          	normalScene.add(light);

      //Covid Instance
            var objcovid;
            var objcovidGroup = new THREE.Object3D();
            // normalScene.add(objcovidGroup);
            var materialLoader = new THREE.MTLLoader();
            materialLoader.load('Assets/covid/covid19.mtl', function (material) {
                var objLoader = new THREE.OBJLoader()
                objLoader.setMaterials(material)
                objLoader.load(
                  'Assets/covid/covid19.obj',
                  function (objcovid) {
                    objcovid.scale.set(10,10,10);
                    objcovid.rotation.y = -1.2;
                    objcovid.rotation.x = -1.0;
                    objcovid.rotation.z = 0;
                    // objcovid.position.set(0,0,0);
                    objcovid.shadow;
                    objcovidGroup.add(objcovid);
                  }
                )
              })

            //Store the covid instance in a variable
            initfly=objcovidGroup;

            // Addding variable covid19 to normal scene ready for content to be added
          	normalScene.add( covid19 );

}

//////////////////////////////////////////////////////////////////////////////////
//		Function to create initial covid19 (called in 'init')
//////////////////////////////////////////////////////////////////////////////////
function covid19Start(){

//For-Loop to create and inititalise the number of covid19 in global var 'covid'
      if (covidIntialised == false) {
        for (var i=covid;i--;){
          console.log(i);
          var Div = initfly.clone();
          // For each set random start location in scene
          Div.position.x = random(-7,7);
          Div.position.y = random(-7,7);
          Div.position.z = random(-7,7);

          // Call to function which adds motion
          Anim(Div);

          // Adds covid19 to scene via the already added group 'covid19'
          covid19.children.push(Div);

          covidIntialised = true;

      }; }

// Function to animated the covid created above to move using Tween.js
      function Anim(elm){

        // Set position and target variables
        var position = elm.position;

        var covidAttackChance = ~~random(0, 100);

        if (covidAttackChance == 1 && elm.visible == true && gameOver == false) {

          var target = {x:0,y:0,z:0};

          console.log("Attack!");
          covidAttack = true;
          document.getElementById("covidAttack").style.display = "block";


        } else {

          var target = {x:random(-7,7),y:random(-7,7),z:random(-7,7)};

        }

        // Perform tween which moves from current position to random position
        tween = new TWEEN.Tween(position).to(target, random(4000,8000)).start();

        // On each tween frame the position of each covid is updated
        tween.onUpdate(function() {
          elm.position.x = position.x;
          elm.position.y = position.y;
          elm.position.z = position.z;
        });

        // Once the tween has completed all this function again (created a loop)
        tween.onComplete( function() {
          Anim(elm);
        })

      };
}

//Function to create explosion at x,y & of interesected object

//Global variables for ExplodeAnimation
var movementSpeed = 10;
var totalObjects = 400;
var objectSize = 1;
var sizeRandomness = 5;
var dirs = [];
var parts = [];

function ExplodeAnimation(x,y,z,inputScene){

  var geometry = new THREE.Geometry();

  for (i = 0; i < totalObjects; i ++)
  {

      // console.log(i, x, y, z, inputScene);
    // Generate particlesto the number of totalObjects
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new  THREE.PointsMaterial( { size: objectSize,  color: 0xffd24d});
  var particles = new THREE.Points( geometry, material );

  this.object = particles;
  this.status = true;

  // Create knew direction based on movementSpeed and Math.random
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);

  inputScene.add( particles  );

  // Update particles
  this.update = function(){
    if (this.status == true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
}


//Function to reset game

function resetGame(){

  // Set covidAttack to false incase under attack
  covidAttack = false;

  // Set gameOver to false now that game has restarted
  gameOver = false;

  // Set health back to intial value
  health = healthStart;
  $('.healthBarValue').css('width', health/5 + '%' )
  console.log("Health: " + health);

  // Set activeCovid to inital value
  activeCovid = covidStart

  // Set all covid back to visible
  covid19.children.visible = true;

  // Stop covid attack sound
  covidAttackAudioElement.pause();
  $("#status").text("Status: Stopped");

  // Stop Boris' Speech
  borisAudioElement.pause();
  $("#status").text("Status: Stopped");

  // Hide Game Over overlay
  document.getElementById("covidAttack").style.display = "none";

  console.log("Game Reset");

}

//Function to create random number between two povided points
function random(min,max){

    return Math.random()*(max-min+1)+min;

}

//Render (repeated loop)
var render = function () {

  requestAnimationFrame( render );

  // Update the TWEEN for animations in the application
  TWEEN.update();

  // Update matrix of both scenes
  normalScene.updateMatrixWorld();

  // Raycaster used for shooting covid19
  normalRaycaster.setFromCamera( cameraPosition, normalCamera);

  // Set what raycaster can detect
	var normalIntersects = normalRaycaster.intersectObjects( normalScene.children, true);

  // update pCounbt for TWEEN movement
  var pCount = parts.length;
          while(pCount--) {
            parts[pCount].update();
          }

  // If 'erase' is clicked and raycast is intersecting with fly
 	if (erase == true && normalIntersects[0] != undefined){

    // Set the fly to invisible
    normalIntersects[0].object.parent.visible = false;

    // New explosion aninimation at coordinates of intersected object
    parts.push(new ExplodeAnimation(normalIntersects[0].point.x, normalIntersects[0].point.y,normalIntersects[0].point.z,normalScene));

    // Remove covid from scene
    activeCovid--;

  } else if (erase == true && normalIntersects[0] == undefined) {

    // Launch scene
    covid19Start();

  }

  // Set var erase back to false
  erase = false;

  //While under attack decrease health slowly
  if (covidAttack == true && health > 0) {
    health--;
    $('.healthBarValue').css('width', health/5 + '%' )
    console.log("Health: " + health);
    covidAttackAudioElement.play();
     $("#status").text("Status: Playing");
  }

  // When hands button is pressed, stop health degration and clear overlay
  document.getElementById("hands").addEventListener("click", function(event){

    // Log that hands are being washed
    console.log("Washing Hands");

    // Set attack variable back to false
    covidAttack = false;

    // Hide Game Over overlay
    document.getElementById("covidAttack").style.display = "none";

    // Stop covid attack sound
    covidAttackAudioElement.pause();
    $("#status").text("Status: Stopped");

  });

  // Update 'covid19 Left' to reflect number of covid19 in scene
  document.getElementById("covidLeft").innerHTML = "Covid: " + activeCovid;

  // Game over actions
   if (activeCovid == 0 && gameOver == false || health == 0 && gameOver == false) {

     // Log end of game
     console.log("Game Over!");

     // Display Game Over overlay
     $("#gameOver").modal({backdrop: true});

     // Play Boris' Speech
     borisAudioElement.play();
     $("#status").text("Status: Playing");

     // Stop covid attack sound
     covidAttackAudioElement.pause();
     $("#status").text("Status: Stopped");

     // Set gameOver to true now that game is over
     gameOver = true;

   }

   // When reset button is pressed put scene back to init
   document.getElementById("reset").addEventListener("click", function(event){

     resetGame();

   });

  // Update controls for device orientation
  controls.update();

  // Render the both scenes
  normalRenderer.render( normalScene, normalCamera );

}

// Call Initalise function
init();

// Call Render function
render();
