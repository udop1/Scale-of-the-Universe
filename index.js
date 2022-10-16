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

    //Attaches camera to canvas and makes interactable
    camera.attachControl(canvas, true);
    camera.useFramingBehavior = true;

    //Creates light, aiming 0,1,0 to the sky
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    //Set light intensive (default 1)
    light.intensity = 0.7;
    //light.groundColor = new BABYLON.Color3.White(); //Remove shadows

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

    var divider = 10;
    var planetMeshes = [];
    for (var i = 0; i < planetsData.length; i++) { //Loop through planets.js and create meshes
        var newClone = rootSphere.clone(planetsData[i][0]);
        newClone.isVisible = true;

        newClone.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
        newClone.scaling = new BABYLON.Vector3(planetsData[i][1], planetsData[i][1], planetsData[i][1]);

        if (i === 0) {
            newClone.position.x = 0; //Position first planet at centre
        } else {
            newClone.position.x = scene.getMeshByName(planetsData[i-1][0]).position.x + (planetsData[i-1][1] / 2) + divider + (planetsData[i][1] / 2); //Get previous planets position and add half of the width of it to half the width of the new planet then add a divider width
        }

        newClone.material = new BABYLON.StandardMaterial(`${planetsData[i][0]}Material`, scene);
        newClone.material.diffuseTexture = new BABYLON.Texture(planetsData[i][2], scene);

        planetMeshes.push(newClone);
    }

    //Set camera target
    camera.setTarget(planetMeshes[0]);

    //GUI
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    //Add info GUI here

    var btnBack = BABYLON.GUI.Button.CreateSimpleButton("buttonBack", "Back");
    btnBack.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnBack.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnBack.left = "25px";
    btnBack.top = "25px";
    btnBack.width = "100px";
    btnBack.height = "50px";
    btnBack.background = "black";
    btnBack.children[0].color = "white";

    var btnNext = BABYLON.GUI.Button.CreateSimpleButton("buttonNext", "Next");
    btnNext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnNext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnNext.left = "150px";
    btnNext.top = "25px";
    btnNext.width = "100px";
    btnNext.height = "50px";
    btnNext.background = "black";
    btnNext.children[0].color = "white";

    var btnRecentre = BABYLON.GUI.Button.CreateSimpleButton("buttonRecentre", "Recentre");
    btnRecentre.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnRecentre.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnRecentre.left = "25px";
    btnRecentre.top = "85px";
    btnRecentre.width = "225px";
    btnRecentre.height = "50px";
    btnRecentre.background = "black";
    btnRecentre.children[0].color = "white";

    gui.addControl(btnBack);
    gui.addControl(btnNext);
    gui.addControl(btnRecentre);

    //Planet Navigation
    var currentPlanet = 0;
    btnBack.onPointerClickObservable.add(function() {
        if (currentPlanet <= 0) {
            camera.setTarget(planetMeshes[currentPlanet]);
        } else {
            currentPlanet -= 1;
            camera.setTarget(planetMeshes[currentPlanet]);
        }
    });
    btnNext.onPointerClickObservable.add(function() {
        if (currentPlanet >= (planetsData.length - 1)) {
            camera.setTarget(planetMeshes[currentPlanet]);
        } else {
            currentPlanet += 1;
            camera.setTarget(planetMeshes[currentPlanet]);
        }
    });
    btnRecentre.onPointerClickObservable.add(function() {
        camera.setTarget(planetMeshes[currentPlanet]);
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