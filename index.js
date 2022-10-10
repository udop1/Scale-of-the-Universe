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

    //This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //Creating objects
    //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    sphere2.position.x = 3;
    
    //Textures
    let sphere1Mat = new BABYLON.StandardMaterial("Sphere1 Material", scene);
    sphere1.material = sphere1Mat;
    let sphere2Mat = new BABYLON.StandardMaterial("Sphere2 Material", scene);
    sphere2.material = sphere2Mat;

    sphere1.material.diffuseColor = BABYLON.Color3.Green();
    sphere2.material.diffuseColor = BABYLON.Color3.Red();

    //Set camera target
    camera.lockedTarget = sphere1;

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
        camera.lockedTarget = sphere1;
    });
    btnNext.onPointerClickObservable.add(function() {
        camera.lockedTarget = sphere2;
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