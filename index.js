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
    var earth = BABYLON.MeshBuilder.CreateSphere("earthMesh", {diameter: 1, segments: 32}, scene);
    var jupiter = BABYLON.MeshBuilder.CreateSphere("jupiterMesh", {diameter: 1, segments: 32}, scene);
    var sun = BABYLON.MeshBuilder.CreateSphere("sunMesh", {diameter: 1, segments: 32}, scene);

    earth.renderingGroupId = 1;
    jupiter.renderingGroupId = 1;
    sun.renderingGroupId = 1;

    earth.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
    jupiter.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
    sun.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);

    jupiter.scaling = new BABYLON.Vector3(planetsData.jupiter.size, planetsData.jupiter.size, planetsData.jupiter.size);
    sun.scaling = new BABYLON.Vector3(planetsData.sun.size, planetsData.sun.size, planetsData.sun.size);

    var divider = 10;
    jupiter.position.x = (earth.scaling.x / 2) + divider + (jupiter.scaling.x / 2);
    sun.position.x = jupiter.position.x + (jupiter.scaling.x / 2) + divider + (sun.scaling.x / 2);
    
    //Textures
    earth.material = new BABYLON.StandardMaterial("earthMaterial", scene);
    jupiter.material = new BABYLON.StandardMaterial("jupiterMaterial", scene);
    sun.material = new BABYLON.StandardMaterial("sunMaterial", scene);

    earth.material.diffuseTexture = new BABYLON.Texture(planetsData.earth.texture, scene);
    jupiter.material.diffuseTexture = new BABYLON.Texture(planetsData.jupiter.texture, scene);
    sun.material.diffuseTexture = new BABYLON.Texture(planetsData.sun.texture, scene);

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