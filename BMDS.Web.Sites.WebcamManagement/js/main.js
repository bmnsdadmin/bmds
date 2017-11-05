//


var webcamManager = {

    appId: "bmnsdwebcam", // Choose your own app id. 8 chars minimum.

    loader: { queuePreloader: null },	// preloading/example loading
    imageData: {						// image data source handling
        webcam: { stream: null },		// either webcam ...
        picture: {}						// ... or pictures/images
    },
    dom: {},							// html dom stuff
    gui: {},							// QuickSettings elements
    drawing: {},						// drawing the results using createJS
    drawing3d: {						// all 3D engine functions
        t3d: {}//,						// ThreeJS stuff
        //f3d: {}						// Flare3D stuff (coming later)
    },
    stats: {}							// fps meter
};

//
// Namespace: brfv4 is the (mandatory) namespace for the BRFv4 library.
//

var brfv4 = { locateFile: function (fileName) { return "js/libs/brf/BRFv4_JS.js.mem"; } };

//
// Demo entry point: preloading js files.
//

webcamManager.start = function () {

    webcamManager.loader.preload([

        "js/libs/brf/BRFv4_JS.js",						// BRFv4 SDK

        "https://webrtc.github.io/adapter/adapter-latest.js",	// webcam polyfill for older browsers

       

        "js/libs/createjs/easeljs-0.8.2.min.js",				// canvas drawing lib
        "js/libs/threejs/three.js",								// ThreeJS: a 3D engine

        "js/utils/BRFv4DOMUtils.js",							// DOM handling
        "js/utils/BRFv4Stats.js",								// FPS meter

        "js/utils/BRFv4DrawingUtils_CreateJS.js",				// BRF result drawing
        "js/utils/BRFv4Drawing3DUtils_ThreeJS.js",				// ThreeJS 3d object placement.

        "js/utils/BRFv4SetupWebcam.js",							// webcam handling
        "js/utils/BRFv4SetupPicture.js",						// picture/image handling
        "js/utils/BRFv4SetupExample.js",						// overall example setup

        "js/utils/BRFv4PointUtils.js",							// some calculation helpers
        

        "js/detectors/face_tracking/facewithfeatures_detection.js"		// start with this example

    ], function () {

        webcamManager.init("webcam");

    });
};

//
// Helper stuff: logging and loading
//

// Custom way to write to a log/error to console.

webcamManager.trace = function (msg, error) {
    if (typeof window !== 'undefined' && window.console) {
        var now = (window.performance.now() / 1000).toFixed(3);
        if (error) { window.console.error(now + ': ', msg); }
        else { window.console.log(now + ': ', msg); }
    }
};

// loading of javascript files:
//
// preload(filesToLoad, callback) // filesToLoad (array)
// loadExample(filesToLoad, callback) // filesToLoad (array)
// setProgressBar(percent, visible)

(function () {
    "use strict";

    var loader = webcamManager.loader;

    loader.preload = function (filesToLoad, callback) {

        if (loader.queuePreloader !== null || !filesToLoad) {
            return;
        }

        function onPreloadProgress(event) {
            loader.setProgressBar(event.loaded, true);
        }

        function onPreloadComplete(event) {
            loader.setProgressBar(1.0, false);
            if (callback) callback();
        }

        var queue = loader.queuePreloader = new createjs.LoadQueue(true);
        queue.on("progress", onPreloadProgress);
        queue.on("complete", onPreloadComplete);
        queue.loadManifest(filesToLoad, true);
    };

    loader.loadExample = function (filesToLoad, callback) {

        function onProgress(event) {
            loader.setProgressBar(event.loaded, true);
        }

        function onComplete(event) {
            loader.setProgressBar(1.0, false);
            if (callback) callback();
        }

        var queue = loader.queueExamples = new createjs.LoadQueue(true);
        queue.on("progress", onProgress);
        queue.on("complete", onComplete);
        queue.loadManifest(filesToLoad, true);
    };

    loader.setProgressBar = function (percent, visible) {

        var bar = document.getElementById("_progressBar");
        if (!bar) return;

        if (percent < 0.0) percent = 0.0;
        if (percent > 1.0) percent = 1.0;

        var width = Math.round(percent * 640);
        var color = 0xe7e7e7;

        bar.style.width = width + "px";
        bar.style.backgroundColor = "#" + color.toString(16);
        bar.style.display = visible ? "block" : "none";
    };
})();