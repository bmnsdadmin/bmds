(function exampleCode() {
    "use strict";

    var numFacesToTrack = 2; // Set the number of faces to detect and track.

    webcamManager.initCurrentExample = function(brfManager, resolution) {

        // By default everything necessary for a single face tracking app
        // is set up for you in brfManager.init.

        brfManager.init(resolution, resolution, webcamManager.appId);

        // But here we tell BRFv4 to track multiple faces. In this case two.

        // While the first face is getting tracked the face detection
        // is performed in parallel and is looking for a second face.

        brfManager.setNumFacesToTrack(numFacesToTrack);

        // Relax starting conditions to eventually find more faces.

        var maxFaceSize = resolution.height;

        if (resolution.width < resolution.height) {
            maxFaceSize = resolution.width;
        }

        brfManager.setFaceDetectionParams(maxFaceSize * 0.20, maxFaceSize * 1.00, 12, 8);
        brfManager.setFaceTrackingStartParams(maxFaceSize * 0.20, maxFaceSize * 1.00, 32, 35, 32);
        brfManager.setFaceTrackingResetParams(maxFaceSize * 0.15, maxFaceSize * 1.00, 40, 55, 32);
    };

    webcamManager.updateCurrentExample = function(brfManager, imageData, draw) {

        brfManager.update(imageData);

        // Drawing the results:

        draw.clear();

        // Get all faces. We get numFacesToTrack faces in that array.
        draw.drawRects(brfManager.getAllDetectedFaces(), false, 1.0, 0x00a1ff, 0.5);
        draw.drawRects(brfManager.getMergedDetectedFaces(), false, 2.0, 0xffd200, 1.0);

        var faces = brfManager.getFaces(); // default: one face, only one element in that array.

         for (var i = 0; i < faces.length; i++) {

            var face = faces[i];

            if (face.state === brfv4.BRFState.FACE_TRACKING) {

                // simple blink detection

                // A simple approach with quite a lot false positives. Fast movement can't be
                // handled properly. This code is quite good when it comes to
                // starring contest apps though.

                // It basically compares the old positions of the eye points to the current ones.
                // If rapid movement of the current points was detected it's considered a blink.

                var v = face.vertices;

                if (_oldFaceShapeVertices.length === 0) storeFaceShapeVertices(v);

                var k, l, yLE, yRE;

                // Left eye movement (y)

                for (k = 36, l = 41, yLE = 0; k <= l; k++) {
                    yLE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
                }
                yLE /= 6;

                // Right eye movement (y)

                for (k = 42, l = 47, yRE = 0; k <= l; k++) {
                    yRE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
                }

                yRE /= 6;

                var yN = 0;

                // Compare to overall movement (nose y)

                yN += v[27 * 2 + 1] - _oldFaceShapeVertices[27 * 2 + 1];
                yN += v[28 * 2 + 1] - _oldFaceShapeVertices[28 * 2 + 1];
                yN += v[29 * 2 + 1] - _oldFaceShapeVertices[29 * 2 + 1];
                yN += v[30 * 2 + 1] - _oldFaceShapeVertices[30 * 2 + 1];
                yN /= 4;

                var blinkRatio = Math.abs((yLE + yRE) / yN);

                if ((blinkRatio > 12 && (yLE > 0.4 || yRE > 0.4))) {
                    console.log("blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
                        yRE.toFixed(2) + " " + yN.toFixed(2));

                    blink();
                }

                // Let the color of the shape show whether you blinked.

                
                // Face Tracking results: 68 facial feature points.

                // detect smile and yawn

                setPoint(face.vertices, 48, p0); // mouth corner left
                setPoint(face.vertices, 54, p1); // mouth corner right

                var mouthWidth = calcDistance(p0, p1);

                setPoint(face.vertices, 62, p0); // mouth corner left
                setPoint(face.vertices, 66, p1); // mouth corner right

                var mouthOpen = calcDistance(p0, p1);

                setPoint(face.vertices, 39, p1); // left eye inner corner
                setPoint(face.vertices, 42, p0); // right eye outer corner

                var eyeDist = calcDistance(p0, p1);

                // Smile Detection
                var smileFactor = mouthWidth / eyeDist;

                smileFactor -= 1.40; // 1.40 - neutral, 1.70 smiling

                if (smileFactor > 0.25) smileFactor = 0.25;
                if (smileFactor < 0.00) smileFactor = 0.00;

                smileFactor *= 4.0;

                if (smileFactor < 0.0) { smileFactor = 0.0; }
                if (smileFactor > 1.0) { smileFactor = 1.0; }


                // Yawn Detection - Or: How wide open is the mouth?                              
                var yawnFactor = mouthOpen / eyeDist;

                //yawnFactor -= 0.35; // remove smiling

                if (yawnFactor < 0) yawnFactor = 0;

                yawnFactor *= 2.0; // scale up a bit

                if (yawnFactor > 1.0) yawnFactor = 1.0;

                if (yawnFactor < 0.0) { yawnFactor = 0.0; }
                if (yawnFactor > 1.0) { yawnFactor = 1.0; }

                // Let the color show you how much you yawn.

                var color =
                    (((0xff * (smileFactor) & 0xff) << 8)) +
                    (((0xff * yawnFactor) & 0xff) << 16);


                if (_blinked) {
                    color = 0xffd200;
                }


                draw.drawTriangles(face.vertices, face.triangles, false, 1.0, color, 0.4);
                draw.drawVertices(face.vertices, 2.0, false, color, 0.4);
                webcamManager.dom.updateHeadline("eye  blink: " + (_blinked ? "Yes" : "No") + "\nsmiling: " + (smileFactor == 1 ? "Yes" : "No") + "\nyawning: " + (yawnFactor == 1 ? "Yes" : "No"));

                storeFaceShapeVertices(v);
            }
        }
    };
   
    function blink() {
        _blinked = true;

        if (_timeOut > -1) { clearTimeout(_timeOut); }

        _timeOut = setTimeout(resetBlink, 150);
    }

    function resetBlink() {
        _blinked = false;
    }

    function storeFaceShapeVertices(vertices) {
        for (var i = 0, l = vertices.length; i < l; i++) {
            _oldFaceShapeVertices[i] = vertices[i];
        }
    }

    var _oldFaceShapeVertices = [];
    var _blinked = false;
    var _timeOut = -1;

    var p0 = new brfv4.Point();
    var p1 = new brfv4.Point();

    var setPoint = brfv4.BRFv4PointUtils.setPoint;
    var calcDistance = brfv4.BRFv4PointUtils.calcDistance;

    

})();