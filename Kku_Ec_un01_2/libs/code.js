var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

var video, video_div;
var soundsArr;
var clickSd, goodSd, errorSd,
    rightFbSd, wrongFbSd, tryFbSd, intro, quizSd;

var numOfPlaces = 7,
    numOfAns = 7,
    numOfGroups = 2,
    gNumOfP = 0,
    gNumOfAns = 0,
    ansNumEachArr = [3, 4],
    placeNumEachArr = [3, 4],
    ansNumEach = 0,
    placeNumEach = 0,
    counter = 0;

var score = 0;

var attempts = 0,
    maxAttempts = 3;

var timerInterval = null,
    timeCounter = 60,
    timerFrame = 0;

var retryV = false;

var overOut = [];
var timeoutsArr = [];
var l = console.log;

var bounds;

function init() {
    canvas = document.getElementById("canvas");
    anim_container = document.getElementById("animation_container");
    dom_overlay_container = document.getElementById("dom_overlay_container");
    var comp = AdobeAn.getComposition("3DEA1CCB3CA249D38744A2EAD5BA9C4A");
    var lib = comp.getLibrary();
    handleComplete({}, comp);
    l("why2")
}

/*function handleFileLoad(evt, comp) {
    l("why3")
    var images = comp.getImages();
    if (evt && (evt.item.type == "image")) {
        images[evt.item.id] = evt.result;
    }
    
    
}*/

function handleComplete(evt, comp) {
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    l("why4")
    var lib = comp.getLibrary();
    var ss = comp.getSpriteSheet();
    var queue = evt.currentTarget;
    var ssMetadata = lib.ssMetadata;
    for (i = 0; i < ssMetadata.length; i++) {
        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
            "images": [queue.getResult(ssMetadata[i].name)],
            "frames": ssMetadata[i].frames
        })
    }
    exportRoot = new lib.Kku_Ec_un01_2();

    stage = new lib.Stage(canvas);
    //Registers the "tick" event listener.
    fnStartAnimation = function () {
        stage.addChild(exportRoot);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        document.ontouchmove = function (e) {
            e.preventDefault();
        }
        stage.mouseMoveOutside = true;
        stage.update();
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
        prepareTheStage();
    }

    //Code to support hidpi screens and responsive scaling.
    function makeResponsive(isResp, respDim, isScale, scaleType) {
        var lastW, lastH, lastS = 1;
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function resizeCanvas() {
            var w = lib.properties.width,
                h = lib.properties.height;
            var iw = window.innerWidth,
                ih = window.innerHeight;
            var pRatio = window.devicePixelRatio || 1,
                xRatio = iw / w,
                yRatio = ih / h,
                sRatio = 1;
            if (isResp) {
                if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
                    sRatio = lastS;
                } else if (!isScale) {
                    if (iw < w || ih < h)
                        sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 1) {
                    sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 2) {
                    sRatio = Math.max(xRatio, yRatio);
                }
            }
            canvas.width = w * pRatio * sRatio;
            canvas.height = h * pRatio * sRatio;
            canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
            canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
            stage.scaleX = pRatio * sRatio;
            stage.scaleY = pRatio * sRatio;
            lastW = iw;
            lastH = ih;
            lastS = sRatio;
            stage.tickOnUpdate = false;
            stage.update();
            stage.tickOnUpdate = true;
        }
    }
    makeResponsive(true, 'both', true, 1);
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
    exportRoot["playBtn"].cursor = "pointer";
    exportRoot["playBtn"].addEventListener("click", playFn);
}

function playFn() {
    stopAllSounds();
    clickSd.play();
    exportRoot.play();
}

function prepareTheStage() {
    overOut = [exportRoot["showAnsBtn"], exportRoot["confirmBtn"],
               exportRoot["retryBtn"], exportRoot["startBtn"]];


    for (var i = 0; i < overOut.length; i++) {
        l(i)
        overOut[i].cursor = "pointer";
        overOut[i].on("mouseover", over);
        overOut[i].on("mouseout", out);
    }

    exportRoot["startBtn"].on("mouseover", over2);

    clickSd = new Howl({
        src: ['sounds/click.mp3']
    });
    goodSd = new Howl({
        src: ['sounds/good.mp3']
    });
    errorSd = new Howl({
        src: ['sounds/error.mp3']
    });
    timeOutSd = new Howl({
        src: ['sounds/timeOutSd.mp3']
    });
    rightFbSd = new Howl({
        src: ['sounds/rightFbSd.mp3']
    });
    wrongFbSd = new Howl({
        src: ['sounds/wrongFbSd.mp3']
    });
    tryFbSd = new Howl({
        src: ['sounds/tryFbSd.mp3']
    });
    timeFbSd = new Howl({
        src: ['sounds/timeFbSd.mp3']
    });
    intro = new Howl({
        src: ['sounds/intro.mp3']
    });
    quizSd = new Howl({
        src: ['sounds/quizSd.mp3']
    });
    intro = new Howl({
        src: ['sounds/intro.mp3']
    });
    infoSd = new Howl({
        src: ['sounds/infoSd.mp3']
    });
    nashat = new Howl({
        src: ['sounds/nashat.mp3']
    });

    soundsArr = [clickSd, goodSd, errorSd, timeOutSd, intro, infoSd, nashat,
                 rightFbSd, wrongFbSd, tryFbSd, timeFbSd, intro, quizSd];
    stopAllSounds();

    for (var i = 1; i <= numOfPlaces; i++) {
        if (i <= numOfAns) {

            exportRoot["a" + i].id = i;
            exportRoot["a" + i].xPos = exportRoot["a" + i].x;
            exportRoot["a" + i].yPos = exportRoot["a" + i].y;
            exportRoot["a" + i].gNum = gNumOfAns + 1;
            exportRoot["a" + i].placeNum = null;
            ansNumEach++;
            placeNumEach++;
            if (ansNumEach == ansNumEachArr[gNumOfAns]) {
                gNumOfAns++;
                ansNumEach = 0;
            }
            console.log("a" + i + "_gnum= " + exportRoot["a" + i].gNum)
        }
        exportRoot["p" + i].id = i;
        exportRoot["p" + i].gNum = gNumOfP + 1;
        exportRoot["p" + i].ansNum = null;
        if (placeNumEach == placeNumEachArr[gNumOfP]) {
            gNumOfP++;
            placeNumEach = 0;
        }
        console.log("p" + i + "_gnum= " + exportRoot["p" + i].gNum)
    }

    exportRoot["startBtn"].addEventListener("click", playExportRootFn);

    /*exportRoot["confirmBtn"].addEventListener("click", confirmFN);*/
    exportRoot["retryBtn"].addEventListener("click", retryFN);
    exportRoot["showAnsBtn"].addEventListener("click", function () {
        //hideFB();
        stopAllSounds();
        exportRoot["showAnsBtn"].alpha = 0;
        exportRoot["answers"].alpha = 1;
        exportRoot["answers"].gotoAndPlay(0);
    });

    bounds = exportRoot.getBounds();
    hideFB();
    l("helloooo2")
}

function playExportRootFn() {
    stopAllSounds();
    clickSd.play();
    exportRoot.play();
}

function hideFB() {
    exportRoot["wrongFB"].alpha = 0;
    exportRoot["wrongFB"].playV = false;
    exportRoot["rightFB"].alpha = 0;
    exportRoot["rightFB"].playV = false;
    exportRoot["tryFB"].alpha = 0;
    exportRoot["tryFB"].playV = false;
    exportRoot["timeOutFB"].alpha = 0;
    exportRoot["timeOutFB"].playV = false;

    exportRoot["fullScore"].alpha = 0;
    exportRoot["fullScore"].playV = false;
    exportRoot["score_3"].alpha = 0;
    exportRoot["score_3"].playV = false;
    exportRoot["score_2"].alpha = 0;
    exportRoot["score_2"].playV = false;
    exportRoot["score_1"].alpha = 0;
    exportRoot["score_1"].playV = false;
    exportRoot["score_0"].alpha = 0;
    exportRoot["score_0"].playV = false;
    exportRoot["answers"].alpha = 0;

    exportRoot["retryBtn"].alpha = 0;
    exportRoot["retryBtn"].gotoAndStop(0);
    exportRoot["showAnsBtn"].alpha = 0;
    exportRoot["showAnsBtn"].gotoAndStop(0);
    exportRoot["confirmBtn"].alpha = 0;
    exportRoot["confirmBtn"].gotoAndStop(0);
}

function stopAllSounds() {
    for (var s = 0; s < soundsArr.length; s++) {
        soundsArr[s].stop();
    }
}

function activateButtons() {
    for (var i = 1; i <= numOfPlaces; i++) {
        if (i <= numOfAns) {
            exportRoot["a" + i].alpha = 1;
            exportRoot["a" + i].cursor = "pointer";
            exportRoot["a" + i].addEventListener("pressmove", moveFn);
            exportRoot["a" + i].addEventListener("pressup", pressupFn);
            exportRoot["a" + i].addEventListener("mouseover", over);
            exportRoot["a" + i].addEventListener("mouseout", out);
            exportRoot["a" + i].x = exportRoot["a" + i].xPos;
            exportRoot["a" + i].y = exportRoot["a" + i].yPos;
            if (retryV) {
                exportRoot["a" + i].gotoAndStop(0);
                exportRoot["a" + i].placeNum = null;
            }
        }

        //exportRoot["p"+i].amIChecked = false;
        exportRoot["p" + i].ansNum = null;
        if (retryV) {
            exportRoot["p" + i].gotoAndStop(0);
        }
    }

    exportRoot["confirmBtn"].cursor = "pointer";
    exportRoot["confirmBtn"].addEventListener("click", confirmFN);
}

function deactivateButtons() {
    for (var i = 1; i <= numOfAns; i++) {
        //exportRoot["a" + i].alpha = 0;
        exportRoot["a" + i].cursor = "auto";
        exportRoot["a" + i].removeEventListener("pressmove", moveFn);
        exportRoot["a" + i].removeEventListener("pressup", pressupFn);
        exportRoot["a" + i].removeEventListener("mouseover", over);
        exportRoot["a" + i].removeEventListener("mouseout", out);
    }

    exportRoot["confirmBtn"].cursor = "auto";
    exportRoot["confirmBtn"].removeEventListener("click", confirmFN);
}

function hideAns() {
    for (var i = 1; i <= numOfAns; i++) {
        exportRoot["a" + i].alpha = 0;
    }
}

function moveFn(e) {
    e.currentTarget.disX = stage.mouseX - e.currentTarget.x;
    e.currentTarget.disY = stage.mouseY - e.currentTarget.y;
    e.currentTarget.x = e.stageX / (stage.scaleX);
    e.currentTarget.y = e.stageY / (stage.scaleY);

    /*e.currentTarget.x = Math.max(bounds.x+e.currentTarget.nominalBounds.width/2, Math.min(bounds.x+bounds.width-e.currentTarget.nominalBounds.width/2, e.stageX / (stage.scaleX)));
    
    e.currentTarget.y = Math.max(bounds.y+e.currentTarget.nominalBounds.height/2, Math.min(bounds.y+bounds.height-e.currentTarget.nominalBounds.height/2, e.stageY / (stage.scaleY)));*/

    e.currentTarget.removeEventListener("mouseover", over);
    e.currentTarget.removeEventListener("mouseout", out);
    e.currentTarget.gotoAndStop(0);
    exportRoot.addChild(e.currentTarget);
}

function pressupFn(e2) {
    found = false;
    if (timeCounter > 0) {
        for (var i = 1; i <= numOfPlaces; i++) {

            if (Math.abs(e2.currentTarget.x - exportRoot["p" + i].x) < 130 &&
                Math.abs(e2.currentTarget.y - exportRoot["p" + i].y) < 30) {
                stopAllSounds();
                clickSd.play();
                found = true;
                if (e2.currentTarget.placeNum !== null) {
                    exportRoot["p" + e2.currentTarget.placeNum].ansNum = null;
                } else if (exportRoot["p" + i].ansNum == null) {
                    counter++;
                }

                if (exportRoot["p" + i].ansNum !== null) {
                    var prevAns = exportRoot["a" + exportRoot["p" + i].ansNum];
                    if (e2.currentTarget.placeNum !== null) {
                        var prevPlace = exportRoot["p" + e2.currentTarget.placeNum];
                        createjs.Tween.get(prevAns, {
                            override: true
                        }).to({
                            x: prevPlace.x,
                            y: prevPlace.y
                        }, 100, createjs.Ease.easeOut);
                        prevAns.placeNum = e2.currentTarget.placeNum;
                        prevPlace.ansNum = prevAns.id;
                    } else {
                        prevAns.addEventListener("mouseover", over);
                        prevAns.addEventListener("mouseout", out);
                        createjs.Tween.get(prevAns, {
                            override: true
                        }).to({
                            x: prevAns.xPos,
                            y: prevAns.yPos
                        }, 300, createjs.Ease.easeOut);
                        prevAns.gotoAndStop(0);
                        prevAns.placeNum = null;
                    }
                    //exportRoot["p" + i].ansNum = null;

                }

                e2.currentTarget.x = exportRoot["p" + i].x;
                e2.currentTarget.y = exportRoot["p" + i].y;
                e2.currentTarget.gotoAndStop(1);
                e2.currentTarget.placeNum = i;

                exportRoot["p" + i].ansNum = e2.currentTarget.id;


                if (counter == numOfAns) {
                    exportRoot.confirmBtn.alpha = 1;
                } else {
                    exportRoot.confirmBtn.alpha = 0;
                }
                break;
            }
        }

        if (found == false) {

            e2.currentTarget.addEventListener("mouseover", over);
            e2.currentTarget.addEventListener("mouseout", out);
            e2.currentTarget.gotoAndStop(0);
            if (e2.currentTarget.placeNum !== null) {
                exportRoot["p" + e2.currentTarget.placeNum].ansNum = null;
                counter--;
                e2.currentTarget.placeNum = null;
                if (counter < numOfAns) {
                    exportRoot.confirmBtn.alpha = 0;
                }
            }

            createjs.Tween.get(e2.currentTarget, {
                override: true
            }).to({
                x: e2.currentTarget.xPos,
                y: e2.currentTarget.yPos
            }, 300, createjs.Ease.easeOut);
        }

    }

    //l("counter: " + counter)

    /*l("counter = " + counter)
    l("exportRoot.ans1.placeNum " + exportRoot.ans1.placeNum)
    l("exportRoot.ans2.placeNum " + exportRoot.ans2.placeNum)
    l("exportRoot.ans3.placeNum " + exportRoot.ans3.placeNum)
    l("exportRoot.place1.ansNum " + exportRoot.place1.ansNum)
    l("exportRoot.place2.ansNum " + exportRoot.place2.ansNum)
    l("exportRoot.place3.ansNum " + exportRoot.place3.ansNum)*/
}

function confirmFN() {
    clearInterval(timerInterval);
    hideFB();
    stopAllSounds();
    clickSd.play();
    deactivateButtons();
    hideAns();

    var placeNum;
    for (var i = 1; i <= numOfAns; i++) {
        placeNum = exportRoot["a" + i].placeNum;
        if (exportRoot["a" + i].gNum == exportRoot["p" + placeNum].gNum) {
            score++;
        }
    }
    if (score == numOfAns) {
        exportRoot["rightFB"].playV = true;
        exportRoot["rightFB"].alpha = 1;
        exportRoot["rightFB"].gotoAndPlay(0);
    } else {
        wrongFbFn();
    }
}

function wrongFbFn() {
    attempts++;
    if (attempts == maxAttempts) {
        exportRoot["wrongFB"].playV = true;
        exportRoot["wrongFB"].alpha = 1;
        exportRoot["wrongFB"].gotoAndPlay(0);
    } else {
        if (timeCounter <= 0) {
            exportRoot["timeOutFB"].playV = true;
            exportRoot["timeOutFB"].alpha = 1;
            exportRoot["timeOutFB"].gotoAndPlay(0);
        } else {
            exportRoot["tryFB"].playV = true;
            exportRoot["tryFB"].alpha = 1;
            exportRoot["tryFB"].gotoAndPlay(0);
        }
    }
}

function retryFN() {
    counter = 0;
    score = 0;
    stopAllSounds();
    clickSd.play();
    retryV = true;
    activateButtons();
    retryV = false;
    hideFB();
    Timer();
}

function over(e) {
    e.currentTarget.gotoAndStop(1);
}

function over2(e) {
    e.currentTarget.gotoAndStop(2);
}

function out(e) {
    e.currentTarget.gotoAndStop(0);
}

function Timer() {
    l("timer started")
    timeCounter = 60;
    timerFrame = 0;
    exportRoot["timerSymb"].gotoAndStop(timerFrame);
    timerInterval = setInterval(timerFn, 1000);
}

function timerFn() {
    timerFrame++;
    timeCounter--;
    exportRoot["timerSymb"].gotoAndStop(timerFrame);
    if (timeCounter == 0) {
        timeOut();
    }
}

function timeOut() {
    deactivateButtons();
    clearInterval(timerInterval);
    stopAllSounds();
    timeOutSd.play();
    setTimeout(function () {
        hideAns();
        wrongFbFn();
    }, 800);
}

function showScore() {
    if (score == numOfAns) {
        exportRoot["fullScore"].playV = true;
        exportRoot["fullScore"].alpha = 1;
        exportRoot["fullScore"].gotoAndPlay(0);
    } else {
        exportRoot["score_" + Math.round(score / 2)].playV = true;
        exportRoot["score_" + Math.round(score / 2)].alpha = 1;
        exportRoot["score_" + Math.round(score / 2)].gotoAndPlay(0);
    }
}
