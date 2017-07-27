"use strict";

b4w.register("nsx_main", function (exports, require){

    var m_app   = require("app");
    var m_data  = require("data");
    var m_logic = require("logic_nodes");
    var m_anim   = require("animation");
    var m_cfg    = require("config");
    var m_mat    = require("material");
    var m_obj    = require("objects");
    var m_scenes = require("scenes");
    var m_rgb    = require("rgb");
    var m_trans  = require("transform");
    var m_vec    = require("vec3");
    var m_main   = require("main");
    var m_camera = require("camera");
    var m_ctl    = require("controls");
    var m_time   = require("time");
    var m_util   = require("util");
    var m_container = require("container");

    var materialName = "spherepaint";
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
        "TrunkCutCover1",
        "polySurface28",
        "Object163",
        "transform31",
        "doors_frame",
        "TrunkMetalSideBarsBottom"
    ];

    exports.init = function() {

        m_app.init({
            canvas_container_id: "main_canvas_container",
            background_color: [0, 0, 0, 0],
            callback: load_cb
        });

    }

    function load_cb() {

        m_data.load("assets/BuildandPrice.json", loaded_cb);

    }

    function loaded_cb() {
        m_app.enable_camera_controls();

        //animateCarPaintMaterial();
        setCarPaintColorParameter("BaseColor",0,1,0);
        setCarPaintColorParameter("SecondaryColor",0,1,0);
        setCarPaintColorParameter("TertiaryColor", 0.071,1,0.00);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1.4);
        setCarPaintColorParameter("RimColor", 0.45,0.48,0.55);

    }

    function changeCarPaintRed(){}

    function changeCarPaintBlack(){}
    function changeCarPaintWhite(){}



    function changeCarPaintBlue() {
        setCarPaintColorParameter("BaseColor", 0.038, 0.157, 1);
        setCarPaintColorParameter("SecondaryColor", 0.067, 0.042, 0.916);
        setCarPaintColorParameter("TertiaryColor", 0, 0.002, 0.588);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 0.121, 0.218, 0.936);
        document.getElementById("paint-icon").src = "\\en-ca\\images\\[NSX]_ribbonNav_icon_NouvelleBluePearl.png"
        document.getElementById("paint-name").innerHTML = "Blue";

    }

    function animateCarPaintMaterial() {
        $.ease(
            -100,
            100,
            1000,
            "swing",
            function () {
                //log( arguments[0] );
                    var obj = m_scenes.get_object_by_name("SKYDOME");
                    var timeInSeconds = (new Date()).getTime() / 1000.0;
                    m_mat.set_nodemat_value(obj, ["skydome", "Value"],arguments[0] );
                }

        );
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

});

b4w.require("nsx_main").init();