var renderer = null,
    scene = null,
    camera = null,
    particles = null,
    callbacks = null,
    lastMouseX = null,
    lastMouseY = null,
    particleSystem = null,
    mouseDown = null,
    mesh = null,
    rotX = 0,
    rotY = 0,
    opac = 1,
    backgroundColor = "0x000000",
    object, geometry, guiElement, stats;
	DEPTH = 600, NEAR = 1, FAR = 4000, VIEW_ANGLE = 45;

	var step = 0.04;
	var linestep = 0.07;
	var a1 = 1.3;
	var b1 = 2.5;
	var m1 = 13.6;
	var n11 = 72.4;
	var n21 = 24.7;
	var n31 = 2;
	var a2 = 1.2;
	var b2 = 3.3;
	var m2 = 16.3;
	var n12 = 11.6;
	var n22 = 35.4;
	var n32 = 3;
	var pSize = 1;
	var color = "0xffffff";

	var composer, focus, hblur, vblur, material, effectVignette, focus;
	var lightX = 0, lightY = 50, lightZ = 700, shadowBias = 0.002, shadowDarkness = 0.8,
	shadowCameraNear = 450;
