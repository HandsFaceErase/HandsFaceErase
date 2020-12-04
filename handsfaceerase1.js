//////////////////////////////////////////////////////////////////////////////////
//		Declare global variables
//////////////////////////////////////////////////////////////////////////////////
var camera, normalCamera, scene, normalScene, controls, renderer, normalRenderer, geometry, material, texture;
var normalRaycaster = new THREE.Raycaster(), raycaster = new THREE.Raycaster();
var arToolkitContext;
var arToolkitSource;
var initfly;
var covid = 5;
var covidStart = 5;
var activeCovid = 5;
var covidKilled = 0;
var covid19 = new THREE.Group();
var ARcovid19 = new THREE.Group();
var cameraPosition = new THREE.Vector2();
var fire = false;
var reset = false;
cameraPosition.x = 0;
cameraPosition.y = 0;
cameraPosition.z = 0;

//////////////////////////////////////////////////////////////////////////////////
//		Initialise
//////////////////////////////////////////////////////////////////////////////////
function init(){
// Initialise AR base scene and rendering preferences

  // Set-up AR.js scene
  var video = arToolkitSource;

  // Create a scene for the AR content (only displayed when marker is found)
  scene = new THREE.Scene();

  // Create a scene for content which is always displayed
  normalScene = new THREE.Scene();

  // Create a camera for each scene
  camera = new THREE.PerspectiveCamera();
  normalCamera = new THREE.PerspectiveCamera();
  normalCamera.position.set(0,0,0);
  scene.add(camera);
  normalScene.add(normalCamera);

  //Enable orientation controls so user can look around the scene (also updated at render)
  controls = new THREE.DeviceOrientationControls( normalCamera );
  controls.update();

  // Create a WebGL renderer and add prefernces
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  normalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  // Set the size of the renderers to the inner width and inner height of the window
  renderer.setSize( window.innerWidth, window.innerHeight );
  normalRenderer.setSize( window.innerWidth, window.innerHeight );

  // Add in the created DOM elements to the body of the document
  document.body.appendChild( normalRenderer.domElement );
  document.body.appendChild( renderer.domElement );

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
    arToolkitSource.copyElementSizeTo(renderer.domElement)
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
    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
    normalCamera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
  })

  // Initalise controls for camera
  var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'pattern',
    patternUrl : 'data/CircleDash.patt',
    changeMatrixMode: 'cameraTransformMatrix'
  })

  //Set scene to invivible (set back to visbile in render when marker detected)
  scene.visible = false;

// AR scene setup

  // Add a directional light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set(1,0.5,1);
  normalScene.add( directionalLight );

  // Add weak ambient light
  var ambientlight = new THREE.AmbientLight( 0x404040, 0.5);
  normalScene.add( ambientlight );

  var jar;
  var jarGroup = new THREE.Object3D();
  normalScene.add(jarGroup);
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
          jar.position.set(0,0,0);
          jar.shadow;
          jarGroup.add(jar);
        }
      )
    })

    initfly=jarGroup;

// Normal scene setup

  // Add ambient ligh to scene
	var light = new THREE.AmbientLight( 0x404040, 3);;
	light.position.set(0,10,0);
	normalScene.add(light);

  // Addding variable covid19 to normal scene ready for content to be added
	normalScene.add( covid19 );

  console.log(covid19);

  //Call function which creates and animates the initial covid in the scene
  fireflyStart();

}

//////////////////////////////////////////////////////////////////////////////////
//		Function to create initial covid19 (called in 'init')
//////////////////////////////////////////////////////////////////////////////////
function fireflyStart(){

  //For-Loop to create and inititalise the number of covid19 in global var 'covid'
  for (var i=covid;i--;){
    covid19[i] = initfly.clone();
    var Div = covid19[i];
      // For each set random start location in scene
      Div.position.x = random(-10,10);
      Div.position.y = random(-10,10);
      Div.position.z = random(-10,10);
    // Call to function which adds motion
    Anim(Div);
    // Adds covid19 to scene via the already added group 'covid19'
    covid19.children.push(covid19[i]);
  };

  // Function to animated the covid created above to move using Tween.js
  function Anim(elm){

    // Set position and target variables
    var position = elm.position;
    var target = {x:random(-7,7),y:random(-7,7),z:random(-7,7)};

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

//Global variables for ExplodeAnimation
var movementSpeed = 10;
var totalObjects = 200;
var objectSize = 0.3;
var sizeRandomness = 5;
var dirs = [];
var parts = [];

//////////////////////////////////////////////////////////////////////////////////
//		Function to create explosion at x,y & of interesected object
//////////////////////////////////////////////////////////////////////////////////
// function ExplodeAnimation(x,y,z,inputScene){
//   var geometry = new THREE.Geometry();
//
//   for (i = 0; i < totalObjects; i ++)
//   {
//     // Generate particlesto the number of totalObjects
//     var vertex = new THREE.Vector3();
//     vertex.x = x;
//     vertex.y = y;
//     vertex.z = z;
//
//     geometry.vertices.push( vertex );
//     dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
//   }
//   var material = new  THREE.PointsMaterial( { size: objectSize,  color: 0xffd24d});
//   var particles = new THREE.Points( geometry, material );
//
//   this.object = particles;
//   this.status = true;
//
//   // Create knew direction based on movementSpeed and Math.random
//   this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
//   this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
//   this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
//
//   normalScene.add( particles  );
//
//   // Update particles
//   this.update = function(){
//     if (this.status == true){
//       var pCount = totalObjects;
//       while(pCount--) {
//         var particle =  this.object.geometry.vertices[pCount]
//         particle.y += dirs[pCount].y;
//         particle.x += dirs[pCount].x;
//         particle.z += dirs[pCount].z;
//       }
//       this.object.geometry.verticesNeedUpdate = true;
//     }
//   }
//
// }

//////////////////////////////////////////////////////////////////////////////////
//		Function to launch fly from AR pot into scene
//////////////////////////////////////////////////////////////////////////////////
function launchFirefly() {

  covid = 1;
  fireflyStart();

  var ARfly = initfly.clone();
  ARfly.scale = 2;
  ARfly.position.set(0,0,0);
  scene.add(ARfly);

  // Set position and target variables
  var position = ARfly.position;
  var target = {x:0,y:10,z:0};

  // Perform tween which moves from current position to random position
  tween = new TWEEN.Tween(position).to(target, 2000).start();

  // On each tween frame the position of each covid is updated
  tween.onUpdate(function() {
    ARfly.position.x = position.x;
    ARfly.position.y = position.y;
    ARfly.position.z = position.z;
  });


  tween.onComplete(function() {
    setTimeout(disappear, 2000);
    function disappear(){
      // Set position and target variables
      var pos = ARfly.position;
      var targ = {x:100,y:100,z:0};

      // Perform tween which moves from current position to random position
      tween = new TWEEN.Tween(pos).to(targ, 2500).start();

      // On each tween frame the position of each covid is updated
      tween.onUpdate(function() {
        ARfly.position.x = position.x;
        ARfly.position.y = position.y;
        ARfly.position.z = position.z;
      });

      // On complete of launch fly remove it from scene
      tween.onComplete(function() {
        scene.remove(ARfly);
      });
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////
//		Function to create random number between two povided points
//////////////////////////////////////////////////////////////////////////////////
function random(min,max)
{
    return Math.random()*(max-min+1)+min;
}

//////////////////////////////////////////////////////////////////////////////////
//		Render (repeated loop)
//////////////////////////////////////////////////////////////////////////////////
var render = function () {
  requestAnimationFrame( render );

  // Update the TWEEN for animations in the application
  TWEEN.update();

  // Set AR scene to vivible when marker is detected
  if( arToolkitSource.ready === false )	return
  arToolkitContext.update( arToolkitSource.domElement )
  scene.visible = camera.visible

  // Update matrix of both scenes
  normalScene.updateMatrixWorld();
  scene.updateMatrixWorld();

  // Raycaster used for shooting covid19
  raycaster.setFromCamera( cameraPosition, camera );
  normalRaycaster.setFromCamera( cameraPosition, normalCamera);

  // Set what raycaster can detect
  var intersects = raycaster.intersectObjects( scene.children );
	var normalIntersects = normalRaycaster.intersectObjects( normalScene.children, true);

  // update pCounbt for TWEEN movement
  var pCount = parts.length;
          while(pCount--) {
            parts[pCount].update();
          }

  // If 'Fire' is clicked and raycast is intersecting with fly
 	if (fire == true && normalIntersects[0] != undefined){

    // Set the fly to invisible
    normalIntersects[0].object.visible = false;

    // New explosion aninimation at coordinates of intersected object
    parts.push(new ExplodeAnimation(normalIntersects[0].object.position.x, normalIntersects[0].object.position.y,normalIntersects[0].object.position.z,normalScene));

    activeCovid--;

    covidKilled++;

    // Set var fire back to false
    fire = false;

  } else if (fire == true && normalIntersects[0] == undefined) {

    // Set var fire back to false
    fire = false;

    activeCovid++

    // Launch a new fly into the scene
    launchFirefly();
  }

  // Update 'covid19 Left' to reflect number of covid19 in scene
  document.getElementById("covidLeft").innerHTML = "covid19 Left: " + activeCovid;

  // Update 'covid19 Killed' to reflect number of covid19 shot
  // document.getElementById("covidKilled").innerHTML = "covid19 Killed: " + covidKilled;

  // When reset button is pressed put scene back to init
  document.getElementById("reset").addEventListener("click", function(event){

    for (var i = covid19.children.length; i >= covidStart; i--) {
    covid19.remove(covid19.children[i]);
    }

    activeCovid=covidStart;

    covidKilled = 0;

    covid19.children.visible = true;

    event.stopPropagation();
  });

  // Update controls for device orientation
  controls.update();

  // Render the both scenes
  normalRenderer.render( normalScene, normalCamera );
  renderer.render( scene, camera );
}

// Call Initalise function
init();

// Call Render function
render();
