//////////////////////////////////////////////////////////////////////////////////
//		Declare global variables
//////////////////////////////////////////////////////////////////////////////////
var normalCamera, normalScene, controls, normalRenderer, geometry, material, texture;
var normalRaycaster = new THREE.Raycaster();
var arToolkitContext;
var arToolkitSource;
var initfly;
var covid = 25;
var covidStart = 25;
var activeCovid = 25;
var covidKilled = 0;
var covid19 = new THREE.Group();
var ARcovid19 = new THREE.Group();
var cameraPosition = new THREE.Vector2();
var fire = false;
var reset = false;
var covidIntialised = false;
var covidAttack = false;
var health = 1000;
cameraPosition.x = 0;
cameraPosition.y = 0;
cameraPosition.z = 0;

//////////////////////////////////////////////////////////////////////////////////
//		Initialise
//////////////////////////////////////////////////////////////////////////////////
function init(){



// Initialise AR base scene and rendering preferences

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

      // Listen for Fire button to be pressed and sent global var 'fire' to true (used at render raycast)
      document.getElementById("fire").addEventListener("click", function(){
        fire = true;
        event.stopImmediatePropagation();
      });

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
            var jar;
            var jarGroup = new THREE.Object3D();
            // normalScene.add(jarGroup);
            var materialLoader = new THREE.MTLLoader();
            materialLoader.load('Assets/covid/covid19.mtl', function (material) {
                var objLoader = new THREE.OBJLoader()
                objLoader.setMaterials(material)
                objLoader.load(
                  'Assets/covid/covid19.obj',
                  function (jar) {
                    jar.scale.set(10,10,10);
                    jar.rotation.y = -1.2;
                    jar.rotation.x = -1.0;
                    jar.rotation.z = 0;
                    // jar.position.set(0,0,0);
                    jar.shadow;
                    jarGroup.add(jar);
                  }
                )
              })

            //Store the covid instance in a variable
            initfly=jarGroup;

            // Addding variable covid19 to normal scene ready for content to be added
          	normalScene.add( covid19 );

}

//////////////////////////////////////////////////////////////////////////////////
//		Function to create initial covid19 (called in 'init')
//////////////////////////////////////////////////////////////////////////////////
function fireflyStart(){

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

        if (covidAttackChance == 1) {

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

//////////////////////////////////////////////////////////////////////////////////
//		Function to create explosion at x,y & of interesected object
//////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////
//		Function to create random number between two povided points
//////////////////////////////////////////////////////////////////////////////////
function random(min,max){

    return Math.random()*(max-min+1)+min;

}

//////////////////////////////////////////////////////////////////////////////////
//		Render (repeated loop)
//////////////////////////////////////////////////////////////////////////////////
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

  // If 'Fire' is clicked and raycast is intersecting with fly
 	if (fire == true && normalIntersects[0] != undefined){

    // Set the fly to invisible
    normalIntersects[0].object.parent.visible = false;

    // New explosion aninimation at coordinates of intersected object
    parts.push(new ExplodeAnimation(normalIntersects[0].point.x, normalIntersects[0].point.y,normalIntersects[0].point.z,normalScene));

    activeCovid--;

  } else if (fire == true && normalIntersects[0] == undefined) {
    console.log(covid19)
    // Launch scene
    fireflyStart();
  }

  // Set var fire back to false
  fire = false;

  //While under attack decrease health slowly

if (covidAttack == true & health > 0) {
  health--;
  console.log("Health: " + health);
}

  // Update 'covid19 Left' to reflect number of covid19 in scene
  document.getElementById("covidLeft").innerHTML = "Covid: " + activeCovid;

  // When reset button is pressed put scene back to init
  document.getElementById("reset").addEventListener("click", function(event){

    for (var i = covid19.children.length; i >= covidStart; i--) {
    covid19.remove(covid19.children[i]);
    }

    console.log(covid19)

    activeCovid=covidStart;

    covid19.children.visible = true;

    event.stopPropagation();
  });

  // When hands button is pressed, stop health degration and clear overlay
  document.getElementById("hands").addEventListener("click", function(event){

    console.log("Washing Hands");
    covidAttack = false;
    document.getElementById("covidAttack").style.display = "none";

  });

  //Show game over text when health is 0 or all covid gone
  // Display Game over screen when no COVID are left in scene
   if (activeCovid == 0 || health == 0) {

     document.getElementById("gameOver").classList.add("opacity");
     document.getElementById("gameOver").style.opacity = '1';
 }

  // Update controls for device orientation
  controls.update();

  // Render the both scenes
  normalRenderer.render( normalScene, normalCamera );

}

// Call Initalise function
init();

// Call Render function
render();
