var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function(engine, canvas) {
    engine.runRenderLoop(function() {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false});
};

var createScene = function() {
    //This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    //Create camera
    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(270), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), scene);

    //This attaches the camera to the canvas and makes interactable
    camera.attachControl(canvas, true);
    camera.useBouncingBehavior = true;
    camera.useFramingBehavior = true;

    //This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    //Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    //light.groundColor = new BABYLON.Color3.White(); //Remove shadows

    //Skybox
    // var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size: 1000}, scene);
    // skybox.material = new BABYLON.StandardMaterial("skybox", scene);
    // skybox.material.backFaceCulling = false;
    // skybox.infiniteDistance = true;
    // skybox.renderingGroupId = 0;
    // skybox.material.reflectionTexture = new BABYLON.CubeTexture("./images/2k_stars.jpg", scene);
    // skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skybox.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skybox.material.specularColor = new BABYLON.Color3(0, 0, 0);

    async function getData() {
        const request = new Request("./planets.json");
        const response = await fetch(request);
        const planetsData = await response.json();
        //return planetsData;
        console.log(planetsData);
    }

    //Creating objects
    //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    var earth = BABYLON.MeshBuilder.CreateSphere("earthMesh", {diameter: 2, segments: 32}, scene);
    var sun = BABYLON.MeshBuilder.CreateSphere("sunMesh", {diameter: 2, segments: 32}, scene);
    earth.renderingGroupId = 1;
    sun.renderingGroupId = 1;
    earth.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
    sun.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
    sun.scaling = new BABYLON.Vector3(109, 109, 109);
    sun.position.x = 150;
    
    //Textures
    let earthMat = new BABYLON.StandardMaterial("earthMaterial", scene);
    earth.material = earthMat;
    let sunMat = new BABYLON.StandardMaterial("sunMaterial", scene);
    sun.material = sunMat;

    //https://www.solarsystemscope.com/textures/
    //https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
    earthMat.diffuseTexture = new BABYLON.Texture("./images/2k_earth_daymap.jpg", scene);
    sunMat.diffuseTexture = new BABYLON.Texture("./images/2k_sun.jpg", scene);
    //sunMat.diffuseColor = BABYLON.Color3.Red();

    //Set camera target
    camera.setTarget(earth);

    //GUI
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var btnBack = BABYLON.GUI.Button.CreateSimpleButton("button", "Back");
    btnBack.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnBack.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnBack.left = "25px";
    btnBack.top = "25px";
    btnBack.width = "100px";
    btnBack.height = "50px";
    btnBack.background = "black";
    btnBack.children[0].color = "white";

    var btnNext = BABYLON.GUI.Button.CreateSimpleButton("button", "Next");
    btnNext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnNext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btnNext.left = "150px";
    btnNext.top = "25px";
    btnNext.width = "100px";
    btnNext.height = "50px";
    btnNext.background = "black";
    btnNext.children[0].color = "white";

    gui.addControl(btnBack);
    gui.addControl(btnNext);

    //Planet Navigation
    btnBack.onPointerClickObservable.add(function() {
        camera.setTarget(earth);
    });
    btnNext.onPointerClickObservable.add(function() {
        camera.setTarget(sun);
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
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});