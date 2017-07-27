"use strict";

b4w.register("embed_main", function(exports, require) {

    var m_anim        = require("animation");
    var m_app         = require("app");
    var m_camera      = require("camera");
    var m_camera_anim = require("camera_anim");
    var m_cfg         = require("config");
    var m_cont        = require("container");
    var m_ctl         = require("controls");
    var m_data        = require("data");
    var m_gp_conf     = require("gp_conf");
    var m_hmd         = require("hmd");
    var m_hmd_conf    = require("hmd_conf");
    var m_input       = require("input");
    var m_lights      = require("lights");
    var m_logic       = require("logic_nodes");
    var m_main        = require("main");
    var m_mat         = require("material");
    var m_obj         = require("objects");
    var m_preloader   = require("preloader");
    var m_rgb         = require("rgb");
    var m_scenes      = require("scenes");
    var m_screen      = require("screen");
    var m_scs         = require("scenes");
    var m_sfx         = require("sfx");
    var m_storage     = require("storage");
    var m_time        = require("time");
    var m_trans       = require("transform");
    var m_util        = require("util");
    var m_vec         = require("vec3");
    var m_version     = require("version");

    var BUILT_IN_SCRIPTS_ID      = "built_in_scripts";
    var DEFAULT_QUALITY          = "ULTRA";
    var DEFAULT_STEREO           = "NONE";
    var CAMERA_AUTO_ROTATE_SPEED = 0.3;

    var HIDE_MENU_DELAY          = 15000;
    var ANIM_ELEM_DELAY          = 150;
    var LOGO_SHOW_DELAY          = 300;
    var LOGO_HIDE_DELAY          = 300;
    var LOGO_CIRCLE_HIDE_DELAY   = 300;
    var CAPTION_SHOW_DELAY       = 300;
    var CAPTION_HIDE_DELAY       = 300;
    var MENU_BUTTON_SHOW_DELAY   = 300;
    var PRELOADER_HIDE_DELAY     = 300;

    var TWITTER_CHAR             = "t";
    var FB_CHAR                  = "f";
    var GOOGLE_CHAR              = "g";
    var VK_CHAR                  = "v";
    var WEIBO_CHAR               = "w";

    var _menu_close_func         = null;
    var _is_panel_open_top       = false;
    var _is_panel_open_left      = false;
    var _is_anim_top             = false;
    var _is_anim_left            = false;
    var _is_qual_menu_opened     = false;
    var _is_stereo_menu_opened   = false;
    var _is_help_menu_opened     = false;
    var _no_social               = false;
    var _socials                 = [];
    var _is_paint_menu_open      = false;
    var _is_interior_menu_open   = false;
    var _is_roof_menu_open       = false;
    var _is_headliner_menu_open  = false;
    var _is_wheels_menu_open     = false;
    var _is_aero_menu_open           = false;
    var _is_exteriorsports_menu_open = false;
    var _is_engine_menu_open         = false;
    var _is_interiorsports_menu_open = false;
    var _is_brakes_menu_open         = false;

    var _is_first_stage = false;
    var _is_second_stage = false;
    var _is_third_stage = false;

    var _circle_container;
    var _preloader_caption;
    var _first_stage;
    var _second_stage;
    var _third_stage;
    var _load_container;
    var _preloader_container;
    var _opened_button;
    var _logo_container;
    var _buttons_container;
    var _quality_buttons_container;
    var _stereo_buttons_container;
    var _help_info_container;
    var _help_button;
    var _hor_button_section;
    var _selected_object;
    var _stereo_mode;

    var _hor_paint_button_section;
    var _paint_selector_button;

    var _hor_interior_section;
    var _interior_selector_button;

    var _hor_roof_section;
    var _roof_selector_button;

    var _hor_headliner_section;
    var _headliner_selector_button;

    var _hor_wheels_section;
    var _wheels_selector_button;

    var _hor_aero_section;
    var _aero_selector_button;

    var _hor_exteriorsports_section;
    var _exteriorsports_selector_button;

    var _hor_engine_section;
    var _engine_selector_button;

    var _hor_interiorsports_section;
    var _interiorsports_selector_button;

    var _hor_brakes_section;
    var _brakes_selector_button;

    var _vec2_tmp = new Float32Array(2);

    var _pick = m_scs.pick_object;


    var wheelIndex = 0;
    
//everything needed for dynamic addition of the remove button
    //keep track of the option selected to to correct arithmetic 
   var currentOption = [
       0,  //seats     0
       0,  //wheels    1
       0,  //brakes    2
       0,  //exterior  3
       0,  //wing      4
       0,  //cover     5
       0,  //Liner     6
       0,  //interior  7
       0,  //audio     8
       0,  //carbon    9
       0,  //paint     10
       0]; //intCarb   11

   //pricing for the all options and accessories
   var optionsList=[
       [false,1500,2500, 0],   //seats     0
       [false, 1500, 0],       //wheels    1
       [false, 9900,10600, 0], //brakes    2
       [false,9000, 0],        //exterior  3
       [false,3000, 0],        //wing      4
       [false,3600, 0],        //cover     5
       [false,1300, 0],        //Liner     6
       [false,2900, 0],        //interior  7
       [false,2800, 3300, 0],  //audio     8
       [false, 6000, 0],       //carbon    9
       [false, 900, 7300 , 0], //paint     10
       [false, 3500, 0]];      //intCarb   11 

   var optionsTotal = 0.0;
   var totalCost = 189900.00;
   var accessoriesTotal = 0.0;
    
    var accessoriesList=[
        [false, 1900.00],           //Door Trim 0
        [false, 370.00],            //Battery   1
        [false, 62.50],             //Cargo     2
        [false, 1500.00],           //Mat       3
        [false, 555.00],            //CarCover  4
        [false, 210.87]];           //Nuts      5

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
        "Exterior_Back_TrunkCover",
        "Interior_Back_TunkFrameTop"
    ];

    var interiorObjs = [
        "left_door_interior_secundary_body",
        "seat_lowpart",
        "seat_white",
        "middle_main_body",
        "rigth_door_secundary_body001"
    ];

    var wheelRim1 = ["Wheel11Rim","Wheel12Rim","Wheel13Rim","Wheel14Rim"];
    var wheelRim2 = ["Wheel21Rim","Wheel22Rim","Wheel23Rim","Wheel24Rims"];


    var _player_buttons = [
        {type: "simple_button", id: "opened_button", callback: open_menu},

        {type: "simple_button", id: "help_button", callback: revTrigger},

        { type: "simple_button", id: "close_help", callback: close_help },

        { type: "simple_button", id: "wheel_button", callback: cycleWheelTrims },
        { type: "simple_button", id: "engine_button", callback: engineTrigger },
        { type: "simple_button", id: "gas_button", callback: revTrigger },
        { type: "simple_button", id: "camera_button", callback: cycleCamera },

        { type: "simple_button", id: "paint_selector_button", callback: open_menu_paint },
        { type: "simple_button", id: "paint_white_button", callback: changePaintWhite },
        { type: "simple_button", id: "paint_berlinablack_button", callback: changePaintBerlinaBlack },
        { type: "simple_button", id: "paint_curvared_button", callback: changePaintCurvaRed },
        { type: "simple_button", id: "paint_copsegreenmetalic_button", callback: changePaintCopseGreenMetalic },
        { type: "simple_button", id: "paint_nouvellebluepearl_button", callback: changePaintNouvelleBluePearl },
        { type: "simple_button", id: "paint_sourcesilvermetalic_button", callback: changePaintSourceSilverMetalic },
        { type: "simple_button", id: "paint_valenciaredpearl_button", callback: changePaintValenciaRedPearl },

        { type: "simple_button", id: "interior_selector_button", callback: open_menu_interior },
        { type: "simple_button", id: "interior_ebony_button", callback: changeInteriorEbony },
        { type: "simple_button", id: "interior_orchid_button", callback: changeInteriorOrchid },
        { type: "simple_button", id: "interior_red_button", callback: changeInteriorRed },
        { type: "simple_button", id: "interior_saddle_button", callback: changeInteriorSaddle },

        { type: "simple_button", id: "roof_selector_button", callback: open_menu_roof },
        { type: "simple_button", id: "roof_aluminum_button", callback: changeRoofAluminum },
        { type: "simple_button", id: "roof_aluminumxm_button", callback: changeRoofAluminumXM },
        { type: "simple_button", id: "roof_carbon_button", callback: changeRoofCarbon },
        { type: "simple_button", id: "roof_carbonxm_button", callback: changeRoofCarbonXM },

        { type: "simple_button", id: "headliner_selector_button", callback: open_menu_headliner },
        { type: "simple_button", id: "headliner_blacktricot_button", callback: changeHeadlinerBlacktricot },
        { type: "simple_button", id: "headliner_blackalcantra_button", callback: changeHeadlinerBlackAlcantra },

        { type: "simple_button", id: "wheels_selector_button", callback: open_menu_wheels },
        { type: "simple_button", id: "wheels_signaturey_button", callback: changeWheelsSignatureY },
        { type: "simple_button", id: "wheels_interwovenmachine_button", callback: changeWheelsInterwovenMachine },
        { type: "simple_button", id: "wheels_interwovenpainted_button", callback: changeWheelsInterwovenPainted },
        { type: "simple_button", id: "wheels_interwovenpolished_button", callback: changeWheelsInterwovenPolished },

        { type: "simple_button", id: "aero_selector_button", callback: open_menu_aero },
        { type: "simple_button", id: "aero_rearspoilerpainted_button", callback: changeAeroRearSpoilerPainted },
        { type: "simple_button", id: "aero_rearspoilercarbon_button", callback: changeAeroRearSpoilerCarbon },

        { type: "simple_button", id: "exteriorsports_selector_button", callback: open_menu_exteriorsports },
        { type: "simple_button", id: "exteriorsports_spoilerstandard_button", callback: changeExteriorSportsStandard },
        { type: "simple_button", id: "exteriorsports_spoilerstandardcarbon_button", callback: changeExteriorSportsStandardCarbon },

        { type: "simple_button", id: "engine_selector_button", callback: open_menu_engine },
        { type: "simple_button", id: "engine_regular_button", callback: changeEngineRegular },
        { type: "simple_button", id: "engine_carbon_button", callback: changeEngineCarbon },

        { type: "simple_button", id: "interiorsports_selector_button", callback: open_menu_interiorsports },
        { type: "simple_button", id: "interiorsports_standard_button", callback: changeInteriorSportsStandard },
        { type: "simple_button", id: "interiorsports_carbon_button", callback: changeInteriorSportsCarbon },

        { type: "simple_button", id: "brakes_selector_button", callback: open_menu_brakes },
        { type: "simple_button", id: "brakes_ceramicblack_button", callback: changeBrakesCeramicBlack },
        { type: "simple_button", id: "brakes_ceramicred_button", callback: changeBrakesCeramicRed },
        { type: "simple_button", id: "brakes_ceramicsilver_button", callback: changeBrakesCeramicSilver },


        {type:              "trigger_button",
         id:                "fullscreen_on_button",
         callback:          enter_fullscreen,
         replace_button_id: "fullscreen_off_button",
         replace_button_cb: exit_fullscreen},

        {type:              "trigger_button",
         id:                "play_button",
         callback:          engineTrigger,
         replace_button_id: "pause_button",
         replace_button_cb: engineTriggerStop},

        {type:              "trigger_button",
         id:                "auto_rotate_on_button",
         callback:          rotate_camera,
         replace_button_id: "auto_rotate_off_button",
         replace_button_cb: stop_camera},

        {type:              "trigger_button",
         id:                "sound_on_button",
         callback:          stop_music,
         replace_button_id: "sound_off_button",
         replace_button_cb: play_music},

        {
            type: "trigger_button",
            id: "music_button",
            callback: stop_sound,
            replace_button_id: "music_button",
            replace_button_cb: play_sound
        },

        {type:                   "menu_button",
         id:                     "stereo_buttons_container",
         callback:               open_stereo_menu,
         child_buttons_array_id: ["def_mode_button",
                                  "anag_mode_button",
                                  "hmd_mode_button"],
         child_buttons_array_cb: [
                     function(){change_stereo("NONE")},
                     function(){change_stereo("ANAGLYPH")},
                     function(){change_stereo("HMD")}]},

        {type:                   "menu_button",
         id:                     "quality_buttons_container",
         callback:               open_qual_menu,
         child_buttons_array_id: ["low_mode_button",
                                  "high_mode_button",
                                  "ultra_mode_button"],
        child_buttons_array_cb: [
            function () { change_quality(m_cfg.P_LOW) },
            function () { change_quality(m_cfg.P_HIGH) },
            function () { change_quality(m_cfg.P_ULTRA) }]}
    ]


    exports.init = function() {
        var is_debug = (m_version.type() == "DEBUG");
        var is_html = b4w.module_check(m_cfg.get("built_in_module_name"));

        var show_fps = false;
        var alpha = false;
        var dds_available = false;
        var min50_available = false;
        var url_params = m_app.get_url_params();
        var min_capabilities = false;
        var pvr_available = false;

        if (url_params && "compressed_textures" in url_params &&
                !is_html && !is_debug) {
            dds_available = true;
            min50_available = true;
            if ("compressed_textures_pvr" in url_params)
                pvr_available = true;
        }

        if (url_params && "show_fps" in url_params)
            show_fps = true;

        if (url_params && "no_social" in url_params)
            _no_social = true;

        if (url_params && "alpha" in url_params)
            alpha = true;

        if (url_params && url_params["load"])
            m_storage.init("b4w_webplayer:" + url_params["load"]);
        else
            m_storage.init("b4w_webplayer:" + window.location.href);

        if (url_params && "min_capabilities" in url_params)
            min_capabilities = true;

        if (url_params && "socials" in url_params) {
            var socials = url_params["socials"].split("");

            _socials = socials.filter(function (value, index, array) {
                return array.indexOf(value) == index;
            })
        }

        set_stereo_config();
        set_quality_config();

        if (!alpha)
            m_cfg.set("background_color", [0.0, 0.0, 0.0, 1.0]);
            //m_cfg.set("background_color", [0.224, 0.224, 0.224, 1.0]);

        // disable physics in HTML version
        m_app.init({
            canvas_container_id: "main_canvas_container",
            callback: init_cb,
            gl_debug: is_debug,
            physics_enabled: !is_html,
            show_fps: show_fps,
            report_init_failure: false,
            console_verbose: is_debug,
            error_purge_elements: ['control_panel'],
            alpha: alpha,
            key_pause_enabled: false,
            fps_elem_id: "fps_container",
            fps_wrapper_id: "fps_wrapper",
            assets_pvr_available: pvr_available,
            assets_dds_available: dds_available,
            assets_min50_available: min50_available,
            min_capabilities: min_capabilities
        })
    }

    function init_cb(canvas_element, success) {
        cache_dom_elems();

        if (!success) {
            display_no_webgl_bg();
            return;
        }

        m_main.pause();

        add_engine_version();

        check_fullscreen();

        set_quality_button();

        set_stereo_button();

        init_control_buttons();

        prepare_soc_btns();

        m_gp_conf.update();

        var file = search_file();

        if (!file)
            return;

        anim_logo(file);


        window.addEventListener("resize", on_resize);

        on_resize();
    }

    function prepare_soc_btns() {
        var socials = _socials;

        if (!socials.length)
            return;

        var char_btns_array = [TWITTER_CHAR, FB_CHAR, GOOGLE_CHAR, VK_CHAR, WEIBO_CHAR];

        socials = socials.filter(function(value, index, array) {
              return char_btns_array.indexOf(value) >= 0;
        })

        if (!socials.length)
            return;

        var elem_ids = ["tw_button", "fb_button", "g_button", "vk_button", "weibo_button"];

        var ordered_elem_ids = [];
        var removing_elem_ids = [];


        for (var i = 0; i < socials.length; i++) {
            switch (socials[i]) {
            case TWITTER_CHAR:
                ordered_elem_ids.push("tw_button");
                break;
            case FB_CHAR:
                ordered_elem_ids.push("fb_button");
                break;
            case GOOGLE_CHAR:
                ordered_elem_ids.push("g_button");
                break;
            case VK_CHAR:
                ordered_elem_ids.push("vk_button");
                break;
            case WEIBO_CHAR:
                ordered_elem_ids.push("weibo_button");
                break;
            }
        }

        for (var i = 0; i < elem_ids.length; i++) {
            if (ordered_elem_ids.indexOf(elem_ids[i]) < 0) {
                removing_elem_ids.push(elem_ids[i])
            }
        }

        for (var i = 0; i < removing_elem_ids.length; i++) {
            var elem = document.getElementById(removing_elem_ids[i]);

            elem.parentElement.removeChild(elem);
        }

        var children = document.querySelector("#vert_section_button").children;

        var ar = [];

        ar.slice.call(children).sort(function(a, b) {
            return ordered_elem_ids.indexOf(a.id) - ordered_elem_ids.indexOf(b.id);
        }).forEach(function(next){
                document.querySelector("#vert_section_button").appendChild(next);
        })
    }

    function display_no_webgl_bg() {
        var url_params = m_app.get_url_params(true);

        if (url_params && url_params["fallback_image"]) {
            var image_wrapper = document.createElement("div");
            image_wrapper.className = "image_wrapper";
            document.body.appendChild(image_wrapper);
            _preloader_container.style.display = "none";
            image_wrapper.style.backgroundImage = 'url(' + url_params["fallback_image"] + ')';
        } else if (url_params && url_params["fallback_video"]) {
            var video_wrapper = document.createElement("div");
            var video_elem = document.createElement("video");

            video_wrapper.className = "video_wrapper";
            video_wrapper.appendChild(video_elem);

            video_elem.autoplay = true;

            for (var i = 0; i < url_params["fallback_video"].length; i++) {
                var source = document.createElement("source");
                source.src = url_params["fallback_video"][i];

                video_elem.appendChild(source);
            }

            document.body.appendChild(video_wrapper);
            _preloader_container.style.display = "none";
        } else
            report_app_error("Browser could not initialize WebGL", "For more info visit",
                          "https://www.blend4web.com/doc/en/problems_and_solutions.html#problems-upon-startup");
    }

    function cache_dom_elems() {
        _circle_container               = document.querySelector("#circle_container");
        _preloader_caption              = document.querySelector("#preloader_caption");
        _first_stage                    = document.querySelector("#first_stage");
        _second_stage                   = document.querySelector("#second_stage");
        _third_stage                    = document.querySelector("#third_stage");
        _load_container                 = document.querySelector("#load_container");
        _preloader_container            = document.querySelector("#preloader_container");
        _opened_button                  = document.querySelector("#opened_button");
        _logo_container                 = document.querySelector("#logo_container");
        _buttons_container              = document.querySelector("#buttons_container");
        _quality_buttons_container      = document.querySelector("#quality_buttons_container");
        _stereo_buttons_container       = document.querySelector("#stereo_buttons_container");
        _help_info_container            = document.querySelector("#help_info_container");
        _help_button                    = document.querySelector("#help_button");
        _hor_button_section             = document.querySelector("#hor_button_section");
        _hor_paint_button_section       = document.querySelector("#hor_paint_section");
        _paint_selector_button          = document.querySelector("#paint_selector_button");
        _hor_interior_section           = document.querySelector("#hor_interior_section");
        _interior_selector_button       = document.querySelector("#interior_selector_button");
        _hor_roof_section               = document.querySelector("#hor_roof_section");
        _roof_selector_button           = document.querySelector("#roof_selector_button");
        _hor_headliner_section          = document.querySelector("#hor_headliner_section");
        _headliner_selector_button      = document.querySelector("#headliner_selector_button");
        _hor_wheels_section             = document.querySelector("#hor_wheels_section");
        _wheels_selector_button         = document.querySelector("#wheels_selector_button");
        _hor_aero_section               = document.querySelector("#hor_aero_section");
        _aero_selector_button           = document.querySelector("#aero_selector_button");
        _hor_exteriorsports_section     = document.querySelector("#hor_exteriorsports_section");
        _exteriorsports_selector_button = document.querySelector("#exteriorsports_selector_button");
        _hor_engine_section             = document.querySelector("#hor_engine_section");
        _engine_selector_button         = document.querySelector("#engine_selector_button");
        _hor_interiorsports_section     = document.querySelector("#hor_interiorsports_section");
        _interiorsports_selector_button = document.querySelector("#interiorsports_selector_button");
        _hor_brakes_section             = document.querySelector("#hor_brakes_section");
        _brakes_selector_button         = document.querySelector("#brakes_selector_button");

    }

    function add_engine_version() {
        var version_cont = document.querySelector("#rel_version");
        var version = m_version.version_str();

        if (version)
            version_cont.innerHTML = m_version.version_str();
    }

    function check_fullscreen() {
        var fullscreen_on_button = document.querySelector("#fullscreen_on_button");

        if (!m_screen.check_fullscreen() && !m_screen.check_fullscreen_hmd())
            fullscreen_on_button.parentElement.removeChild(fullscreen_on_button);
    }

    function check_autorotate() {
        var autorotate_on_button = document.querySelector("#auto_rotate_on_button");

        if (!m_camera_anim.check_auto_rotate())
            autorotate_on_button.parentElement.removeChild(autorotate_on_button);
    }

    function set_quality_button() {
        var quality = m_storage.get("quality");

        if (!quality || quality == "CUSTOM") {
            quality = DEFAULT_QUALITY;
            m_storage.set("quality", quality);
        }

        _quality_buttons_container.className = "control_panel_button";

        switch (quality) {
        case "LOW":
            _quality_buttons_container.classList.add("low_mode_button");
            break;
        case "HIGH":
            _quality_buttons_container.classList.add("high_mode_button");
            break;
        case "ULTRA":
            _quality_buttons_container.classList.add("ultra_mode_button");
            break;
        }
    }

    function set_stereo_button(stereo) {
        stereo = stereo || m_storage.get("stereo") || DEFAULT_STEREO;

        _stereo_buttons_container.className = "control_panel_button";

        switch (stereo) {
        case "NONE":
            _stereo_buttons_container.classList.add("def_mode_button");
            break;
        case "ANAGLYPH":
            _stereo_buttons_container.classList.add("anag_mode_button");
            break;
        case "HMD":
            _stereo_buttons_container.classList.add("hmd_mode_button");
            break;
        }
    }

    function init_control_buttons() {
        window.oncontextmenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        init_links();

        for (var i = 0; i < _player_buttons.length; i++) {
            var button = _player_buttons[i];

            var elem = document.getElementById(button.id);

            if (!elem)
                continue;

            add_hover_class_to_button(elem);

            (function(button) {
                m_input.add_click_listener(elem, function(e) {
                    button.callback(e, button);
                });
            })(button);
        }
    }

    function init_links() {
        var button_links = document.querySelectorAll(".control_panel_button a");

        for (var i = 0; i < button_links.length; i++) {
            var link = button_links[i];

            if (link.hasAttribute("href"))
                link.href += document.location.href;

            add_hover_class_to_button(link.parentNode);
        }
    }

    function search_file() {
        return "assets/BuildandPrice.json";
    }

    function anim_logo(file) {
        m_app.css_animate(_logo_container, "opacity", 0, 1, LOGO_SHOW_DELAY, "", "", function() {
            _preloader_caption.style.display = "block";
            m_app.css_animate(_preloader_caption, "opacity", 0, 1, CAPTION_SHOW_DELAY, "", "", function() {
                m_main.resume();
                m_data.load(file, loaded_callback, preloader_callback, false);
            });
        });
    }

    function open_help() {
        if (is_anim_in_process())
            return;

        if (m_main.detect_mobile())
            _help_info_container.className = "touch";
        else
            _help_info_container.className = "";

        _help_info_container.style.display = "block";
        _help_button.style.display = "none";
        _is_help_menu_opened = true;
    }

    function close_help(is_cb) {
        if (!_is_help_menu_opened)
            return;

        _help_info_container.style.display = "none";
        _help_button.style.display = "block";
        _is_help_menu_opened = false;
    }

    function get_button_object_from_id(elem_id) {
        for (var i = 0; i < _player_buttons.length; i++)
            if (_player_buttons[i].id == elem_id)
                return _player_buttons[i];

        return null;
    }

    function add_hover_class_to_button(elem) {
        if (!elem)
            return;

        if (m_main.detect_mobile()) {
            elem.addEventListener("touchstart", function() {
                elem.classList.add("hover");
                clear_deferred_close();
            });
            elem.addEventListener("touchend", function() {
                elem.classList.remove("hover");
                deferred_close();
            });
        } else {
            elem.addEventListener("mouseenter", function() {
                elem.classList.add("hover");
            });

            elem.addEventListener("mouseout", function(e) {
                elem.classList.remove("hover");
            });
        }
    }

    function rotate_camera(e) {
        if (is_anim_in_process())
            return;

        if (e)
            var elem = e.target
        else
            var elem = document.querySelector("#auto_rotate_on_button");

        m_camera_anim.auto_rotate(CAMERA_AUTO_ROTATE_SPEED, function(){
            if (elem)
                update_button(elem);
        });

        if (elem)
            update_button(elem);

        if (m_main.is_paused()) {
            resume_engine();
            update_play_pause_button();
        }
    }

    function stop_camera(e) {
        if (is_anim_in_process())
            return;

        m_camera_anim.auto_rotate(CAMERA_AUTO_ROTATE_SPEED);

        if (e)
            update_button(e.target);
    }

    function play_sound(e) {
        if (is_anim_in_process())
            return;

        m_sfx.mute(null, false);
        update_button(e.target);
    }

    function stop_sound(e) {
        if (is_anim_in_process())
            return;

        m_sfx.mute(null, true);
        update_button(e.target);
    }

    function pause_engine(e) {
        if (is_anim_in_process())
            return;

        m_main.pause();

        if (e)
            update_button(e.target);

        if (m_camera_anim.is_auto_rotate()) {
            stop_camera();
            update_auto_rotate_button();
        }
    }

    function resume_engine(e) {
        if (is_anim_in_process())
            return;

        m_main.resume();

        if (e)
            update_button(e.target);
    }

    function enter_fullscreen(e) {
        if (is_anim_in_process())
            return;

        if (!m_screen.check_fullscreen_hmd())
            m_screen.request_fullscreen(document.body, fullscreen_cb, fullscreen_cb);
        else
            m_screen.request_fullscreen_hmd(document.body, fullscreen_cb, fullscreen_cb);
    }

    function exit_fullscreen() {
        if (is_anim_in_process())
            return;

        if (!m_screen.check_fullscreen_hmd())
            m_screen.exit_fullscreen();
        else
            m_screen.exit_fullscreen_hmd();
    }

    function fullscreen_cb(e) {
        if (!check_cursor_position("buttons_container") && _is_anim_left)
            deferred_close();

        var fullscreen_button = document.querySelector("#fullscreen_on_button") ||
                                document.querySelector("#fullscreen_off_button");

        if (fullscreen_button)
            update_button(fullscreen_button);
    }

    function update_button(elem) {
        var old_elem_id = elem.id;
        var button = get_button_object_from_id(elem.id);
        var old_callback = button.callback;

        elem.id = button.id = button.replace_button_id;
        button.replace_button_id = old_elem_id;

        if (!check_cursor_position(elem.id))
            elem.classList.remove("hover");

        button.callback = button.replace_button_cb;
        button.replace_button_cb = old_callback;
    }


    // update_selector_button (id_target, classname_to_add)
    function update_selector_button(elem, elem2){
        var target = document.getElementById(elem.id);
        var source = document.getElementById(elem2.id);

        target.className = "";
        target.classList.add("control_panel_button");
        target.classList.add(elem2.id);

    }

    function update_play_pause_button() {
        var elem = document.querySelector("#play_button") ||
                   document.querySelector("#pause_button");

        if (elem)
            update_button(elem);
    }

    function update_auto_rotate_button() {
        var elem = document.querySelector("#auto_rotate_on_button") ||
                   document.querySelector("#auto_rotate_off_button");

        if (elem)
            update_button(elem);
    }

    function check_cursor_position(elem_id) {
        var hover = false;

        if (document.querySelectorAll) {
            var elems = document.querySelectorAll( ":hover" );

            for (var i = 0; i < elems.length; i++) {
                if (elems[i].id == elem_id) {
                    hover = true;
                    break;
                }
            }
        }

        return hover;
    }

    function close_menu() {

        if (is_anim_in_process())
            return;

        _buttons_container.removeEventListener("mouseleave", deferred_close);
        _buttons_container.removeEventListener("mouseenter", clear_deferred_close);
        document.body.removeEventListener("touchmove", deferred_close);

        close_qual_menu();
        close_stereo_menu();

        // Close menus
        if(_is_paint_menu_open)
            close_menu_paint();

        if(_is_interior_menu_open)
            close_menu_interior();

        if(_is_roof_menu_open)
            close_menu_roof();

        close_menu_headliner();
        close_menu_wheels();
        close_menu_aero();
        close_menu_exteriorsports();
        close_menu_engine();
        close_menu_interiorsports();
        close_menu_brakes();


        var hor_elem  = document.querySelector("#help_button");
        var vert_elem = document.querySelector("#vert_section_button").firstElementChild;

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {
                if (elem.previousElementSibling && elem.previousElementSibling.id != "opened_button")
                    drop_left(elem.previousElementSibling);
                else {
                    setTimeout(function() {
                        _is_anim_left = false;
                        _is_panel_open_left = false;
                        check_anim_end();
                        _hor_button_section.style.display = "";

                    }, 100);

                    return;
                }
            });
        }

        var drop_top = function(elem) {
            _is_anim_top = true;

            m_app.css_animate(elem, "marginBottom", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {
                if (elem.nextElementSibling && elem.nextElementSibling.id != "opened_button")
                    drop_top(elem.nextElementSibling);
                else {
                    setTimeout(function() {
                        _is_anim_top = false;
                        _is_panel_open_top = false;
                        check_anim_end();
                    }, 100);

                    return;
                }
            });
        }

        drop_left(hor_elem);

        if (!_no_social)
            drop_top(vert_elem);
    }


    function open_menu_paint(){

        if(_is_paint_menu_open)
            return;


        var hor_elem = document.querySelector("#paint_white_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        _is_paint_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        _hor_paint_button_section.style.display = "block";

        drop_left(hor_elem);
    }

    function close_menu_paint(){

        if(!_is_paint_menu_open)
            return;


        _is_paint_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#paint_valenciaredpearl_button");


        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                    drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);

    }


    function open_menu_interior() {
        if(_is_interior_menu_open)
            return;

        var hor_elem = document.querySelector("#interior_ebony_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        _is_interior_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        _hor_interior_section.style.display = "block";

        drop_left(hor_elem);

    }

    function close_menu_interior() {
        if(!_is_interior_menu_open)
            return;

        _is_interior_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#interior_saddle_button");


        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);

    }

    function open_menu_roof() {

        // Check if the menu state is already open
        if(_is_roof_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#roof_aluminum_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_roof_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_roof_section.style.display = "block";

        drop_left(hor_elem);


    }
    function close_menu_roof() {
        // Check if menu state is already closed
        if(!_is_roof_menu_open)
            return;

        // Set the menu state to false
        _is_roof_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#roof_carbonxm_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);


    }

    function open_menu_headliner() {
        // Check if the menu state is already open
        if(_is_headliner_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#headliner_blacktricot_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_headliner_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_headliner_section.style.display = "block";

        drop_left(hor_elem);
    }

    function close_menu_headliner() {
        // Check if menu state is already closed
        if(!_is_headliner_menu_open)
            return;

        // Set the menu state to false
        _is_headliner_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#headliner_blackalcantra_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);

    }

    function open_menu_wheels() {
        // Check if the menu state is already open
        if(_is_wheels_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#wheels_signaturey_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_wheels_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_wheels_section.style.display = "block";

        drop_left(hor_elem);

    }

    function close_menu_wheels() {
        // Check if menu state is already closed
        if(!_is_wheels_menu_open)
            return;

        // Set the menu state to false
        _is_wheels_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#wheels_interwovenpolished_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);
    }

    function open_menu_aero() {
        // Check if the menu state is already open
        if(_is_aero_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#aero_rearspoilerpainted_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_aero_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_aero_section.style.display = "block";

        drop_left(hor_elem);
    }

    function close_menu_aero() {
        // Check if menu state is already closed
        if(!_is_aero_menu_open)
            return;

        // Set the menu state to false
        _is_aero_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#aero_rearspoilercarbon_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);
    }

    function open_menu_exteriorsports() {
        // Check if the menu state is already open
        if(_is_exteriorsports_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#exteriorsports_spoilerstandard_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_exteriorsports_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_exteriorsports_section.style.display = "block";

        drop_left(hor_elem);
    }

    function close_menu_exteriorsports() {
        // Check if menu state is already closed
        if(!_is_exteriorsports_menu_open)
            return;

        // Set the menu state to false
        _is_exteriorsports_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#exteriorsports_spoilerstandardcarbon_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);
    }

    function open_menu_engine() {
        // Check if the menu state is already open
        if(_is_engine_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#engine_regular_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_engine_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_engine_section.style.display = "block";

        drop_left(hor_elem);
    }

    function close_menu_engine() {
        // Check if menu state is already closed
        if(!_is_engine_menu_open)
            return;

        // Set the menu state to false
        _is_engine_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#engine_carbon_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);
    }

    function open_menu_interiorsports() {
        // Check if the menu state is already open
        if(_is_interiorsports_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#interiorsports_standard_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_interiorsports_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_interiorsports_section.style.display = "block";

        drop_left(hor_elem);
    }

    function close_menu_interiorsports() {
        // Check if menu state is already closed
        if(!_is_interiorsports_menu_open)
            return;

        // Set the menu state to false
        _is_interiorsports_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#interiorsports_carbon_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);
    }

    function open_menu_brakes() {
        // Check if the menu state is already open
        if(_is_brakes_menu_open)
            return;

        // Select the first UI element
        var hor_elem = document.querySelector("#brakes_ceramicblack_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        // Set the menu state to True
                        _is_brakes_menu_open = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        // Make the UI section visible
        _hor_brakes_section.style.display = "block";

        drop_left(hor_elem);

    }

    function close_menu_brakes() {
        // Check if menu state is already closed
        if(!_is_brakes_menu_open)
            return;

        // Set the menu state to false
        _is_brakes_menu_open = false;

        // Select the last div element first
        var hor_elem  = document.querySelector("#brakes_ceramicsilver_button");

        var drop_left = function(elem) {
            _is_anim_left = true;

            m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");

            m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {

                drop_left(elem.previousElementSibling);

            });
        }

        drop_left(hor_elem);

    }


    function open_menu() {
        clear_deferred_close();

        if (is_anim_in_process())
            return;

        disable_opened_button();

        if (is_control_panel_opened()) {
            close_menu();
           return;
        }

        var hor_elem = document.querySelector("#fullscreen_on_button") ||
                       document.querySelector("#fullscreen_off_button") ||
                       document.querySelector("#quality_buttons_container");


        var vert_elem = document.querySelector("#vert_section_button").lastElementChild;

        var drop_left = function(elem) {
            _is_anim_left = true;

            elem.style.marginRight = "-45px";

            if ((elem.id == "help_button") &&
                    _is_help_menu_opened) {

                setTimeout(function() {
                    _is_anim_left = false;
                    _is_panel_open_left = true;
                    check_anim_end();
                }, 100);

                return;
            }

            elem.style.display = "block";

            m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.nextElementSibling) {
                    setTimeout(function() {
                        _is_anim_left = false;
                        _is_panel_open_left = true;
                        check_anim_end();
                    }, 100);

                    return;
                }

                drop_left(elem.nextElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        var drop_top = function(elem) {
            _is_anim_top = true;

            elem.style.marginBottom = "-45px";
            elem.style.display = "block";

            m_app.css_animate(elem, "marginBottom", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {

                if (!elem.previousElementSibling) {
                    setTimeout(function() {
                        _is_anim_top = false;
                        _is_panel_open_top = true;
                        check_anim_end();
                    }, 100);
                    return;
                }

                drop_top(elem.previousElementSibling)
            });

            m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
        }

        _hor_button_section.style.display = "block";
        _hor_paint_button_section.style.display = "block";

        drop_left(hor_elem);

        if (!_no_social)
            drop_top(vert_elem);

        if (m_main.detect_mobile())
            document.body.addEventListener("touchmove", deferred_close);
        else {
            _buttons_container.addEventListener("mouseleave", deferred_close);
            _buttons_container.addEventListener("mouseenter", clear_deferred_close);
        }
    }

    function check_anim_end() {
        if (!is_anim_in_process()) {
            enable_opened_button();

            if ((!check_cursor_position("buttons_container") &&
                    is_control_panel_opened()) ||
                    (m_main.detect_mobile() && is_control_panel_opened()))
                deferred_close();
        }
    }

    function is_anim_in_process() {
        return _is_anim_top || _is_anim_left;
    }

    function is_control_panel_opened() {
        return _is_panel_open_top || _is_panel_open_left;
    }

    function disable_opened_button() {
        m_input.remove_click_listener(_opened_button, open_menu);
    }

    function enable_opened_button() {
        m_input.add_click_listener(_opened_button, open_menu);
    }


    function deferred_close(e) {
        if (is_anim_in_process())
            return;

        clear_deferred_close();

        _menu_close_func = setTimeout(close_menu, HIDE_MENU_DELAY);
    }

    function clear_deferred_close() {
        clearTimeout(_menu_close_func);
    }

    function close_qual_menu(e) {
        if (is_anim_in_process())
            return;

        if (!_is_qual_menu_opened)
            return;

        _is_qual_menu_opened = false;

        if (e) {
            e.stopPropagation();
            var active_elem = e.target;
        } else
            var active_elem = document.querySelectorAll(".active_elem_q")[0];

        _quality_buttons_container.style.marginRight = "0px";

        for (var i = 0, child = _quality_buttons_container.children; i < child.length; i++) {
            child[i].style.display = "none";
            child[i].style.opacity = 0;
        }

        _quality_buttons_container.className = "control_panel_button " + active_elem.id;
    }

    function close_stereo_menu(e) {
        if (is_anim_in_process())
            return;

        if (!_is_stereo_menu_opened)
            return;

        _is_stereo_menu_opened = false;

        if (e) {
            e.stopPropagation();
            var active_elem = e.target;
        } else
            var active_elem = document.querySelectorAll(".active_elem_s")[0];

        _stereo_buttons_container.style.marginRight = "0px";

        for (var i = 0, child = _stereo_buttons_container.children; i < child.length; i++) {
            child[i].style.display = "none";
            child[i].style.opacity = 0;
        }

        _stereo_buttons_container.className = "control_panel_button " + active_elem.id;
    }

    function open_qual_menu(e, button) {
        if (is_anim_in_process())
            return;

        close_stereo_menu();

        _is_qual_menu_opened = true;

        _quality_buttons_container.style.marginRight = "-30px";

        var child_id = button.child_buttons_array_id;
        var child_cb = button.child_buttons_array_cb;

        for (var i = 0; i < child_id.length; i++) {
            var child_elem = document.getElementById(child_id[i]);

            if (!_quality_buttons_container.classList.contains(child_id[i]))
                m_input.add_click_listener(child_elem, child_cb[i]);
            else {
                child_elem.className = "active_elem_q";

                m_input.add_click_listener(child_elem, close_qual_menu);
            }
        }

        _quality_buttons_container.className = "quality_buttons_container";

        for (var i = 0, child = _quality_buttons_container.children; i < child.length; i++) {
            child[i].style.display = "block";
            child[i].style.opacity = 1;
        }
    }

    function open_stereo_menu(e, button) {
        if (is_anim_in_process())
            return;

        close_qual_menu();

        _is_stereo_menu_opened = true;

        _stereo_buttons_container.style.marginRight = "-30px";

        var child_id = button.child_buttons_array_id;
        var child_cb = button.child_buttons_array_cb;

        for (var i = 0; i < child_id.length; i++) {
            var child_elem = document.getElementById(child_id[i]);

            if (!child_elem)
                continue;

            if (!_stereo_buttons_container.classList.contains(child_id[i])) {
                child_elem.className = "qual_button";

                m_input.add_click_listener(child_elem, child_cb[i]);
            } else {
                child_elem.className = "active_elem_s";

                m_input.add_click_listener(child_elem, close_stereo_menu);
            }
        }

        var no_hmd = "";

        if (!m_input.can_use_device(m_input.DEVICE_HMD))
            no_hmd = "no_hmd";

        _stereo_buttons_container.className = "stereo_buttons_container " + no_hmd;

        for (var i = 0, child = _stereo_buttons_container.children; i < child.length; i++) {
            child[i].style.display = "block";
            child[i].style.opacity = 1;
        }
    }

    function on_resize() {
        m_cont.resize_to_container();
    }

    function get_selected_object() {
        return _selected_object;
    }

    function set_selected_object(obj) {
        _selected_object = obj;
    }

    function mouse_cb() {
        if (!m_scs.can_select_objects())
            return;

        var canvas_elem = m_cont.get_canvas();
        var mdevice = m_input.get_device_by_type_element(m_input.DEVICE_MOUSE, canvas_elem);
        var loc = m_input.get_vector_param(mdevice, m_input.MOUSE_LOCATION, _vec2_tmp);
        main_canvas_clicked(loc[0], loc[1]);
    }

    function touch_cb(touches) {
        if (!m_scs.can_select_objects())
            return;

        for (var i = 0; i < touches.length; i++)
            main_canvas_clicked(touches[i].clientX, touches[i].clientY);
    }

    function register_canvas_click() {
        var canvas_elem = m_cont.get_canvas();
        var mdevice = m_input.get_device_by_type_element(m_input.DEVICE_MOUSE, canvas_elem);

        if (mdevice)
            m_input.attach_param_cb(mdevice, m_input.MOUSE_DOWN_WHICH, mouse_cb);

        var tdevice = m_input.get_device_by_type_element(m_input.DEVICE_TOUCH, canvas_elem);

        if (tdevice)
            m_input.attach_param_cb(tdevice, m_input.TOUCH_START, touch_cb);
    }

    function main_canvas_clicked(x, y) {
        var prev_obj = get_selected_object();

        if (prev_obj && m_scs.outlining_is_enabled(prev_obj))
            m_scs.clear_outline_anim(prev_obj);

        var obj = _pick(x, y);
        set_selected_object(obj);
    }

    function loaded_callback(data_id, success) {
        if (!success) {
            report_app_error("Could not load the scene",
                    "For more info visit",
                    "https://www.blend4web.com/doc/en/web_player.html#scene-errors");

            return;
        }

        register_canvas_click();

        check_autorotate();

        m_app.enable_camera_controls();
        m_main.set_render_callback(render_callback);
        on_resize();

        var mouse_move  = m_ctl.create_mouse_move_sensor();
        var mouse_click = m_ctl.create_mouse_click_sensor();

        var canvas_cont = m_cont.get_container();

        function move_cb() {
            canvas_cont.className = "move";
        }

        function stop_cb(obj, id, pulse) {
            if (pulse == -1)
                canvas_cont.className = "";
        }

        m_ctl.create_sensor_manifold(null, "MOUSE_MOVE", m_ctl.CT_SHOT,
                [mouse_click, mouse_move], function(s) {return s[0] && s[1]}, move_cb);

        m_ctl.create_sensor_manifold(null, "MOUSE_STOP", m_ctl.CT_TRIGGER,
                [mouse_click], function(s) {return s[0]}, stop_cb);

        var url_params = m_app.get_url_params();

        if (url_params && "autorotate" in url_params)
            rotate_camera();

        var meta_tags = m_scs.get_meta_tags();

        if (meta_tags.title)
            document.title = meta_tags.title;

        check_hmd();



    }

    function check_hmd() {
        var hmd_mode_button = document.querySelector("#hmd_mode_button");

        if (!m_input.can_use_device(m_input.DEVICE_HMD)) {
            hmd_mode_button.parentElement.removeChild(hmd_mode_button);
        }
    }

    function preloader_callback(percentage, load_time) {
        _preloader_caption.innerHTML = percentage + "%";

        if (percentage < 33) {
            if (!_is_first_stage) {
                _is_first_stage = true
                _circle_container.style.display = "none";
            }

            _first_stage.style.width = percentage * 4.7 + "px";
            _circle_container.style.webkitTransform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
            _circle_container.style.transform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
        } else if (percentage < 66) {
            if (!_is_second_stage) {
                _is_second_stage = true
                _first_stage.style.width = 142 + "px";
                _second_stage.style.backgroundColor = "#990000";
                _second_stage.style.marginTop = "135px";
            }

            if (135 - (percentage - 33) * 4.5 > 0)
                _second_stage.style.marginTop = 135 - (percentage - 33) * 3.5 + "px";

            _circle_container.style.webkitTransform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
            _circle_container.style.transform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
        } else if (percentage != 100) {
            if (!_is_third_stage) {
                _is_third_stage = true;
                _second_stage.style.marginTop = "0px";
                _third_stage.style.backgroundColor = "#990000";
                _third_stage.style.height = "0px";
            }

            if (percentage > 75)
                _third_stage.style.height = (percentage * 0.1) + "px";

            _circle_container.style.webkitTransform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
            _circle_container.style.transform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
        }

        if (percentage == 100) {
            if (!m_sfx.get_speaker_objects().length) {
                var sound_on_button = document.querySelector("#sound_on_button");

                sound_on_button.parentElement.removeChild(sound_on_button);
            }

            _first_stage.parentElement.removeChild(_first_stage)
            _second_stage.parentElement.removeChild(_second_stage)
            _third_stage.parentElement.removeChild(_third_stage)
            _circle_container.parentElement.removeChild(_circle_container)
            _load_container.style.backgroundColor = "#990000";

            var preloader_caption = {
                elem:     _preloader_caption,
                duration: CAPTION_HIDE_DELAY
            }

            var load_container = {
                elem:     _load_container,
                duration: LOGO_CIRCLE_HIDE_DELAY,
                cb:       function() {
                    _opened_button.style.display = "block";
                    m_app.css_animate(_opened_button, "transform",
                                      0, 1, MENU_BUTTON_SHOW_DELAY,
                                      "scale(", ")");
                }
            }

            var logo_container = {
                elem:     _logo_container,
                duration: LOGO_HIDE_DELAY
            }

            var preloader_container = {
                elem:     _preloader_container,
                duration: PRELOADER_HIDE_DELAY,
                cb:     function() {
                    _preloader_container.parentElement.removeChild(_preloader_container);
                    open_menu();
                }
            }

            var common_obj = {
                type:     "css",
                prop:     "opacity",
                from:     1,
                to:       0
            }

            var array = [preloader_caption,
                         load_container,
                         logo_container,
                         preloader_container];

            extend_objs_props(array, common_obj);

            m_app.queue_animate(array);
        }
    }

    function extend_objs_props(objs, common_obj) {
        for (var i = objs.length; i--;)
            for (var prop in common_obj)
                objs[i][prop] = common_obj[prop];
    }

    function render_callback(elapsed, current_time) {}

    function remove_built_in_scripts() {
        var scripts = document.getElementById(BUILT_IN_SCRIPTS_ID);

        scripts.parentElement.removeChild(scripts);
    }

    function change_quality(qual) {
        var cur_quality = m_cfg.get("quality");

        if (cur_quality == qual)
            return;

        switch (qual) {
        case m_cfg.P_LOW:
            var quality = "LOW";
            break;
        case m_cfg.P_HIGH:
            var quality = "HIGH";
            break;
        case m_cfg.P_ULTRA:
            var quality = "ULTRA";
            break;
        }

        m_storage.set("quality", quality);

        reload_app();
    }

    function change_stereo(stereo) {
        deferred_close();

        if (_stereo_mode == stereo)
            return;

        switch (stereo) {
        case "NONE":
            m_storage.set("stereo", "NONE");
            if (_stereo_mode == "ANAGLYPH")
                reload_app()
            else {
                m_hmd.disable_hmd();
                _pick = m_scs.pick_object;
            }
            break;
        case "ANAGLYPH":
            m_storage.set("stereo", "ANAGLYPH");
            reload_app()
            break;
        case "HMD":
            m_storage.set("stereo", "NONE");
            if (_stereo_mode == "NONE") {
                if (m_input.can_use_device(m_input.DEVICE_HMD))
                    m_hmd_conf.update();
                if (m_camera_anim.is_auto_rotate()) {
                    stop_camera();
                    update_auto_rotate_button();
                }

                m_hmd.enable_hmd(m_hmd.HMD_ALL_AXES_MOUSE_YAW);
                _pick = m_scs.pick_center;
                // Check if app is in fullscreen mode.
                var fullscreen_button = document.querySelector("#fullscreen_on_button");
                if (fullscreen_button)
                    enter_fullscreen();
            } else {
                m_storage.set("stereo", "NONE");
                reload_app()
            }
            break;
        }

        _stereo_mode = stereo;
        set_stereo_button(stereo);
    }

    function reload_app() {
        setTimeout(function() {
            window.location.reload();
        }, 100);
    }

    function set_quality_config() {
        var quality = m_storage.get("quality");

        if (!quality || quality == "CUSTOM") {
            quality = DEFAULT_QUALITY;
            m_storage.set("quality", quality);
        }

        switch (quality) {
        case "LOW":
            var qual = m_cfg.P_LOW;
            break;
        case "HIGH":
            var qual = m_cfg.P_HIGH;
            break;
        case "ULTRA":
            var qual = m_cfg.P_ULTRA;
            break;
        }

        m_cfg.set("quality", qual);
    }

    function set_stereo_config() {
        var stereo = m_storage.get("stereo") || DEFAULT_STEREO;
        _stereo_mode = stereo;
        if (stereo == "NONE")
            stereo = "HMD";

        m_cfg.set("stereo", stereo);
    }

    function report_app_error(text_message, link_message, link) {
        var error_name = document.querySelector("#error_name");
        var error_info = document.querySelector("#error_info");
        var error_container = document.querySelector("#error_container");

        _circle_container.style.display = "none";
        error_name.innerHTML = text_message;
        error_info.innerHTML = link_message + " <a href=" + link + ">" + link.replace("https://www.", "") + "</a>";
        error_container.style.display = "block";
        _logo_container.style.opacity = 1;
        _logo_container.style.marginTop = "-90px";
    }

    // Button functions

    function initWheels() {
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel11"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel12"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel13"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel14"));

    }

    function cycleWheelTrims() {

        switch (wheelIndex % 2) {
            case 0:
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel21"));
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel22"));
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel23"));
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel24"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel11"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel12"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel13"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel14"));
                break;
            case 1:
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel11"));
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel12"));
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel13"));
                m_scenes.hide_object(m_scenes.get_object_by_name("Wheel14"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel21"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel22"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel23"));
                m_scenes.show_object(m_scenes.get_object_by_name("Wheel24"));
                break;
            

        }

        wheelIndex++;

    }
    
    /*priceAddition(option)
     * 
     * edits the total price and corresponding price in the HTML
     * 
     * @returns {undefined}
     */
    function priceAdd(parts, over){
        if (optionsList[parts][0] == false){ //if an option is not selected
            optionsTotal += optionsList[parts][over];
            totalCost += optionsList[parts][over];
            optionsList[parts][0] = true;
            currentOption[parts] = over;
            
            
        }
        else if (optionsList[parts][0] == true){ //there exist an option
            optionsTotal = 
                    optionsTotal + optionsList[parts][over] 
                    - optionsList[parts][currentOption[parts]];
            totalCost = 
                    totalCost + optionsList[parts][over] 
                    - optionsList[parts][currentOption[parts]];
            
            currentOption[parts] = over;
            
            
        }
        
        /*inject into html*/
        document.getElementById("options-price").innerHTML= 
                    '$' + optionsTotal.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        document.getElementById("total-menu2").innerHTML= 
                    '$' + optionsTotal.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            
        document.getElementById("total-price").innerHTML = 
                '$' + totalCost.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        document.getElementById("total-menu").innerHTML = 
                '$' + totalCost.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }//end of function

    
    //Functions for the modal
    var modal = document.getElementById('myModal');

    var btn = document.getElementById("pricenav-viewfullsummary");

    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    };

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
       
    
    /*  A table insert for each part, which includes the spaces the white spaces
     * Input values are picture names, option, part, price. If option exist,
     * adjust accordingly
     * @returns {undefined}
     */
    
    var insertionOrder = ['header'];
    
    function tableInsert(pictureName, optionType, option, price, ref, over){

        var table = document.getElementById("partsTable");
        if ((optionsList[ref][0] == false) ||
                (insertionOrder.indexOf(optionType) == -1)) { //it doesn't exist
            
            
            var row = table.insertRow((insertionOrder.length));
            var blankspace = table.insertRow((insertionOrder.length+1));
            
            insertionOrder.push(optionType);
            insertionOrder.push('blank');
            
            var indexNum = insertionOrder.indexOf(optionType);
            
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);

            var emptyRow = blankspace.insertCell(0);

            cell0.innerHTML = '<img src="' + pictureName +
                    '" height="100" width="100">';
            cell1.innerHTML = optionType;
            cell2.innerHTML = option;
            cell3.innerHTML =  '$' + price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            cell4.innerHTML = '<button id="chang'+optionType+'" onclick="remove('+ indexNum +','+ "'"+
                    optionType +"'," + over +','+ref+')">&times;</button>'; 

            emptyRow.innerHTML = "&nbsp;";
            
            
            document.getElementById("myPopup").innerHTML= optionType +": "+ option;
            
        }
        else if ((optionsList[ref][0] == true) && 
                (insertionOrder.indexOf(optionType) != -1) ){ //if it exists
            var indexNum = insertionOrder.indexOf(optionType);
            
            table.deleteRow(indexNum);    //Delete that option
            
            //now add the new part in that same location
            var row = table.insertRow(indexNum);
            
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            
            cell0.innerHTML = '<img src="' + pictureName +
                    '" height="100" width="100">';
            cell1.innerHTML = optionType;
            cell2.innerHTML = option;
            cell3.innerHTML =  '$' + price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            cell4.innerHTML = '<button id="chang'+optionType+'" onclick="remove('+ indexNum +','+ "'"+
                    optionType +"'," + over +','+ref+')">&times;</button>';
            
            
            document.getElementById("myPopup").innerHTML= optionType +": "+ option;
        }

    } //end of tableInsert

    //jQuery to get the onClick from the view summary
    $(document).ready(function(){
        $("button").click(function(){
           $("#changPaint").click(function(){
              changePaintCurvaRed();
           }); 
           $("#changInterior").click(function(){
              changeInteriorEbony();
           });
           $("#changRoof").click(function(){
              changeRoofAluminum();
           });
           $("#changHeadliner").click(function(){
              changeHeadlinerBlacktricot();
           });
           $("#changWheels").click(function(){
              changeWheelsSignatureY();
           });
           $("#changAero").click(function(){
              changeAeroRearSpoilerPainted();
           });
           $("#changExhaustTip").click(function(){
              changeExteriorSportsStandard();
           });
           $("#changEngineCover").click(function(){
              changeEngineRegular();
           });
           $("#changInteriorDash").click(function(){
              changeInteriorSportsStandard();
           });
           $("#changCalipers").click(function(){
              changeBrakesCeramicSilver();
           });               
        });
    });
    
    //jQuery for the chosenSelection
    //reason selector is long because there is was a lag between calls on startup
    $(document).ready(function(){
        $("div").click(function(){
            $("#paint_white_button,#paint_berlinablack_button,#paint_curvared_button,\n\
            #paint_copsegreenmetalic_button,#paint_nouvellebluepearl_button, \n\
            #paint_sourcesilvermetalic_button,#paint_valenciaredpearl_button,#interior_selector_button,\n\
            #interior_ebony_button, #interior_orchid_button, #interior_red_button,#interior_saddle_button, \n\
            #roof_selector_button, #roof_aluminum_button,#roof_aluminumxm_button, #roof_carbon_button, \n\
            #roof_carbonxm_button,#headliner_selector_button, #headliner_blacktricot_button, \n\
            #headliner_blackalcantra_button, #wheels_selector_button,#wheels_signaturey_button, \n\
            #wheels_interwovenmachine_button, #wheels_interwovenpainted_button, \n\
            #wheels_interwovenpolished_button,#aero_selector_button,\n\
            #aero_rearspoilerpainted_button,#aero_rearspoilercarbon_button, \n\
            #exteriorsports_selector_button,#exteriorsports_spoilerstandard_button,\n\
            #exteriorsports_spoilerstandardcarbon_button, #engine_selector_button, \n\
            #engine_regular_button, #engine_carbon_button, #interiorsports_selector_button, \n\
            #interiorsports_standard_button, #interiorsports_carbon_button,#brakes_selector_button,\n\
            #brakes_ceramicblack_button, #brakes_ceramicred_button, #brakes_ceramicsilver_button").mousedown(function(){
                removeShow();
            });
            $("#paint_white_button,#paint_berlinablack_button,#paint_curvared_button,\n\
            #paint_copsegreenmetalic_button,#paint_nouvellebluepearl_button, \n\
            #paint_sourcesilvermetalic_button,#paint_valenciaredpearl_button,#interior_selector_button,\n\
            #interior_ebony_button, #interior_orchid_button, #interior_red_button,#interior_saddle_button, \n\
            #roof_selector_button, #roof_aluminum_button,#roof_aluminumxm_button, #roof_carbon_button, \n\
            #roof_carbonxm_button,#headliner_selector_button, #headliner_blacktricot_button, \n\
            #headliner_blackalcantra_button, #wheels_selector_button,#wheels_signaturey_button, \n\
            #wheels_interwovenmachine_button, #wheels_interwovenpainted_button, \n\
            #wheels_interwovenpolished_button,#aero_selector_button,\n\
            #aero_rearspoilerpainted_button,#aero_rearspoilercarbon_button, \n\
            #exteriorsports_selector_button,#exteriorsports_spoilerstandard_button,\n\
            #exteriorsports_spoilerstandardcarbon_button, #engine_selector_button, \n\
            #engine_regular_button, #engine_carbon_button, #interiorsports_selector_button, \n\
            #interiorsports_standard_button, #interiorsports_carbon_button,#brakes_selector_button,\n\
            #brakes_ceramicblack_button, #brakes_ceramicred_button, #brakes_ceramicsilver_button").click(function(){
                myFunction();
            });
        });
    });
    
    var popup = document.getElementById("myPopup");
    function myFunction() {
       popup.classList.add("show");
    }

    function removeShow(){
        popup.classList.remove("show");
    }
    
    // Change Car Paint Material

    function changePaintWhite(){
        priceAdd(10,1);
        setCarPaintColorParameter("BaseColor",0.5,0.5,0.5);
        setCarPaintColorParameter("SecondaryColor",1,1,1);
        setCarPaintColorParameter("TertiaryColor",1,1,1);
        setCarPaintFloatParameter("Intensity", 1);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 1,1,1);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_white_button"));
        
        tableInsert('css/images/01_PAINT/03_CasinoWhitePearl(900.00).png',
        'Paint', 'CasinoWhite', optionsList[10][1], 10, 1);
    }
    function changePaintBerlinaBlack(){
        priceAdd(10,3);
        setCarPaintColorParameter("BaseColor",0,0,0);
        setCarPaintColorParameter("SecondaryColor",0,0,0);
        setCarPaintColorParameter("TertiaryColor", 0,0,0);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 1,1,1);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_berlinablack_button"));
        tableInsert('css/images/01_PAINT/02_BerlinaBlack.png',
        'Paint', 'BerlinaBlack', 0, 10, 3);
    }
    function changePaintCurvaRed(){
        priceAdd(10,3);
        setCarPaintColorParameter("BaseColor",1,0,0);
        setCarPaintColorParameter("SecondaryColor",0.593,0,0);
        setCarPaintColorParameter("TertiaryColor", 0.176,0,0.011);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 0.936,0.045,0.081);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_curvared_button"));
        tableInsert('css/images/01_PAINT/04_CurvaRed.png',
        'Paint', 'CurvaRed', 0, 10, 3);
    }
    function changePaintCopseGreenMetalic(){
        priceAdd(10,1);
        setCarPaintColorParameter("BaseColor",0.025,0.036,0.028);
        setCarPaintColorParameter("SecondaryColor",0.021,0.049,0.018);
        setCarPaintColorParameter("TertiaryColor", 0.016,0.028,0.016);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 0.235,0.335,0.237);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_copsegreenmetalic_button"));
        tableInsert('css/images/01_PAINT/05_CopseGreenMetallic(900.00).png',
        'Paint', 'CopseGreen', optionsList[10][1], 10, 1);
    }
    function changePaintNouvelleBluePearl(){
        priceAdd(10,2);
        setCarPaintColorParameter("BaseColor",0.038,0.157,1);
        setCarPaintColorParameter("SecondaryColor",0.067,0.042,0.916);
        setCarPaintColorParameter("TertiaryColor", 0,0.002,0.588);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 0.121,0.218,0.936);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_nouvellebluepearl_button"));
        tableInsert('css/images/01_PAINT/06_NouvelleBluePearl(7,300.00).png',
        'Paint', 'NouvelleBluePearl', optionsList[10][2], 10, 2);
    }
    function changePaintSourceSilverMetalic(){
        priceAdd(10,1);
        setCarPaintColorParameter("BaseColor",0,0,0);
        setCarPaintColorParameter("SecondaryColor",0,0,0);
        setCarPaintColorParameter("TertiaryColor",1,1,1);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 0.441,0.441,0.441);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_sourcesilvermetalic_button"));
        tableInsert('css/images/01_PAINT/07_SourceSilverMetallic(900.00).png',
        'Paint', 'SourceSilverMetallic', optionsList[10][1], 10, 1);
    }
    function changePaintValenciaRedPearl(){
        priceAdd(10,2);
        setCarPaintColorParameter("BaseColor",0.12,0,0);
        setCarPaintColorParameter("SecondaryColor",0.278,0,0);
        setCarPaintColorParameter("TertiaryColor", 0.109,0.018,0.008);
        setCarPaintFloatParameter("Intensity", 0.0);
        setCarPaintFloatParameter("RimColorFactor", 1);
        setCarPaintColorParameter("RimColor", 0.936,0.045,0.081);
        update_selector_button(_paint_selector_button, document.querySelector("#paint_valenciaredpearl_button"));
        tableInsert('css/images/01_PAINT/08_ValenciaRedPearl(7,300.00)).png',
        'Paint', 'ValenciaRedPearl', optionsList[10][2], 10, 2);
    }

    
    // Change the Interior Materials
    
    function changeInteriorEbony(){
        setInteriorColor(0.006,0.006,0.006);
        priceAdd(7,2);
        update_selector_button(_interior_selector_button, document.querySelector("#interior_ebony_button"));
        close_menu_interior();
        tableInsert('css/images/02_INTERIOR/InteriorEbony.png',
        'Interior', 'Ebony', optionsList[7][2], 7, 2);
    }
    function changeInteriorOrchid(){
        setInteriorColor(0.267,0.267,0.267);
        priceAdd(7,1);
        update_selector_button(_interior_selector_button, document.querySelector("#interior_orchid_button"));
        close_menu_interior();
        tableInsert('css/images/02_INTERIOR/InteriorOrchid.png',
        'Interior', 'Orchid', optionsList[7][1], 7, 1);
    }
    function changeInteriorRed(){
        setInteriorColor(0.311,0.009,0.012);
        priceAdd(7,1);
        update_selector_button(_interior_selector_button, document.querySelector("#interior_red_button"));
        close_menu_interior();
        tableInsert('css/images/02_INTERIOR/InteriorRed.png',
        'Interior', 'Red', optionsList[7][1], 7, 1);
    }
    function changeInteriorSaddle(){
        setInteriorColor(0.22,0.092,0.054);
        priceAdd(7,1);
        update_selector_button(_interior_selector_button, document.querySelector("#interior_saddle_button"));
        close_menu_interior();
        tableInsert('css/images/02_INTERIOR/InteriorSaddle.png',
        'Interior', 'Saddle', optionsList[7][1], 7, 1);
    }
    
    // Change the Roof configuration
    function changeRoofAluminum(){
        priceAdd(9,2);
        m_scenes.hide_object(m_scenes.get_object_by_name("Exterior_Antenna"));
        update_selector_button(_roof_selector_button, document.querySelector("#roof_aluminum_button"));
        close_menu_roof();
        tableInsert('css/images/03_ROOF/01_RoofAluminum.png',
        'Roof', 'Aluminum', optionsList[9][2], 9, 2);
    }
    function changeRoofAluminumXM(){
        priceAdd(9,2);
        m_scenes.show_object(m_scenes.get_object_by_name("Exterior_Antenna"));
        update_selector_button(_roof_selector_button, document.querySelector("#roof_aluminumxm_button"));
        close_menu_roof();
        tableInsert('css/images/03_ROOF/02_RoofAluminumXM.png',
        'Roof', 'AluminumXM', optionsList[9][2], 9, 2);
    }
    function changeRoofCarbon(){
        priceAdd(9,1);
        m_scenes.hide_object(m_scenes.get_object_by_name("Exterior_Antenna"));
        update_selector_button(_roof_selector_button, document.querySelector("#roof_carbon_button"));
        close_menu_roof();
        tableInsert('css/images/03_ROOF/03_RoofCarbon(7,300.00).png',
        'Roof', 'Carbon', optionsList[9][1], 9, 1);
    }
    function changeRoofCarbonXM(){
        priceAdd(9,1);
        m_scenes.show_object(m_scenes.get_object_by_name("Exterior_Antenna"));
        update_selector_button(_roof_selector_button, document.querySelector("#roof_carbonxm_button"));
        close_menu_roof();
        tableInsert('css/images/03_ROOF/04_RoofCarbonXM(7,300.00).png',
        'Roof', 'CarbonXM', optionsList[9][1], 9, 1);
    }


    // Change the Headliner

    function changeHeadlinerBlacktricot(){
        priceAdd(6,2);
        update_selector_button(_headliner_selector_button, document.querySelector("#headliner_blacktricot_button"));
        close_menu_headliner();
        tableInsert('css/images/04_HEADLINER/01_BlackTricot.png',
        'Headliner', 'Tricot', optionsList[6][2], 6, 2);
    }
    function changeHeadlinerBlackAlcantra(){
        priceAdd(6,1);
        update_selector_button(_headliner_selector_button, document.querySelector("#headliner_blackalcantra_button"));
        close_menu_headliner();
        tableInsert('css/images/04_HEADLINER/02_BlackAlcantra(1,600).png',
        'Headliner', 'Alcantra', optionsList[6][1], 6, 1);
    }

    // Change the Wheels

    function changeWheelsSignatureY(){
        priceAdd(1,2);
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel21Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel22Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel23Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel24Rims"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel11Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel12Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel13Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel14Rim"));

        setObjectsMaterialColorParameter("rimShader", wheelRim1, "BaseColor", 0.214, 0.214, 0.214);
        setObjectsMaterialColorParameter("rimShader", wheelRim1, "SecondaryColor", 0.214, 0.214, 0.214);
        setObjectsMaterialColorParameter("rimShader", wheelRim1, "TertiaryColor", 0.214, 0.214, 0.214);
        setObjectsMaterialColorParameter("rimShader", wheelRim1, "RimColor", 0.900, 0.798, 0.748);
        setObjectMaterialFloatParameter("rimShader", wheelRim1, "RimColorFactor", 1);
        setObjectMaterialFloatParameter("rimShader", wheelRim1, "Intensity", 0);

        update_selector_button(_wheels_selector_button, document.querySelector("#wheels_signaturey_button"));
        close_menu_wheels();
        
        tableInsert('css/images/06_WHEELS/01_SignatureY-Spoke.png',
        'Wheels', 'SignatureY', optionsList[1][2], 1, 2);
    }
    function changeWheelsInterwovenMachine(){
        priceAdd(1,1);
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel21Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel22Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel23Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel24Rims"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel11Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel12Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel13Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel14Rim"));
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "BaseColor", 0.514, 0.514, 0.514);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "SecondaryColor", 0.514, 0.514, 0.514);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "TertiaryColor", 0.514, 0.514, 0.514);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "RimColor", 0.900, 0.798, 0.748);
        setObjectMaterialFloatParameter("rimShader", wheelRim2, "RimColorFactor", 1);
        setObjectMaterialFloatParameter("rimShader", wheelRim2, "Intensity", 0);

        update_selector_button(_wheels_selector_button, document.querySelector("#wheels_interwovenmachine_button"));
        close_menu_wheels();
        
        tableInsert('css/images/06_WHEELS/02_ExclusiveInterwoven_Machine(1,800.00).png',
        'Wheels', 'Interwoven-Machine', optionsList[1][1], 1, 1);
    }
    function changeWheelsInterwovenPainted(){
        priceAdd(1,1);
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel21Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel22Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel23Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel24Rims"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel11Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel12Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel13Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel14Rim"));
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "BaseColor", 0.214, 0.214, 0.214);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "SecondaryColor", 0.214, 0.214, 0.214);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "TertiaryColor", 0.214, 0.214, 0.214);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "RimColor", 0.900, 0.798, 0.748);
        setObjectMaterialFloatParameter("rimShader", wheelRim2, "RimColorFactor", 1);
        setObjectMaterialFloatParameter("rimShader", wheelRim2, "Intensity", 0);
        update_selector_button(_wheels_selector_button, document.querySelector("#wheels_interwovenpainted_button"));
        close_menu_wheels();
        tableInsert('css/images/06_WHEELS/03_ExclusiveInterwoven_Painted(1,800.00).png',
        'Wheels', 'Interwoven-Painted', optionsList[1][1], 1, 1);
    }
    function changeWheelsInterwovenPolished(){
        priceAdd(1,1);
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel21Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel22Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel23Rim"));
        m_scenes.show_object(m_scenes.get_object_by_name("Wheel24Rims"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel11Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel12Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel13Rim"));
        m_scenes.hide_object(m_scenes.get_object_by_name("Wheel14Rim"));

        setObjectsMaterialColorParameter("rimShader", wheelRim2, "BaseColor", 1, 1, 1);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "SecondaryColor", 1, 1, 1);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "TertiaryColor", 1, 1, 1);
        setObjectsMaterialColorParameter("rimShader", wheelRim2, "RimColor", 0.900, 0.798, 0.748);
        setObjectMaterialFloatParameter("rimShader", wheelRim2, "RimColorFactor", 1);
        setObjectMaterialFloatParameter("rimShader", wheelRim2, "Intensity", 1);

        update_selector_button(_wheels_selector_button, document.querySelector("#wheels_interwovenpolished_button"));
        close_menu_wheels();
        tableInsert('css/images/06_WHEELS/04_ExclusiveInterwoven_Polished(1,800.00).png',
        'Wheels', 'Interwoven-Polished', optionsList[1][1], 1, 1);
    }


    // Change the Aero

    function changeAeroRearSpoilerPainted(){
        priceAdd(4,2);
        m_scenes.hide_object(m_scenes.get_object_by_name("Exterior_Back_Spoiler"));
        m_scenes.hide_object(m_scenes.get_object_by_name("polySurface26"));
        update_selector_button(_aero_selector_button, document.querySelector("#aero_rearspoilerpainted_button"));
        close_menu_aero();
        tableInsert('css/images/07_AERO/01_RearSpoilerPainted.png',
        'Aero', 'Wing-Painted', optionsList[4][2], 4, 2);
    }
    function changeAeroRearSpoilerCarbon(){
        priceAdd(4,1);
        m_scenes.show_object(m_scenes.get_object_by_name("Exterior_Back_Spoiler"));
        m_scenes.show_object(m_scenes.get_object_by_name("polySurface26"));
        update_selector_button(_aero_selector_button, document.querySelector("#aero_rearspoilercarbon_button"));
        close_menu_aero();
        tableInsert('css/images/07_AERO/02_RearSpoilerCarbon(3,700.00).png',
        'Aero', 'Wing-Carbon', optionsList[4][1], 4, 1);
    }

    // Change the Exterior Sports

    function changeExteriorSportsStandard(){
        priceAdd(3,2);
        update_selector_button(_exteriorsports_selector_button, document.querySelector("#exteriorsports_spoilerstandard_button"));
        close_menu_exteriorsports();
        tableInsert('css/images/08_EXTERIOR_SPORTS_PACKAGE/01_Spoiler_Standard.png',
        'ExhaustTip', 'Standard', optionsList[3][2], 3, 2);
    }
    function changeExteriorSportsStandardCarbon(){
        priceAdd(3,1);
        update_selector_button(_exteriorsports_selector_button, document.querySelector("#exteriorsports_spoilerstandardcarbon_button"));
        close_menu_exteriorsports();
        tableInsert('css/images/08_EXTERIOR_SPORTS_PACKAGE/02_Spoiler_Standard_Carbon(11,000.00).png',
        'ExhaustTip', 'Standard-Carbon', optionsList[3][1], 3, 1);
    }

    // Change the Engine 
    function changeEngineRegular(){
        priceAdd(5,2);
        update_selector_button(_engine_selector_button, document.querySelector("#engine_regular_button"));
        close_menu_engine();
        tableInsert('css/images/09_ENGINE_ROOM_SPORTS_PACKAGE/01_RegularEngineCover.png',
        'EngineCover', 'Regular', optionsList[5][2], 5, 2);
    }
    function changeEngineCarbon(){
        priceAdd(5,1);
        update_selector_button(_engine_selector_button, document.querySelector("#engine_carbon_button"));
        close_menu_engine();
        tableInsert('css/images/09_ENGINE_ROOM_SPORTS_PACKAGE/02_EngineCoverCarbon(4,400.00).png',
        'EngineCover', 'Carbon', optionsList[5][1], 5, 1);
    }

    // Change the Interior Sports
    function changeInteriorSportsStandard(){
        priceAdd(11,2);
        update_selector_button(_interiorsports_selector_button, document.querySelector("#interiorsports_standard_button"));
        close_menu_interiorsports();
        tableInsert('css/images/10_INTERIOR_SPORTS_PACKAGE/01_InteriorStandard.png',
        'InteriorDash', 'Standard', optionsList[11][2], 11, 2);
    }
    function changeInteriorSportsCarbon(){
        priceAdd(11,1);
        update_selector_button(_interiorsports_selector_button, document.querySelector("#interiorsports_carbon_button"));
        close_menu_interiorsports();
        tableInsert('css/images/10_INTERIOR_SPORTS_PACKAGE/02_InteriorCarbonFibre(3,500.00).png',
        'InteriorDash', 'Carbon', optionsList[11][1], 11, 1);
    }

    // Change the Brakes
    function changeBrakesCeramicBlack(){
        priceAdd(2,2);
        update_selector_button(_brakes_selector_button, document.querySelector("#brakes_ceramicblack_button"));
        close_menu_brakes();
        tableInsert('css/images/12_BRAKES/BrakesCeramicBlack(12,900.00).png',
        'Calipers', 'Black', optionsList[2][2], 2, 2);
    }
    function changeBrakesCeramicRed(){
        priceAdd(2,2);
        update_selector_button(_brakes_selector_button, document.querySelector("#brakes_ceramicred_button"));
        close_menu_brakes();
        tableInsert('css/images/12_BRAKES/BrakesCeramicRed(12,900.00).png',
        'Calipers', 'Red', optionsList[2][2], 2, 2);
    }
    function changeBrakesCeramicSilver(){
        priceAdd(2,1);
        update_selector_button(_brakes_selector_button, document.querySelector("#brakes_ceramicsilver_button"));
        close_menu_brakes();
        tableInsert('css/images/12_BRAKES/BrakesCeramicSilver(12,900.00).png',
        'Calipers', 'Silver', optionsList[2][1], 2, 1);
    }


    function engineTrigger(e) {
        m_sfx.play(m_scenes.get_object_by_name("Engine"));
        update_button(e.target);
    }

    function engineTriggerStop(e){
        m_sfx.stop(m_scenes.get_object_by_name("Engine"));
        update_button(e.target);
    }

    function play_music(e){
        m_sfx.play(m_scenes.get_object_by_name("BGM"));
        update_button(e.target);
    }

    function stop_music(e){
        m_sfx.pause(m_scenes.get_object_by_name("BGM"));
        update_button(e.target);
    }


    function revTrigger() {
        m_sfx.play(m_scenes.get_object_by_name("RevEngine"));
    }

    function cycleCamera() {
        var cam = m_scenes.get_active_camera();
        var obj = ("CAM_LOC1");

        m_camera.correct_up(cam);
        m_camera.static_setup(cam);

        m_camera_anim.move_camera_to_point(cam, obj, 1, 1);
    }


    function setInteriorColor(r,g,b){
        for (var i = 0; i < interiorObjs.length; i++) {
            var objName = interiorObjs[i];
            var obj = m_scenes.get_object_by_name(objName);
            m_mat.set_diffuse_color(obj,"interior_color", m_rgb.from_values(r, g, b));
        }
    }


    // Accessing the NODES
    function setObjectMaterialFloatParameter(material, objects, parameterName, value) {
        for (var i = 0; i < objects.length; i++) {
            var objName = objects[i];
            var obj = m_scenes.get_object_by_name(objName);
            m_mat.set_nodemat_value(obj, [material, parameterName], value);
        }

    }

    function setObjectsMaterialColorParameter(material, objects, parameterName, r, g, b) {

        for (var i = 0; i < objects.length; i++) {
            var objName = objects[i];
            var obj = m_scenes.get_object_by_name(objName);
            m_mat.set_nodemat_rgb(obj, [material, parameterName], r, g, b);
        }

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

// to allow early built-in module check
window.addEventListener("load", function() {b4w.require("embed_main").init();});
