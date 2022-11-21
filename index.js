// Add three slashes to make work
/// <reference path="modules/babylon.js" />
/// <reference path="modules/babylon.gui.min.js" />
/// <reference path="modules/babylon.inspector.bundle.js" />
/// <reference path="modules/babylonjs.loaders.min.js" />
/// <reference path="modules/babylonjs.materials.min.js" />
/// <reference path="modules/babylonjs.postProcess.min.js" />
/// <reference path="modules/babylonjs.proceduralTextures.min.js" />
/// <reference path="modules/babylonjs.serializers.min.js" />
/// <reference path="modules/babylon.viewer.js" />

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function(engine, canvas) {
    engine.runRenderLoop(function() {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
    return new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
};

var createScene = function() {
    //Create basic Babylon scene object
    var scene = new BABYLON.Scene(engine);

    //Create camera
    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(270), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), scene);
    camera.maxZ = planetsData.at(-1)[2] + 100000;

    //Attaches camera to canvas and makes interactable
    camera.attachControl(canvas, true);
    camera.useFramingBehavior = true;

    //Creates light, aiming 0,1,0 to the sky
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    //Set light intensive (default 1)
    light.intensity = 0.7;
    light.groundColor = new BABYLON.Color3.White(); //Remove shadows

    //Keep track of current planet
    var currentPlanet = 0;


    //Skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size: 1000}, scene);
    skybox.material = new BABYLON.StandardMaterial("skybox", scene);
    skybox.material.backFaceCulling = false;
    skybox.infiniteDistance = true;
    skybox.renderingGroupId = 0;
    skybox.material.reflectionTexture = new BABYLON.CubeTexture("./images/2k_skybox/skybox", scene);
    skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skybox.material.specularColor = new BABYLON.Color3(0, 0, 0);


    //Creating objects
    var rootSphere = BABYLON.MeshBuilder.CreateSphere("rootMesh", {diameter: 1, segments: 32}, scene);
    rootSphere.isVisible = false; //Hide root
    rootSphere.renderingGroupId = 1; //Prevent clipping behind skybox
    

    var planetMeshes = [];
    for (var i = 0; i < planetsData.length; i++) { //Loop through planets.js and create meshes
        var newClone = rootSphere.clone(planetsData[i][0]);
        newClone.isVisible = true;

        newClone.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
        newClone.scaling = new BABYLON.Vector3(planetsData[i][2], planetsData[i][2], planetsData[i][2]);

        if (i === 0) {
            newClone.position.x = 0; //Position first planet at centre
            newClone.position.y = (planetsData[i][2] / 2); //Places bottom of planet on the plane rather than centre
        } else {
            newClone.position.x = scene.getMeshByName(planetsData[i-1][0]).position.x + (planetsData[i-1][2] / 2) + planetsData[i][3] + (planetsData[i][2] / 2); //Get previous planets position and add half of the width of it to half the width of the new planet then add a divider width
            newClone.position.y = (planetsData[i][2] / 2); //Places bottom of planet on the plane rather than centre
        }

        newClone.material = new BABYLON.StandardMaterial(`${planetsData[i][0]}Material`, scene);
        newClone.material.useLogarithmicDepth = true;
        newClone.material.diffuseTexture = new BABYLON.Texture(planetsData[i][4], scene);

        newClone.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;

        /*if (planetsData[i][1] === "star") { //With logarithmic depth enabled, glow creates mesh depth clipping
            //var gl = new BABYLON.GlowLayer("glow", scene);
            //gl.intensity = 1;
            //gl.referenceMeshToUseItsOwnMaterial(newClone);
        }*/

        planetMeshes.push(newClone);
    }


    //Set camera target
    var cameraAnimTarget = new BABYLON.TransformNode("rootCamAnimTarget");
    camera.lockedTarget = cameraAnimTarget;

    //Move into camera target
    BABYLON.Animation.CreateAndStartAnimation("moveCameraNextAnim", cameraAnimTarget, "position", 30, 100, cameraAnimTarget.position, new BABYLON.Vector3(planetMeshes[currentPlanet].position.x, planetMeshes[currentPlanet].position.y), 0, new BABYLON.CubicEase);

    //Zoom into camera target //https://stackoverflow.com/a/64571830
    var distance = calcCameraToBoundingDistance(planetMeshes[currentPlanet]);

    BABYLON.Animation.CreateAndStartAnimation("cameraCentreAnim", camera, "radius", 30, 100, camera.radius, distance, 0, new BABYLON.CubicEase);


    //GUI
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI"); //Create GUI element

    var btnBack = BABYLON.GUI.Button.CreateSimpleButton("buttonBack", "Back"); //Back button
    btnBack.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnBack.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnBack.left = "25px";
    btnBack.top = "25px";
    btnBack.width = "100px";
    btnBack.height = "50px";
    btnBack.background = "black";
    btnBack.children[0].color = "white";

    var btnNext = BABYLON.GUI.Button.CreateSimpleButton("buttonNext", "Next"); //Next button
    btnNext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnNext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnNext.left = "150px";
    btnNext.top = "25px";
    btnNext.width = "100px";
    btnNext.height = "50px";
    btnNext.background = "black";
    btnNext.children[0].color = "white";

    var btnRecentre = BABYLON.GUI.Button.CreateSimpleButton("buttonRecentre", "Recentre"); //Recentre button
    btnRecentre.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnRecentre.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnRecentre.left = "25px";
    btnRecentre.top = "85px";
    btnRecentre.width = "225px";
    btnRecentre.height = "50px";
    btnRecentre.background = "black";
    btnRecentre.children[0].color = "white";

    var infoContainer = new BABYLON.GUI.StackPanel();
    infoContainer.isVertical = false;
    infoContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    infoContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    infoContainer.left = "25px";
    infoContainer.top = "-25px";
    infoContainer.width = "95%";
    infoContainer.height = "250px";

    var infoPanel = new BABYLON.GUI.ScrollViewer(); //Panel to hold info
    infoPanel.width = "500px";
    infoPanel.height = "250px";
    infoPanel.paddingLeft = "10px";
    infoPanel.background = "black";
    
    var infoText = new BABYLON.GUI.TextBlock("infoText", planetsData[currentPlanet][5]); //Info text
    infoText.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
    infoText.resizeToFit = true;
    infoText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    infoText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    infoText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    infoText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    infoText.paddingTop = "5%";
    infoText.paddingLeft = "30px";
    infoText.paddingRight = "20px";
    infoText.paddingBottom = "5%";
    infoText.color = "white";
    infoText.alpha = 1;

    var btnHideInfo = BABYLON.GUI.Button.CreateSimpleButton("buttonHideInfo", "Hide Info");
    btnHideInfo.textWrapping = true;
    btnHideInfo.width = "50px";
    btnHideInfo.height = "250px";
    btnHideInfo.background = "black";
    btnHideInfo.children[0].color = "white";
    btnHideInfo.disabledColor = "black";

    var btnAudio = BABYLON.GUI.Button.CreateSimpleButton("buttonAudio", "Stop Audio");
    btnAudio.textWrapping = true;
    btnAudio.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnAudio.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnAudio.left = "25px";
    btnAudio.top = "-285px";
    btnAudio.width = "50px";
    btnAudio.height = "50px";
    btnAudio.background = "black";
    btnAudio.children[0].color = "white";

    function changeInfoText(text) { //Allows info text to change
        infoText.text = text;
    };

    //Add control elements to main GUI
    gui.addControl(btnBack);
    gui.addControl(btnNext);
    gui.addControl(btnRecentre);
    gui.addControl(btnAudio);

    gui.addControl(infoContainer);
    infoContainer.addControl(btnHideInfo);
    infoContainer.addControl(infoPanel);
    infoPanel.addControl(infoText);


    //Planet Navigation
    btnBack.onPointerClickObservable.add(function() {
        if (currentPlanet <= 0) {
            //Zoom camera //https://stackoverflow.com/a/64571830
            var distance = calcCameraToBoundingDistance(planetMeshes[currentPlanet]);

            BABYLON.Animation.CreateAndStartAnimation("cameraCentreAnim", camera, "radius", 30, 100, camera.radius, distance, 0, new BABYLON.CubicEase);
        } else {
            currentPlanet -= 1;
            changeInfoText(planetsData[currentPlanet][5]);

            //Move camera
            camera.lockedTarget = cameraAnimTarget;
            BABYLON.Animation.CreateAndStartAnimation("moveCameraNextAnim", cameraAnimTarget, "position", 30, 100, cameraAnimTarget.position, new BABYLON.Vector3(planetMeshes[currentPlanet].position.x, planetMeshes[currentPlanet].position.y), 0, new BABYLON.CubicEase);

            //Zoom camera //https://stackoverflow.com/a/64571830
            var distance = calcCameraToBoundingDistance(planetMeshes[currentPlanet]);

            BABYLON.Animation.CreateAndStartAnimation("cameraCentreAnim", camera, "radius", 30, 100, camera.radius, distance, 0, new BABYLON.CubicEase);
        }
    });
    btnNext.onPointerClickObservable.add(function() {
        if (currentPlanet >= (planetsData.length - 1)) {
            //Zoom camera //https://stackoverflow.com/a/64571830
            var distance = calcCameraToBoundingDistance(planetMeshes[currentPlanet]);

            BABYLON.Animation.CreateAndStartAnimation("cameraCentreAnim", camera, "radius", 30, 100, camera.radius, distance, 0, new BABYLON.CubicEase);
        } else {
            currentPlanet += 1;
            changeInfoText(planetsData[currentPlanet][5]);

            //Move camera
            camera.lockedTarget = cameraAnimTarget;
            BABYLON.Animation.CreateAndStartAnimation("moveCameraNextAnim", cameraAnimTarget, "position", 30, 100, cameraAnimTarget.position, new BABYLON.Vector3(planetMeshes[currentPlanet].position.x, planetMeshes[currentPlanet].position.y), 0, new BABYLON.CubicEase);

            //Zoom camera //https://stackoverflow.com/a/64571830
            var distance = calcCameraToBoundingDistance(planetMeshes[currentPlanet]);

            BABYLON.Animation.CreateAndStartAnimation("cameraCentreAnim", camera, "radius", 30, 100, camera.radius, distance, 0, new BABYLON.CubicEase);
        }
    });
    btnRecentre.onPointerClickObservable.add(function() {
        //Zoom camera //https://stackoverflow.com/a/64571830
        var distance = calcCameraToBoundingDistance(planetMeshes[currentPlanet]);

        BABYLON.Animation.CreateAndStartAnimation("cameraCentreAnim", camera, "radius", 30, 100, camera.radius, distance, 0, new BABYLON.CubicEase);
    });

    function calcCameraToBoundingDistance(planet) { //Ensure that the camera's frustum planes always touch the bounding sphere
        var meshRadius = planet.getBoundingInfo().boundingSphere.radius;
        var meshRadiusWorld = planet.getBoundingInfo().boundingSphere.radiusWorld;
        var meshRadiusMax = Math.max(meshRadius, meshRadiusWorld); //Get highest radius so that any planet size always fits

        var halfCameraFOV = (camera.fov/2); //In radians

        return meshRadiusMax/Math.sin(halfCameraFOV);
    };


    //Prevent scrolling info box to control scene
    infoPanel.onPointerEnterObservable.add(function() {
        camera.detachControl();
    });
    infoPanel.onPointerOutObservable.add(function() { //Sometimes doesn't detect that you've left the area and doesn't reattach control
        camera.attachControl(canvas, true);
    });


    //Info Box Animation
    var infoPanelAnim = new BABYLON.Animation("infoPanelAnimation", "widthInPixels", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var infoPanelAnimKeys = [{frame: 0, value: 500}, {frame: 100, value: 25}];
    infoPanelAnim.setKeys(infoPanelAnimKeys);

    infoPanel.animations = [infoPanelAnim];

    var hideToggle = false;
    btnHideInfo.onPointerClickObservable.add(function() {
        if (hideToggle === false) {
            btnHideInfo.isEnabled = false;
            scene.beginAnimation(infoPanel, 0, 100, false, 2, function() {
                infoPanel.isVisible = false;
                btnHideInfo.children[0].text = "Show Info";
                hideToggle = true;
                btnHideInfo.isEnabled = true;
            }); //target, from, to, loop, anim speed
        } else {
            btnHideInfo.isEnabled = false;
            infoPanel.isVisible = true;
            scene.beginAnimation(infoPanel, 100, 0, false, 2, function() {
                btnHideInfo.children[0].text = "Hide Info";
                hideToggle = false;
                btnHideInfo.isEnabled = true;
            });
        }
    });


    //Audio //https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic
    var solBGM = new BABYLON.Sound("solSystemBGM", "./sound/Dreamy Flashback.mp3", scene, null, {loop: true, autoplay: true, spatialSound: true, distanceModel: "linear", maxDistance: 100, panningModel: "HRTF"});
    solBGM.attachToMesh(planetMeshes[4]);

    var audioRunning = true;
    btnAudio.onPointerClickObservable.add(function() {
        if (audioRunning === false) {
            solBGM.play();
            btnAudio.children[0].text = "Stop Audio";
            audioRunning = true;
        } else {
            solBGM.stop();
            btnAudio.children[0].text = "Play Audio";
            audioRunning = false;
        }
    });


    return scene;
};

window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch(e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    };

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene;
});

//Resize
window.addEventListener("resize", function() {
    engine.resize();
});