"use strict"

// register the application module

// import modules used by the app
var m_app       = b4w.require("app");
var m_cfg       = b4w.require("config");
var m_data      = b4w.require("data");
var m_preloader = b4w.require("preloader");
var m_ver       = b4w.require("version");
var m_logic = b4w.require("logic_nodes");
var m_anim   = b4w.require("animation");
var m_mat    = b4w.require("material");
var m_obj    = b4w.require("objects");
var m_scenes = b4w.require("scenes");
var m_rgb    = b4w.require("rgb");
var m_trans  = b4w.require("transform");
var m_vec    = b4w.require("vec3");
var m_main   = b4w.require("main");
var m_camera = b4w.require("camera");
var m_ctl    = b4w.require("controls");
var m_time   = b4w.require("time");
var m_util   = b4w.require("util");
var m_container = b4w.require("container");
var m_lights = b4w.require("lights");


// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("BuildandPrice");

var carPaintIndex = 0;

var materialName = "carShader";
var objs = [
    "left_door_main_body",
    "right_door_main_body",
    "left_door_exterior_mirror_secundary_body",
    "rigth_door_secundary_body",
    "top_side",
    "fender",
    "front_hood",
    "front_bumper",
    "rear_bumper",
    "side_cover",
    "floor",
    "floor_main_body",
    "Object163",
    "doors_frame",

    "TrunkMetalSideBarsBottom",
    "left_door_silencers",
    "right_door_silencer"
];

/**
 * export the method to initialize the app (called at the bottom of this file)
 */

    m_app.init({
        canvas_container_id: "container_id",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true
    });


/**
 * callback executed when the app is initialized
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("assets/BuildandPrice.json",  load_cb, preloader_cb);
   // m_data.load(APP_ASSETS_PATH + "BuildandPrice.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }


    m_logic.append_custom_callback("jsCallback",jsCallback);
    m_app.enable_camera_controls();

}


function jsCallback(in_params, out_params) {
    var num = in_params[0];
    if ( num = 0 ){
        dayToNight();
    }
}


function cycleCarPaints(){

    switch(carPaintIndex % 4) {
        case 0:
            changeCarPaintBlue();
            break;
        case 1:
            changeCarPaintBlack();
            break;
        case 2:
            changeCarPaintWhite();
            break;
        case 3:
            changeCarPaintRed();
            break;
        default:
            changeCarPaintRed();
            break;
    }

    carPaintIndex++;

}

function changeCarPaintRed(){
    setCarPaintColorParameter("BaseColor",1,0,0);
    setCarPaintColorParameter("SecondaryColor",0.593,0,0);
    setCarPaintColorParameter("TertiaryColor", 0.176,0,0.011);
    setCarPaintFloatParameter("Intensity", 0.0);
    setCarPaintFloatParameter("RimColorFactor", 1);
    setCarPaintColorParameter("RimColor", 0.936,0.045,0.081);
    document.getElementById("paint-icon").src="\\en-ca\\images\\[NSX]_ribbonNav_icon_ValenciaRedPearl.png"
    document.getElementById("paint-name").innerHTML="Red";


}

function changeCarPaintBlue() {
    setCarPaintColorParameter("BaseColor",0.038,0.157,1);
    setCarPaintColorParameter("SecondaryColor",0.067,0.042,0.916);
    setCarPaintColorParameter("TertiaryColor", 0,0.002,0.588);
    setCarPaintFloatParameter("Intensity", 0.0);
    setCarPaintFloatParameter("RimColorFactor", 1);
    setCarPaintColorParameter("RimColor", 0.121,0.218,0.936);
    document.getElementById("paint-icon").src="\\en-ca\\images\\[NSX]_ribbonNav_icon_NouvelleBluePearl.png"
    document.getElementById("paint-name").innerHTML="Blue";

}

function changeCarPaintBlack(){
    setCarPaintColorParameter("BaseColor",0,0,0);
    setCarPaintColorParameter("SecondaryColor",0,0,0);
    setCarPaintColorParameter("TertiaryColor",1,1,1);
    setCarPaintFloatParameter("Intensity", 0.0);
    setCarPaintFloatParameter("RimColorFactor", 1);
    setCarPaintColorParameter("RimColor", 0.441,0.441,0.441);
    document.getElementById("paint-icon").src="\\en-ca\\images\\[NSX]_ribbonNav_icon_BerlinaBlack.png"
    document.getElementById("paint-name").innerHTML="Black";
    document.getElementById("paint-cost").innerHTML="0";
}
function changeCarPaintWhite(){
    setCarPaintColorParameter("BaseColor",0.5,0.5,0.5);
    setCarPaintColorParameter("SecondaryColor",1,1,1);
    setCarPaintColorParameter("TertiaryColor",1,1,1);
    setCarPaintFloatParameter("Intensity", 6);
    setCarPaintFloatParameter("RimColorFactor", 1);
    setCarPaintColorParameter("RimColor", 1,1,1);
    document.getElementById("paint-icon").src="\\en-ca\\images\\[NSX]_ribbonNav_icon_130RWhite.png"
    document.getElementById("paint-name").innerHTML="White";
}

function setCarPaintFloatParameter(parameterName, value) {
    for (var i = 0; i < objs.length; i++) {
        var objName = objs[i];
        var obj = m_scenes.get_object_by_name(objName);
        m_mat.set_nodemat_value(obj, [materialName, parameterName], value);
    }

}

function setCarPaintColorParameter(parameterName, r, g, b) {

    for (var i = 0; i < objs.length; i++) {
        var objName = objs[i];
        var obj = m_scenes.get_object_by_name(objName);
        m_mat.set_nodemat_rgb(obj, [materialName, parameterName], r, g, b);
    }

}


function dayToNight(){

    var dome = m_scenes.get_object_by_name("SKYDOME");
    var sun = m_scenes.get_object_by_name("Sun");
    var floor = m_scenes.get_object_by_name("FLOOR");
    var spot = m_scenes.get_object_by_name("Spot");


    m_lights.set_light_energy(sun,100);


    $.ease(
        1.0,
        0.0,
        3000,
        "swing",
        function () {
            var t = arguments[0];
            var t2 = easeInOutQuad(t, 0, 1, 1.5);
            var t3 = easeInOutQuad(t, -50, 100, 1);
            m_lights.set_light_energy(sun,t2);
            //m_lights.set_li
            m_mat.set_nodemat_value(dome, ["skydome", "Value"], t3 );
            m_mat.set_emit_factor(floor, "floor", t2);
        }

    );

}

var easeOutCirc = function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
};

// aousschalten
var easeOutQuart = function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

var easeOutQuad = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

var easeInOutQuad= function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
};
