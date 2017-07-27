"use strict";

b4w.register("nsx_main", function (exports, require) {

	var m_anim = require("animation");
	var m_app = require("app");
	var m_camera = require("camera");
	var m_camera_anim = require("camera_anim");
	var m_cfg = require("config");
	var m_container = require("container");
	var m_ctl = require("controls");
	var m_data = require("data");
	var m_input = require("input");
	var m_lights = require("lights");
	var m_logic = require("logic_nodes");
	var m_main = require("main");
	var m_mat = require("material");
	var m_obj = require("objects");
	var m_preloader = require("preloader");
	var m_rgb = require("rgb");
	var m_scenes = require("scenes");
	var m_screen = require("screen");
	var m_sfx = require("sfx");
	var m_storage = require("storage");
	var m_time = require("time");
	var m_trans = require("transform");
	var m_util = require("util");
	var m_vec = require("vec3");
	var m_version = require("version");

	var BUILT_IN_SCRIPTS_ID = "built_in_scripts";
	var DEFAULT_QUALITY = "LOW";
	var DEFAULT_STEREO = "NONE";
	var CAMERA_AUTO_ROTATE_SPEED = 0.3;

	var HIDE_MENU_DELAY = 2000;
	var ANIM_ELEM_DELAY = 50;
	var LOGO_SHOW_DELAY = 300;
	var LOGO_HIDE_DELAY = 300;
	var LOGO_CIRCLE_HIDE_DELAY = 300;
	var CAPTION_SHOW_DELAY = 300;
	var CAPTION_HIDE_DELAY = 300;
	var MENU_BUTTON_SHOW_DELAY = 300;
	var PRELOADER_HIDE_DELAY = 300;


	var _menu_close_func = null;
	var _is_panel_open_top = false;
	var _is_panel_open_left = false;
	var _is_anim_top = false;
	var _is_anim_left = false;
	var _is_qual_menu_opened = false;
	var _is_stereo_menu_opened = false;
	var _is_help_menu_opened = false;
	var _no_social = false;
	var _socials = [];

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




	var _player_buttons = [
    { type: "simple_button", id: "opened_button", callback: open_menu },

    { type: "simple_button", id: "help_button", callback: open_help },

    { type: "simple_button", id: "close_help", callback: close_help },

    {
    	type: "trigger_button",
    	id: "fullscreen_on_button",
    	callback: enter_fullscreen,
    	replace_button_id: "fullscreen_off_button",
    	replace_button_cb: exit_fullscreen
    },

    {
    	type: "trigger_button",
    	id: "pause_button",
    	callback: pause_engine,
    	replace_button_id: "play_button",
    	replace_button_cb: resume_engine
    },

    {
    	type: "trigger_button",
    	id: "auto_rotate_on_button",
    	callback: rotate_camera,
    	replace_button_id: "auto_rotate_off_button",
    	replace_button_cb: stop_camera
    },

    {
    	type: "trigger_button",
    	id: "sound_on_button",
    	callback: stop_sound,
    	replace_button_id: "sound_off_button",
    	replace_button_cb: play_sound
    },

    {
    	type: "menu_button",
    	id: "stereo_buttons_container",
    	callback: open_stereo_menu,
    	child_buttons_array_id: ["def_mode_button",
								 "anag_mode_button",
								 "hmd_mode_button"],
    	child_buttons_array_cb: [
					function () { change_stereo("NONE") },
					function () { change_stereo("ANAGLYPH") },
					function () { change_stereo("HMD") }]
    },

    {
    	type: "menu_button",
    	id: "quality_buttons_container",
    	callback: open_qual_menu,
    	child_buttons_array_id: ["low_mode_button",
								 "high_mode_button",
								 "ultra_mode_button"],
    	child_buttons_array_cb: [
					function () { change_quality(m_cfg.P_LOW) },
					function () { change_quality(m_cfg.P_HIGH) },
					function () { change_quality(m_cfg.P_ULTRA) }]
    }
	]




	//

	exports.init = function () {
		var is_debug = (m_version.type() == "DEBUG");

		m_app.init({
			canvas_container_id: "main_canvas_container",
			callback: init_cb,
			gl_debug: is_debug,
			physics_enabled: false,
			show_fps: false,
			report_init_failure: false,
			console_verbose: is_debug,
			error_purge_elements: ['control_panel'],
			alpha: false,
			key_pause_enabled: false,
			fps_elem_id: "fps_container",
			fps_wrapper_id: "fps_wrapper",
			assets_pvr_available: false,
			assets_dds_available: false,
			assets_min50_available: false,
			min_capabilities: false
		});
	}

	function init_cb(canvas_element, success) {
		cache_dom_elems();

		if (!success) {
			display_no_webgl_bg();
			return;
		}

		//m_main.pause();
		init_control_buttons();

		m_data.load("assets/BuildandPrice.json", loaded_cb, preloader_cb)
		//set_quality_button();


		//init_control_buttons();

		window.addEventListener("resize", on_resize);

		on_resize();
	}

	function loaded_cb(data_id, success){
	
		if (!success) {
			report_app_error("Could not load the scene",
					"For more info visit",
					"https://www.blend4web.com/doc/en/web_player.html#scene-errors");

			return;
		}

		m_app.enable_camera_controls();
		m_main.set_render_callback(render_callback);
		on_resize();

		var mouse_move = m_ctl.create_mouse_move_sensor();
		var mouse_click = m_ctl.create_mouse_click_sensor();

		var canvas_cont = m_container.get_container();

		function move_cb() {
			canvas_cont.className = "move";
		}

		function stop_cb(obj, id, pulse) {
			if (pulse == -1)
				canvas_cont.className = "";
		}


	}


	function on_resize() {
		m_container.resize_to_container();
	}

	function init_control_buttons() {
		window.oncontextmenu = function (e) {
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

			(function (button) {
				m_input.add_click_listener(elem, function (e) {
					button.callback(e, button);
				})
			})(button);
		}
	}

	function cache_dom_elems() {
		_circle_container = document.querySelector("#circle_container");
		_preloader_caption = document.querySelector("#preloader_caption");
		_first_stage = document.querySelector("#first_stage");
		_second_stage = document.querySelector("#second_stage");
		_third_stage = document.querySelector("#third_stage");
		_load_container = document.querySelector("#load_container");
		_preloader_container = document.querySelector("#preloader_container");
		_opened_button = document.querySelector("#opened_button");
		_logo_container = document.querySelector("#logo_container");
		_buttons_container = document.querySelector("#buttons_container");
		_quality_buttons_container = document.querySelector("#quality_buttons_container");
		_stereo_buttons_container = document.querySelector("#stereo_buttons_container");
		_help_info_container = document.querySelector("#help_info_container");
		_help_button = document.querySelector("#help_button");
		_hor_button_section = document.querySelector("#hor_button_section");
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

		var drop_left = function (elem) {
			_is_anim_left = true;

			elem.style.marginRight = "-45px";

			if ((elem.id == "help_button") &&
					_is_help_menu_opened) {

				setTimeout(function () {
					_is_anim_left = false;
					_is_panel_open_left = true;
					check_anim_end();
				}, 100);

				return;
			}

			elem.style.display = "block";

			m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function () {

				if (!elem.nextElementSibling) {
					setTimeout(function () {
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

		var drop_top = function (elem) {
			_is_anim_top = true;

			elem.style.marginBottom = "-45px";
			elem.style.display = "block";

			m_app.css_animate(elem, "marginBottom", -45, 0, ANIM_ELEM_DELAY, "", "px", function () {

				if (!elem.previousElementSibling) {
					setTimeout(function () {
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

	function open_help() { }
	function close_help() { }
	function close_menu() { }
	function enter_fullscreen() { }
	function exit_fullscreen() { }
	function pause_engine() { }
	function resume_engine() { }
	function rotate_camera() { }
	function stop_camera() { }
	function play_sound() { }
	function stop_sound() { }
	function open_stereo_menu() { }
	function open_qual_menu() { }

	function check_autorotate() { }
	function render_callback() { }

	function init_links() {
		var button_links = document.querySelectorAll(".control_panel_button a");

		for (var i = 0; i < button_links.length; i++) {
			var link = button_links[i];

			if (link.hasAttribute("href"))
				link.href += document.location.href;

			add_hover_class_to_button(link.parentNode);
		}
	}

	function add_hover_class_to_button(elem) {
		if (!elem)
			return;

		if (m_main.detect_mobile()) {
			elem.addEventListener("touchstart", function () {
				elem.classList.add("hover");
				clear_deferred_close();
			});
			elem.addEventListener("touchend", function () {
				elem.classList.remove("hover");
				deferred_close();
			});
		} else {
			elem.addEventListener("mouseenter", function () {
				elem.classList.add("hover");
			});

			elem.addEventListener("mouseout", function (e) {
				elem.classList.remove("hover");
			});
		}
	}


	function preloader_cb(percentage, load_time) {
		_preloader_caption.innerHTML = percentage + "%";

		if (percentage < 33) {
			if (!_is_first_stage) {
				_is_first_stage = true
				_circle_container.style.display = "block";
			}

			_first_stage.style.width = percentage * 4.7 + "px";
			_circle_container.style.webkitTransform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
			_circle_container.style.transform = 'rotate('+ (percentage * 3.6 - 503) + 'deg)';
		} else if (percentage < 66) {
			if (!_is_second_stage) {
				_is_second_stage = true
				_first_stage.style.width = 142 + "px";
				_second_stage.style.backgroundColor = "#000";
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
				_third_stage.style.backgroundColor = "#000";
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
			_load_container.style.backgroundColor = "#000";

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

	function deferred_close(e) {
		if (is_anim_in_process())
			return;

		clear_deferred_close();

		_menu_close_func = setTimeout(close_menu, HIDE_MENU_DELAY);
	}


	function clear_deferred_close() {
		clearTimeout(_menu_close_func);
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

	function check_anim_end() {
		if (!is_anim_in_process()) {
			enable_opened_button();

			if ((!check_cursor_position("buttons_container") &&
					is_control_panel_opened()) ||
					(m_main.detect_mobile() && is_control_panel_opened()))
				deferred_close();
		}
	}

});

window.addEventListener("load", function () { b4w.require("nsx_main").init(); });
