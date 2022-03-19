import { recp_view_copy } from "../../src/config/copy.js";
//import { config } from "../../src/config/config.js";
import {
  random_id,
  list_from_dict,
  get_key_from_dict_field_value,
  dict_sorter
} from "../../src/models/toolkit.js";
import { app, note } from "../index.js";

export class View {
  // ATTRIBUTES
  constructor() {
    // -
    this.container = document.querySelector("#root");
    this.navigations = [];
    this.currentRecipe = {
      id: undefined,
      source: undefined
    };
    this.isMobile = false; //navigator.userAgentData.mobile;
  }

  // BASICS
  createElement(container, tag, className) {
    // -
    // Create an element with an optional CSS class
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    container.appendChild(element);
    return element;
  }
  getElement(selector) {
    // -
    // Retrieve an element from the DOM
    const element = document.querySelector(selector);
    return element;
  }

  // METHODS
  spawn() {
    // TESTED

    // NAVIGATION BAR
    this.nav_bar_div = this.createElement(this.container, "div", "nav_bar_div");
    this.nav_bar_div.id = "nav_bar_div";
    this.nav_bar_button_menu = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_menu.textContent =
      recp_view_copy["nav_bar.button.menu.textContent"][
        app.config.app.language
      ];
    this.nav_bar_button_myrecipies = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_myrecipies.textContent =
      recp_view_copy["nav_bar.button.myrecipies.textContent"][
        app.config.app.language
      ];
    this.nav_bar_button_thisweek = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_thisweek.textContent =
      recp_view_copy["nav_bar.button.thisweek.textContent"][
        app.config.app.language
      ];
    this.nav_bar_button_fridge = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_fridge.textContent =
      recp_view_copy["nav_bar.button.fridge.textContent"][
        app.config.app.language
      ];
    this.nav_bar_button_shopping = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_shopping.textContent =
      recp_view_copy["nav_bar.button.shopping.textContent"][
        app.config.app.language
      ];

    // MENU
    this.menu_div = this.createElement(this.container, "div", "section_div");
    this.menu_div.id = "menu_div";

    this.menu_section_title = this.createElement(
      this.menu_div,
      "h2",
      "section_title"
    );
    this.menu_section_title.innerHTML =
      recp_view_copy["menu.section_title.innerHTML"][app.config.app.language];

    // Parameters
    this.menu_label_parameters = this.createElement(this.menu_div, "h4");
    this.menu_label_parameters.textContent =
      recp_view_copy["menu.label.parameters.textContent"][
        app.config.app.language
      ];
    this.menu_button_navigates_myingredients = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_navigates_myingredients.textContent =
      recp_view_copy["menu.button.navigates_myingredients.textContent"][
        app.config.app.language
      ];

    // Archive management
    this.menu_label_archivemanagement = this.createElement(this.menu_div, "h4");
    this.menu_label_archivemanagement.textContent =
      recp_view_copy["menu.label.archivemanagement.textContent"][
        app.config.app.language
      ];
    this.menu_label_export = this.createElement(this.menu_div, "p", "");
    this.menu_label_export.innerHTML =
      recp_view_copy["menu.label.export.innerHTML"][app.config.app.language];
    this.menu_button_export = this.createElement(this.menu_div, "button");
    this.menu_button_export.textContent =
      recp_view_copy["menu.button.export.textContent"][app.config.app.language];
    this.menu_label_import = this.createElement(this.menu_div, "p", "");
    this.menu_label_import.innerHTML =
      recp_view_copy["menu.label.import.innerHTML"][app.config.app.language];
    this.menu_button_import_filepath = this.createElement(
      this.menu_div,
      "input"
    );
    this.menu_button_import_filepath.textContent =
      recp_view_copy["menu.button.import_filepath.textContent"][
        app.config.app.language
      ];
    this.menu_button_import_filepath.type = "file";
    this.menu_button_import_filepath.accept = ".reCP";
    this.menu_button_import_action = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_import_action.textContent =
      recp_view_copy["menu.button.import_action.textContent"][
        app.config.app.language
      ];

    // Advanced parameters
    this.menu_label_advancedparameters = this.createElement(
      this.menu_div,
      "h4"
    );
    this.menu_label_advancedparameters.textContent =
      recp_view_copy["menu.label.advancedparameters.textContent"][
        app.config.app.language
      ];

    // Scripting
    this.menu_label_scripting = this.createElement(this.menu_div, "p", "");
    this.menu_label_scripting.innerHTML =
      recp_view_copy["menu.label.scripting.innerHTML"][app.config.app.language];
    this.menu_button_script_initiate = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_script_initiate.textContent =
      recp_view_copy["menu.button.script_initiate.textContent"][
        app.config.app.language
      ];
    this.menu_button_script_terminate = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_script_terminate.textContent =
      recp_view_copy["menu.button.script_terminate.textContent"][
        app.config.app.language
      ];
    this.menu_button_script_export = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_script_export.textContent =
      recp_view_copy["menu.button.script_export.textContent"][
        app.config.app.language
      ];
    this.menu_button_script_run = this.createElement(this.menu_div, "button");
    this.menu_button_script_run.textContent =
      recp_view_copy["menu.button.script_run.textContent"][
        app.config.app.language
      ];

    // Dev mode
    this.menu_label_devmode = this.createElement(this.menu_div, "p", "");
    this.menu_label_devmode.innerHTML =
      recp_view_copy["menu.label.devmode.innerHTML"][app.config.app.language];
    this.menu_label_debug = this.createElement(
      this.menu_div,
      "label",
      "menu_checkbox_label"
    );
    this.menu_label_debug.innerHTML =
      recp_view_copy["menu.label.debug.innerHTML"][app.config.app.language];
    this.menu_checkbox_debug = this.createElement(
      this.menu_div,
      "input",
      "toggle_button"
    );
    this.menu_checkbox_debug.type = "checkbox";
    this.menu_checkbox_debug.id = "menu_checkbox_debug";
    this.menu_button_navigates_testsuite = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_navigates_testsuite.textContent =
      recp_view_copy["menu.button.navigates_testsuite.textContent"][
        app.config.app.language
      ];
    this.menu_label_prod = this.createElement(
      this.menu_div,
      "label",
      "menu_checkbox_label"
    );
    this.menu_label_prod.innerHTML =
      recp_view_copy["menu.label.prod.innerHTML"][app.config.app.language];
    this.menu_checkbox_prod = this.createElement(
      this.menu_div,
      "input",
      "toggle_button"
    );
    this.menu_checkbox_prod.type = "checkbox";
    this.menu_checkbox_prod.id = "menu_checkbox_prod";

    // MY RECIPIES
    this.myrecipies_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.myrecipies_div.id = "myrecipies_div";
    this.myrecipies_section_title = this.createElement(
      this.myrecipies_div,
      "h2",
      "section_title"
    );
    this.myrecipies_section_title.innerHTML =
      recp_view_copy["myrecipies.section_title.innerHTML"][
        app.config.app.language
      ];

    this.myrecipies_button_new = this.createElement(
      this.myrecipies_div,
      "button",
      "floating_button"
    );
    this.myrecipies_button_new.textContent =
      recp_view_copy["myrecipies.button.new.textContent"][
        app.config.app.language
      ];

    this.myrecipies_ul = this.createElement(
      this.myrecipies_div,
      "ul",
      "recipe_ul"
    );
    // TODO

    // THIS WEEK RECIPIES
    this.thisweek_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.thisweek_div.id = "thisweek_div";
    this.thisweek_section_title = this.createElement(
      this.thisweek_div,
      "h2",
      "section_title"
    );
    this.thisweek_section_title.innerHTML =
      recp_view_copy["thisweek.section_title.innerHTML"][
        app.config.app.language
      ];

    this.thisweek_button_renew = this.createElement(
      this.thisweek_div,
      "button",
      "TBD_button"
    );
    this.thisweek_button_renew.textContent =
      recp_view_copy["thisweek.button.renew.textContent"][
        app.config.app.language
      ];
    this.thisweek_button_add = this.createElement(
      this.thisweek_div,
      "button",
      "floating_button"
    );
    this.thisweek_button_add.textContent =
      recp_view_copy["thisweek.button.add.textContent"][
        app.config.app.language
      ];

    this.thisweek_toggle_seasonfilter = this.createElement(
      this.thisweek_div,
      "button",
      "toggle_button"
    );
    this.thisweek_toggle_seasonfilter.textContent =
      recp_view_copy["thisweek.toggle.seasonfilter.textContent"][
        app.config.app.language
      ];
    if (app.config.recipe.recipeSelector_filter_season) {
      this.thisweek_toggle_seasonfilter.classList.toggle("toggled");
    }

    this.thisweek_label_recipies = this.createElement(this.thisweek_div, "h4");
    this.thisweek_label_recipies.innerHTML =
      recp_view_copy["thisweek.label.recipies.innerHTML"][
        app.config.app.language
      ];
    this.thisweek_ul = this.createElement(this.thisweek_div, "ul", "recipe_ul");

    this.thisweek_label_ingredients = this.createElement(
      this.thisweek_div,
      "h4"
    );
    this.thisweek_label_ingredients.innerHTML =
      recp_view_copy["thisweek.label.ingredients.innerHTML"][
        app.config.app.language
      ];
    this.thisweek_ingredients_ul = this.createElement(
      this.thisweek_div,
      "ul",
      "ingredient_ul"
    );

    // FRIDGE INGREDIENTS
    this.fridge_div = this.createElement(this.container, "div", "section_div");
    this.fridge_div.id = "fridge_div";
    this.fridge_section_title = this.createElement(
      this.fridge_div,
      "h2",
      "section_title"
    );
    this.fridge_section_title.innerHTML =
      recp_view_copy["fridge.section_title.innerHTML"][app.config.app.language];

    this.fridge_button_restart = this.createElement(
      this.fridge_div,
      "button",
      "TBD_button"
    );
    this.fridge_button_restart.textContent =
      recp_view_copy["fridge.button.restart.textContent"][
        app.config.app.language
      ];

    this.fridge_label_ingredients = this.createElement(this.fridge_div, "h4");
    this.fridge_label_ingredients.innerHTML =
      recp_view_copy["fridge.label.ingredients.innerHTML"][
        app.config.app.language
      ];
    this.fridge_ul = this.createElement(this.fridge_div, "ul", "ingredient_ul");

    this.fridge_label_checkeding = this.createElement(this.fridge_div, "h4");
    this.fridge_label_checkeding.innerHTML =
      recp_view_copy["fridge.label.checkeding.innerHTML"][
        app.config.app.language
      ];
    this.fridge_checkeding_ul = this.createElement(
      this.fridge_div,
      "ul",
      "ingredient_ul"
    );

    // SHOPPING LIST
    this.shopping_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.shopping_div.id = "shopping_div";
    this.shopping_section_title = this.createElement(
      this.shopping_div,
      "h2",
      "section_title"
    );
    this.shopping_section_title.innerHTML =
      recp_view_copy["shopping.section_title.innerHTML"][
        app.config.app.language
      ];

    this.shopping_button_restart = this.createElement(
      this.shopping_div,
      "button",
      "TBD_button"
    );
    this.shopping_button_restart.textContent =
      recp_view_copy["shopping.button.restart.textContent"][
        app.config.app.language
      ];

    this.shopping_button_add = this.createElement(
      this.shopping_div,
      "button",
      "floating_button"
    );
    this.shopping_button_add.textContent =
      recp_view_copy["shopping.button.add.textContent"][
        app.config.app.language
      ];

    this.shopping_label_ingredients = this.createElement(
      this.shopping_div,
      "h4"
    );
    this.shopping_label_ingredients.innerHTML =
      recp_view_copy["shopping.label.ingredients.innerHTML"][
        app.config.app.language
      ];
    this.shopping_ul = this.createElement(
      this.shopping_div,
      "ul",
      "ingredient_ul"
    );

    this.shopping_label_checkeding = this.createElement(
      this.shopping_div,
      "h4"
    );
    this.shopping_label_checkeding.innerHTML =
      recp_view_copy["shopping.label.checkeding.innerHTML"][
        app.config.app.language
      ];
    this.shopping_checkeding_ul = this.createElement(
      this.shopping_div,
      "ul",
      "ingredient_ul"
    );
    this.shopping_button_makeavailable = this.createElement(
      this.shopping_div,
      "button",
      "TBD_button"
    );
    this.shopping_button_makeavailable.textContent =
      recp_view_copy["shopping.button._makeavailable.textContent"][
        app.config.app.language
      ];

    // RECIPE VIEWER
    this.recipeview_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.recipeview_div.id = "recipeview_div";
    this.recipeview_section_title = this.createElement(
      this.recipeview_div,
      "h2",
      "section_title"
    );
    this.recipeview_section_title.innerHTML =
      recp_view_copy["recipeview.section_title.innerHTML"][
        app.config.app.language
      ];

    this.recipeview_button_delete = this.createElement(
      this.recipeview_div,
      "button",
      "floating_button"
    );
    this.recipeview_button_delete.textContent =
      recp_view_copy["recipeview.button.delete.textContent"][
        app.config.app.language
      ];
    this.recipeview_button_edit = this.createElement(
      this.recipeview_div,
      "button",
      "floating_button"
    );
    this.recipeview_button_edit.textContent =
      recp_view_copy["recipeview.button.edit.textContent"][
        app.config.app.language
      ];
    this.recipeview_button_select = this.createElement(
      this.recipeview_div,
      "button",
      "floating_button"
    );
    this.recipeview_button_select.textContent =
      recp_view_copy["recipeview.button.select.textContent"][
        app.config.app.language
      ];

    this.recipeview_name_label = this.createElement(this.recipeview_div, "h3");
    this.recipeview_name_label.id = "recipeview_name";

    this.recipeview_portion_label = this.createElement(
      this.recipeview_div,
      "h4"
    );

    this.recipeview_label_ingredient = this.createElement(
      this.recipeview_div,
      "h4"
    );
    this.recipeview_label_ingredient.innerHTML =
      recp_view_copy["recipeview.label.ingredient.innerHTML"][
        app.config.app.language
      ];
    this.recipeview_ingredient_ul = this.createElement(
      this.recipeview_div,
      "ul",
      "recipeview_ingredient_ul"
    );

    this.recipeview_label_instruction = this.createElement(
      this.recipeview_div,
      "h4"
    );
    this.recipeview_label_instruction.innerHTML =
      recp_view_copy["recipeview.label.instruction.innerHTML"][
        app.config.app.language
      ];
    this.recipeview_instruction_ol = this.createElement(
      this.recipeview_div,
      "ol",
      "recipeview_instruction_ol"
    );

    // RECIPE EDITOR
    this.recipeedit_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.recipeedit_div.id = "recipeedit_div";
    this.recipeedit_section_title = this.createElement(
      this.recipeedit_div,
      "h2",
      "section_title"
    );
    this.recipeedit_section_title.innerHTML =
      recp_view_copy["recipeedit.section_title.innerHTML"][
        app.config.app.language
      ];

    this.recipeedit_button_save = this.createElement(
      this.recipeedit_div,
      "button",
      "floating_button"
    );
    this.recipeedit_button_save.textContent =
      recp_view_copy["recipeedit.button.save.textContent"][
        app.config.app.language
      ];

    this.recipeedit_label_name = this.createElement(
      this.recipeedit_div,
      "h4",
      "form_label"
    );
    this.recipeedit_label_name.innerHTML =
      recp_view_copy["recipeedit.label.name.innerHTML"][
        app.config.app.language
      ];
    this.recipeedit_input_name = this.createElement(
      this.recipeedit_div,
      "input",
      "form_input"
    );
    this.recipeedit_input_name.id = "recipeedit_input_name";
    this.recipeedit_input_name.placeholder =
      recp_view_copy["recipeedit.input.name.placeholder"][
        app.config.app.language
      ];

    this.recipeedit_label_portion = this.createElement(
      this.recipeedit_div,
      "h4",
      "form_label"
    );
    this.recipeedit_label_portion.innerHTML =
      recp_view_copy["recipeedit.label.portion.innerHTML"][
        app.config.app.language
      ];
    this.recipeedit_input_portion = this.createElement(
      this.recipeedit_div,
      "input",
      "form_input"
    );
    this.recipeedit_input_portion.id = "recipeedit_input_portion";

    this.recipeedit_label_ingredients = this.createElement(
      this.recipeedit_div,
      "h4",
      "form_label"
    );
    this.recipeedit_label_ingredients.innerHTML =
      recp_view_copy["recipeedit.label.ingredients.innerHTML"][
        app.config.app.language
      ];
    this.recipeedit_ingredient_ul = this.createElement(
      this.recipeedit_div,
      "ul",
      "recipeedit_ingredient_ul"
    );

    this.recipeedit_label_instructions = this.createElement(
      this.recipeedit_div,
      "h4",
      "form_label"
    );
    this.recipeedit_label_instructions.innerHTML =
      recp_view_copy["recipeedit.label.instructions.innerHTML"][
        app.config.app.language
      ];
    this.recipeedit_instruction_ol = this.createElement(
      this.recipeedit_div,
      "ol",
      "recipeedit_instruction_ol"
    );
    this.recipeedit_instruction_ol.id = "recipeedit_instruction_ol";

    // MY INGREDIENTS
    this.ingredients_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.ingredients_div.id = "ingredients_div";
    this.ingredients_section_title = this.createElement(
      this.ingredients_div,
      "h2",
      "section_title"
    );
    this.ingredients_section_title.innerHTML =
      recp_view_copy["ingredients.section_title.innerHTML"][
        app.config.app.language
      ];

    this.ingredients_button_save = this.createElement(
      this.ingredients_div,
      "button",
      "TBD_button"
    );
    this.ingredients_button_save.textContent =
      recp_view_copy["ingredients.button.save.textContent"][
        app.config.app.language
      ];

    this.ingredients_ol = this.createElement(
      this.ingredients_div,
      "ul",
      "ingredients_ol"
    );
    this.ingredients_ol.id = "ingredients_ol";

    // TEST SUITE
    this.testsuite_div = this.createElement(
      this.container,
      "div",
      "section_div"
    );
    this.testsuite_div.id = "testsuite_div";
    this.testsuite_section_title = this.createElement(
      this.testsuite_div,
      "h2",
      "section_title"
    );
    this.testsuite_section_title.innerHTML =
      recp_view_copy["testsuite.section_title.innerHTML"][
        app.config.app.language
      ];

    this.testsuite_label_testsuite = this.createElement(
      this.testsuite_div,
      "h3"
    );
    this.testsuite_label_testsuite.textContent =
      recp_view_copy["testsuite.label.testsuite.textContent"][
        app.config.app.language
      ];
    this.testsuite_ul = this.createElement(this.testsuite_div, "ul");
    this.testsuite_ul.id = "testsuite_ul";

    this.testsuite_label_console = this.createElement(this.testsuite_div, "h3");
    this.testsuite_label_console.textContent =
      recp_view_copy["testsuite.label.console.textContent"][
        app.config.app.language
      ];
    this.console_div = this.createElement(this.testsuite_div, "div");
    this.console_div.id = "console_div";

    // NAVIGATION
    this.bind("menu_myingredients");
    this.bind("menu_testsuite");
    this.bind("navbar_thisweek");
    this.bind("navbar_fridge");
    this.bind("navbar_shopping");
    this.bind("navbar_myrecipies");
    this.bind("navbar_menu");
    // Go back
    window.onhashchange = function () {
      this.navigates_back();
    };

    // Neat UI
    this.neat_ui();

    // FOCUS
    if (app.config.app.debug_mode) {
      this.navigates("testsuite_div");
    } else {
      this.navigates("thisweek_div");
    }
  }
  neat_ui() {
    // SCRIPTING
    if (app.script_state() === undefined) {
      app.view.menu_button_script_initiate.style.display = "initial";
      app.view.menu_button_script_terminate.style.display = "none";
      app.view.menu_button_script_export.style.display = "none";
      app.view.menu_button_script_run.style.display = "none";
    } else {
      app.view.menu_button_script_terminate.style.display = "initial";
      app.view.menu_button_script_export.style.display = "initial";
      if (app.script_state() === false) {
        app.view.menu_button_script_initiate.disabled = false;
        app.view.menu_button_script_terminate.disabled = true;
        app.view.menu_button_script_export.disabled = false;
        app.view.menu_button_script_run.style.display = "initial";
      } else {
        app.view.menu_button_script_initiate.disabled = true;
        app.view.menu_button_script_terminate.disabled = false;
        app.view.menu_button_script_export.disabled = true;
        app.view.menu_button_script_run.style.display = "none";
      }
    }
    // TESTED
    if (app.config.app.debug_mode === false) {
      app.view.menu_checkbox_debug.checked = false;
      app.view.menu_label_prod.style.display = "none";
      app.view.menu_checkbox_prod.style.display = "none";
      app.view.menu_button_navigates_testsuite.style.display = "none";
    } else {
      app.view.menu_checkbox_debug.checked = true;
      app.view.menu_label_prod.style.display = "initial";
      app.view.menu_checkbox_prod.style.display = "initial";
      app.view.menu_button_navigates_testsuite.style.display = "initial";
      if (app.config.app.prod_mode) {
        app.view.menu_checkbox_prod.checked = true;
      } else {
        app.view.menu_checkbox_prod.checked = false;
      }
    }
  }
  populate(list, content = undefined, additionalcontent = undefined) {
    // TESTED
    note.add("View.populate " + list, "event");
    var i = undefined;
    var key = undefined;
    var recipe = undefined;
    var recipe_li = undefined;
    var li_div = undefined;
    var li_label = undefined;
    var li_label_name = undefined;
    var li_label_count = undefined;
    var li_label_unit = undefined;
    var li_button_delete = undefined;
    var li_button_cooked = undefined;
    var li_button_toggle = undefined;
    var li_button_recover = undefined;
    var ing = undefined;
    var ing_key = undefined;
    var ing_li = undefined;
    var ingredient = undefined;
    var ingredient_li = undefined;
    var sorted_ingredients = undefined;

    switch (list) {
      case "myrecipies":
        this.myrecipies_ul.innerHTML = "";
        var sorted_myrecipies = dict_sorter(content, "name");
        if (sorted_myrecipies !== undefined) {
          for (i = 0; i < sorted_myrecipies.length; i++) {
            key = sorted_myrecipies[i];
            recipe = content[key];
            recipe_li = this.createElement(
              this.myrecipies_ul,
              "li",
              "recipe_li"
            );
            recipe_li.id = key + "-myrecipies-li";
            li_div = this.createElement(recipe_li, "div", "recipe_li_div");
            li_div.id = key + "-myrecipies-div";
            li_label = this.createElement(li_div, "label", "recipe_li_label");
            li_label.id = key + "-myrecipies-div";
            li_label.textContent =
              recipe.name + " - " + recipe.portions + " p.";
            // Delete & select
            if (!this.isMobile) {
              li_button_delete = this.createElement(
                li_div,
                "button",
                "recipe_li_button"
              );
              li_button_delete.id = key + "-myrecipies-button-delete";
              li_button_delete.textContent =
                recp_view_copy["myrecipies.button.delete.textContent"][
                  app.config.app.language
                ];
              var li_button_select = this.createElement(
                li_div,
                "button",
                "recipe_li_button"
              );
              li_button_select.id = key + "-myrecipies-button-select";
              li_button_select.textContent =
                recp_view_copy["myrecipies.button.select.textContent"][
                  app.config.app.language
                ];
            }
          }
        }
        break;
      case "thisweekrecipies":
        this.thisweek_ul.innerHTML = "";
        var sorted_thisweekrecipies = dict_sorter(content, "name", [
          ["thisweek", false, "!="],
          ["thisweek", undefined, "!="]
        ]);
        if (sorted_thisweekrecipies !== undefined) {
          for (i = 0; i < sorted_thisweekrecipies.length; i++) {
            if (content[sorted_thisweekrecipies[i]].thisweek === true) {
              key = sorted_thisweekrecipies[i];
              recipe = content[key];
              recipe_li = this.createElement(
                this.thisweek_ul,
                "li",
                "recipe_li"
              );
              recipe_li.id = key + "-thisweek-li";
              li_div = this.createElement(recipe_li, "div", "recipe_li_div");
              li_div.id = key + "-thisweek-div";
              li_label = this.createElement(li_div, "label", "recipe_li_label");
              li_label.id = key + "-thisweek-name";
              li_label.textContent = recipe.name;
              if (content[sorted_thisweekrecipies[i]].cooked === true) {
                li_label.classList.toggle("strikethrough");
                li_button_cooked = this.createElement(
                  li_div,
                  "button",
                  "recipe_li_button"
                );
                li_button_cooked.id = key + "-thisweek-button-cooked";
                li_button_cooked.textContent =
                  recp_view_copy["thisweek.button.recover.textContent"][
                    app.config.app.language
                  ];
              } else {
                // Portions
                var li_button_removeportion = this.createElement(
                  li_div,
                  "button",
                  "recipe_li_button"
                );
                li_button_removeportion.id =
                  key + "-thisweek-button-removeportion";
                li_button_removeportion.textContent = "-";
                var li_scaling = this.createElement(
                  li_div,
                  "label",
                  "recipe_li_portions"
                );
                li_scaling.id = key + "-thisweek-scaling";
                li_scaling.textContent = recipe.scaling;
                var li_button_addportion = this.createElement(
                  li_div,
                  "button",
                  "recipe_li_button"
                );
                li_button_addportion.id = key + "-thisweek-button-addportion";
                li_button_addportion.textContent = "+";
                // Delete, replace & cooked
                if (!this.isMobile) {
                  li_button_delete = this.createElement(
                    li_div,
                    "button",
                    "recipe_li_button"
                  );
                  li_button_delete.id = key + "-thisweek-button-delete";
                  li_button_delete.textContent =
                    recp_view_copy["thisweek.button.delete.textContent"][
                      app.config.app.language
                    ];
                  var li_button_replace = this.createElement(
                    li_div,
                    "button",
                    "recipe_li_button"
                  );
                  li_button_replace.id = key + "-thisweek-button-replace";
                  li_button_replace.textContent =
                    recp_view_copy["thisweek.button.replace.textContent"][
                      app.config.app.language
                    ];
                  li_button_cooked = this.createElement(
                    li_div,
                    "button",
                    "recipe_li_button"
                  );
                  li_button_cooked.id = key + "-thisweek-button-cooked";
                  li_button_cooked.textContent =
                    recp_view_copy["thisweek.button.cooked.textContent"][
                      app.config.app.language
                    ];
                }
              }
            }
          }
        }
        break;
      case "thisweekingredients":
        this.thisweek_ingredients_ul.innerHTML = "";
        var sorted_thisweekingredients = dict_sorter(content, "name");
        if (sorted_thisweekingredients !== undefined) {
          for (i = 0; i < sorted_thisweekingredients.length; i++) {
            key = sorted_thisweekingredients[i];
            ingredient = content[key];
            if (ingredient.need !== 0) {
              ingredient_li = this.createElement(
                this.thisweek_ingredients_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-thisweek-li";
              li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-thisweek-div";
              li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-thisweek-name";
              li_label_name.textContent = ingredient.name;
              if (ingredient.need <= ingredient.available) {
                li_label_name.classList.toggle("strikethrough");
              }
              li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-thisweek-count";
              li_label_count.textContent = ingredient.need;
              li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-thisweek-unit";
              li_label_unit.textContent = ingredient.unit;
            }
          }
        }
        break;
      case "fridgelist":
        this.fridge_ul.innerHTML = "";
        this.fridge_checkeding_ul.innerHTML = "";
        var sorted_fridgelingredients = dict_sorter(content, "name");
        if (sorted_fridgelingredients !== undefined) {
          for (i = 0; i < sorted_fridgelingredients.length; i++) {
            key = sorted_fridgelingredients[i];
            ingredient = content[key];
            // Ingredient need is not fulfilled
            if (
              ingredient.need !== 0 &&
              ingredient.need > ingredient.available
            ) {
              ingredient_li = this.createElement(
                this.fridge_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-fridge-li";
              li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-fridge-div";
              li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-fridge-name";
              li_label_name.textContent = ingredient.name;
              // Count
              var li_button_remove = this.createElement(
                li_div,
                "button",
                "ingredient_li_button"
              );
              li_button_remove.id = key + "-fridge-button-remove";
              li_button_remove.textContent = "-";
              li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-fridge-count";
              li_label_count.textContent =
                ingredient.available + "/" + ingredient.need;
              var li_button_add = this.createElement(
                li_div,
                "button",
                "ingredient_li_button"
              );
              li_button_add.id = key + "-fridge-button-add";
              li_button_add.textContent = "+";
              li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-fridge-unit";
              li_label_unit.textContent = ingredient.unit;
              // Toggle
              if (!this.isMobile) {
                li_button_toggle = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_toggle.id = key + "-fridge-button-toggle";
                li_button_toggle.textContent =
                  recp_view_copy["fridge.button.toggle.textContent"][
                    app.config.app.language
                  ];
              }
            }
            // Ingredient is toogled
            if (
              ingredient.need !== 0 &&
              ingredient.need === ingredient.available
            ) {
              ingredient_li = this.createElement(
                this.fridge_checkeding_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-fridge-li";
              li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-fridge-div";
              li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-fridge-name";
              li_label_name.textContent = ingredient.name;
              // Count
              li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-fridge-count";
              li_label_count.textContent =
                ingredient.available + "/" + ingredient.need;
              li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-fridge-unit";
              li_label_unit.textContent = ingredient.unit;
              // Untoggle
              if (!this.isMobile) {
                li_button_recover = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_recover.id = key + "-fridge-button-recover";
                li_button_recover.textContent =
                  recp_view_copy["fridge.button.recover.textContent"][
                    app.config.app.language
                  ];
              }
            }
          }
        }
        break;
      case "shoppinglist":
        this.shopping_ul.innerHTML = "";
        this.shopping_checkeding_ul.innerHTML = "";
        var sorted_shoppinglingredients = dict_sorter(content, "name");
        if (sorted_shoppinglingredients !== undefined) {
          for (i = 0; i < sorted_shoppinglingredients.length; i++) {
            key = sorted_shoppinglingredients[i];
            ingredient = content[key];
            // Ingredient need is not fulfilled
            if (
              ingredient.need !== 0 &&
              ingredient.need > ingredient.available &&
              ingredient.need - ingredient.available > ingredient.shopping
            ) {
              ingredient_li = this.createElement(
                this.shopping_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-shopping-li";
              li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-shopping-div";
              li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-shopping-name";
              li_label_name.textContent = ingredient.name;
              li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-shopping-count";
              li_label_count.textContent =
                ingredient.need - ingredient.available;
              li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-shopping-unit";
              li_label_unit.textContent = ingredient.unit;
              // Toggle
              if (!this.isMobile) {
                li_button_toggle = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_toggle.id = key + "-shopping-button-toggle";
                li_button_toggle.textContent =
                  recp_view_copy["fridge.button.toggle.textContent"][
                    app.config.app.language
                  ];
              }
            }
            // Ingredient is toogled
            if (
              ingredient.need !== 0 &&
              ingredient.need > ingredient.available &&
              ingredient.need - ingredient.available === ingredient.shopping
            ) {
              ingredient_li = this.createElement(
                this.shopping_checkeding_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-shopping-li";
              li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-shopping-div";
              li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-shopping-name";
              li_label_name.textContent = ingredient.name;
              // Count
              li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-shopping-count";
              li_label_count.textContent =
                ingredient.need - ingredient.available;
              li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-shopping-unit";
              li_label_unit.textContent = ingredient.unit;
              // Untoggle
              if (!this.isMobile) {
                li_button_recover = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_recover.id = key + "-shopping-button-recover";
                li_button_recover.textContent =
                  recp_view_copy["fridge.button.recover.textContent"][
                    app.config.app.language
                  ];
              }
            }
          }
        }
        break;
      case "recipeedit":
        this.recipeedit_input_name.value = content.name;
        this.recipeedit_input_portion.value = content.portions;
        this.recipeedit_ingredient_ul.innerHTML = "";
        sorted_ingredients = dict_sorter(content.ingredients, "name");
        if (sorted_ingredients !== undefined) {
          for (i = 0; i < sorted_ingredients.length; i++) {
            ing_key = sorted_ingredients[i];
            ing = content.ingredients[ing_key];
            app.view.add_new_input_row("ingredient", [ing_key, ing]);
          }
        }
        app.view.add_new_input_row("ingredient", undefined, additionalcontent);
        this.recipeedit_instruction_ol.innerHTML = "";
        content.instructions.forEach(function (inst) {
          app.view.add_new_input_row("instruction", inst);
        });
        app.view.add_new_input_row("instruction");
        break;
      case "recipeview":
        this.recipeview_name_label.innerHTML = content.name;
        if (this.currentRecipe.source === "thisweek") {
          this.recipeview_portion_label.innerHTML =
            content.scaling + " portions";
        } else {
          this.recipeview_portion_label.innerHTML =
            content.portions + " portions";
        }
        this.recipeview_ingredient_ul.innerHTML = "";
        sorted_ingredients = dict_sorter(content.ingredients, "name");
        if (sorted_ingredients !== undefined) {
          for (i = 0; i < sorted_ingredients.length; i++) {
            ing_key = sorted_ingredients[i];
            ing = content.ingredients[ing_key];
            ing_li = this.createElement(
              this.recipeview_ingredient_ul,
              "li",
              "recipeview_ingredient_li"
            );
            if (this.currentRecipe.source === "thisweek") {
              ing_li.innerHTML =
                ing.name +
                " : " +
                (ing.count * content.scaling) / content.portions +
                " " +
                ing.unit;
            } else {
              ing_li.innerHTML = ing.name + " : " + ing.count + " " + ing.unit;
            }
          }
        }
        app.view.recipeview_instruction_ol.innerHTML = "";
        content.instructions.forEach(function (inst) {
          var inst_li = app.view.createElement(
            app.view.recipeview_instruction_ol,
            "li",
            "recipeview_instruction_li"
          );
          inst_li.innerHTML = inst;
        });
        break;
      case "ingredientList":
        app.view.ingredients_ol.innerHTML = "";
        sorted_ingredients = dict_sorter(content, "name");
        if (sorted_ingredients !== undefined) {
          for (i = 0; i < sorted_ingredients.length; i++) {
            ing_key = sorted_ingredients[i];
            ing = content[ing_key];
            app.view.add_new_input_row("ingredient_edit", ing_key, ing);
          }
        }
        // Sort list

        break;
      default:
        note.add("V.populate - ERROR : unswitched list " + list, "error");
    }
  }
  add_new_input_row(row, content = undefined, additionalcontent = undefined) {
    // TESTED
    var existing_ing = undefined;

    switch (row) {
      case "ingredient":
        var ing_li = this.createElement(
          this.recipeedit_ingredient_ul,
          "li",
          "recipeedit_ingredient_li"
        );
        if (content !== undefined) {
          var ing_id = content[0];
          existing_ing = true;
        } else {
          ing_id = random_id();
          existing_ing = false;
        }
        ing_li.id = ing_id + "-recipeedit-ingredient-li";
        ing_li.setAttribute("existing_ing", existing_ing);
        var ing_input_name = this.createElement(
          ing_li,
          "input",
          "recipeedit_ingredient_input_name"
        );
        ing_input_name.id = ing_id + "-recipeedit-ingredient-name";
        var ing_input_count = this.createElement(
          ing_li,
          "input",
          "recipeedit_ingredient_input_count"
        );
        ing_input_count.id = ing_id + "-recipeedit-ingredient-count";
        var ing_input_unit = this.createElement(
          ing_li,
          "input",
          "recipeedit_ingredient_input_unit"
        );
        ing_input_unit.id = ing_id + "-recipeedit-ingredient-unit";
        var ing_button_delete = this.createElement(
          ing_li,
          "button",
          "recipeedit_li_button"
        );
        ing_button_delete.textContent =
          recp_view_copy["recipeedit.button.ing_button_delete.textContent"][
            app.config.app.language
          ];
        ing_button_delete.onclick = function () {
          ing_li.parentNode.removeChild(ing_li);
        };
        if (content !== undefined) {
          // Filling in
          ing_input_name.value = content[1].name;
          ing_input_name.disabled = true;
          ing_input_count.value = content[1].count;
          ing_input_unit.value = content[1].unit;
          ing_input_unit.disabled = true;
        } else {
          // Guidance
          ing_input_name.placeholder =
            recp_view_copy["recipeedit.input.ing_input_name.placeholder"][
              app.config.app.language
            ];
          ing_input_name.addEventListener(
            "focus",
            function ing_input_name_event() {
              app.view.add_new_input_row(
                "ingredient",
                undefined,
                additionalcontent
              );
              ing_input_name.removeEventListener("focus", ing_input_name_event);
            }
          );
          ing_input_count.placeholder =
            recp_view_copy["recipeedit.input.ing_input_count.placeholder"][
              app.config.app.language
            ];
          ing_input_unit.placeholder =
            recp_view_copy["recipeedit.input.ing_input_unit.placeholder"][
              app.config.app.language
            ];
          // Autocomplete
          if (additionalcontent !== undefined) {
            autocomplete(ing_input_name, additionalcontent, function () {
              ing_input_name.disabled = true;
              ing_input_unit.disabled = true;
              ing_input_unit.value =
                additionalcontent[
                  get_key_from_dict_field_value(
                    additionalcontent,
                    "name",
                    ing_input_name.value
                  )
                ].unit;
              ing_li.setAttribute("existing_ing", true);
            });
          }
        }
        break;
      case "instruction":
        var inst_li = this.createElement(
          this.recipeedit_instruction_ol,
          "li",
          "recipeedit_instruction_li"
        );
        var inst_id = random_id();
        inst_li.id = inst_id + "-recipeedit-instruction-li";
        var inst_input = this.createElement(
          inst_li,
          "input",
          "recipeedit_instruction_input"
        );
        inst_input.id = inst_id + "-recipeedit-instruction-input";
        inst_input.addEventListener("click", function inst_input_event() {
          app.view.add_new_input_row("instruction");
          inst_input.removeEventListener("click", inst_input_event);
        });
        // Delete button
        var inst_button_delete = this.createElement(
          inst_li,
          "button",
          "recipeedit_li_button"
        );
        inst_button_delete.textContent =
          recp_view_copy["recipeedit.button.inst_button_delete.textContent"][
            app.config.app.language
          ];
        inst_button_delete.onclick = function () {
          inst_li.parentNode.removeChild(inst_li);
        };
        if (content !== undefined) {
          // Filling in
          inst_input.value = content;
        } else {
          // Guidance
          inst_input.placeholder =
            recp_view_copy["recipeedit.input.inst_input.placeholder"][
              app.config.app.language
            ];
        }
        break;
      case "ingredient_edit":
        ing_li = this.createElement(
          this.ingredients_ol,
          "li",
          "ingredient_edit_li"
        );
        ing_li.id = content + "-ingredient_edit-li";
        var ing_name_input = this.createElement(
          ing_li,
          "input",
          "ingredients_name_input"
        );
        ing_name_input.id = content + "-ingredient_edit-name-input";
        var ing_unit_input = this.createElement(
          ing_li,
          "input",
          "ingredients_unit_input"
        );
        ing_unit_input.id = content + "-ingredient_edit-unit-input";
        var ing_season_select = this.createElement(
          ing_li,
          "select",
          "ingredients_season_select"
        );
        ing_season_select.id = content + "-ingredient_edit-season-select";
        var ing_season_select_values = ["Toute l'année", "Ete", "Hiver"];
        for (const val of ing_season_select_values) {
          var option = this.createElement(ing_season_select, "option");
          option.value = val;
          option.text = val;
        }
        if (additionalcontent !== undefined) {
          if (additionalcontent.name !== undefined) {
            ing_name_input.value = additionalcontent.name;
          }
          if (additionalcontent.unit !== undefined) {
            ing_unit_input.value = additionalcontent.unit;
          }
          if (additionalcontent.season !== undefined) {
            ing_season_select.value = additionalcontent.season;
          }
        }
        break;
      default:
      // Nothing
    }
  }
  navigates(section) {
    // TESTED
    note.add("View.navigates " + section, "event");
    for (var i = 0; i < app.config.recipe.recp_view_sections.length; i++) {
      if (section === app.config.recipe.recp_view_sections[i]) {
        this.getElement("#" + section).style.display = "block";
      } else {
        this.getElement(
          "#" + app.config.recipe.recp_view_sections[i]
        ).style.display = "none";
      }
    }
    this.navigations.push(section);
  }
  navigates_back() {
    // V5
    note.add("V.navigates_back");
    if (this.navigations.length > 0) {
      var section = this.navigations.pop();
      for (var i = 0; i < app.config.recipe.recp_view_sections.length; i++) {
        if (section === app.config.recipe.recp_view_sections[i]) {
          this.getElement("#" + section).style.display = "block";
        } else {
          this.getElement(
            "#" + app.config.recipe.recp_view_sections[i]
          ).style.display = "none";
        }
      }
    }
  }
  bind(trigger, handler = undefined) {
    note.add("view.bind : " + trigger, "log");

    // TESTED
    switch (trigger) {
      // MENU
      case "menu_myingredients":
        this.menu_button_navigates_myingredients.addEventListener(
          "click",
          function () {
            app.view.navigates("ingredients_div");
          }
        );
        break;
      case "script_initiate":
        this.menu_button_script_initiate.addEventListener("click", function () {
          handler();
        });
        break;
      case "script_terminate":
        this.menu_button_script_terminate.addEventListener(
          "click",
          function () {
            handler();
          }
        );
        break;
      case "script_export":
        this.menu_button_script_export.addEventListener("click", function () {
          handler();
        });
        break;
      case "script_run":
        this.menu_button_script_run.addEventListener("click", function () {
          handler();
        });
        break;
      case "menu_debugmode":
        this.menu_checkbox_debug.addEventListener("click", function () {
          handler();
        });
        break;
      case "menu_prodmode":
        this.menu_checkbox_prod.addEventListener("click", function () {
          handler();
        });
        break;
      case "menu_export":
        this.menu_button_export.addEventListener("click", function () {
          handler();
        });
        break;
      case "menu_import":
        this.menu_button_import_action.addEventListener("click", function () {
          handler();
        });
        break;
      case "menu_testsuite":
        this.menu_button_navigates_testsuite.addEventListener(
          "click",
          function () {
            app.view.navigates("testsuite_div");
          }
        );
        break;

      // NAV BAR
      case "navbar_menu":
        this.nav_bar_button_menu.addEventListener("click", function () {
          app.view.navigates("menu_div");
        });
        break;
      case "navbar_thisweek":
        this.nav_bar_button_thisweek.addEventListener("click", function () {
          app.view.navigates("thisweek_div");
        });
        break;
      case "navbar_fridge":
        this.nav_bar_button_fridge.addEventListener("click", function () {
          app.view.navigates("fridge_div");
        });
        break;
      case "navbar_shopping":
        this.nav_bar_button_shopping.addEventListener("click", function () {
          app.view.navigates("shopping_div");
        });
        break;
      case "navbar_myrecipies":
        this.nav_bar_button_myrecipies.addEventListener("click", function () {
          app.view.navigates("myrecipies_div");
        });
        break;

      // MY RECIPIES
      case "myrecipies_new":
        this.myrecipies_button_new.addEventListener("click", function () {
          app.view.navigates("recipeedit_div");
          handler();
        });
        break;
      case "myrecipies_interact":
        this.myrecipies_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        break;

      // THIS WEEK RECIPIES
      case "thisweek_renew":
        this.thisweek_button_renew.addEventListener("click", function () {
          handler();
        });
        break;
      case "thisweek_add":
        this.thisweek_button_add.addEventListener("click", function () {
          handler();
        });
        break;
      case "thisweek_interact":
        this.thisweek_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        break;
      case "thisweek_seasonfilter":
        this.thisweek_toggle_seasonfilter.addEventListener(
          "click",
          function () {
            app.view.thisweek_toggle_seasonfilter.classList.toggle("toggled");
            handler();
          }
        );
        break;

      // FRIDGE LIST
      case "fridge_interact":
        this.fridge_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        this.fridge_checkeding_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        break;
      case "fridge_restart":
        this.fridge_button_restart.addEventListener("click", (event) => {
          handler();
        });
        break;

      // SHOPPING LIST
      case "shopping_interact":
        this.shopping_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        this.shopping_checkeding_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        break;
      case "shopping_restart":
        this.shopping_button_restart.addEventListener("click", (event) => {
          handler();
        });
        break;
      case "shopping_add":
        this.shopping_button_add.addEventListener("click", (event) => {
          handler();
        });
        break;
      case "shopping_makeavailable":
        this.shopping_button_makeavailable.addEventListener(
          "click",
          (event) => {
            handler();
          }
        );
        break;

      // RECIPE VIEW
      case "recipeview_edit":
        this.recipeview_button_edit.addEventListener("click", (event) => {
          handler();
        });
        break;
      case "recipeview_delete":
        this.recipeview_button_delete.addEventListener("click", (event) => {
          handler();
        });
        break;
      case "recipeview_select":
        this.recipeview_button_select.addEventListener("click", (event) => {
          handler();
        });
        break;

      // RECIPE EDIT
      case "recipeedit_save":
        this.recipeedit_button_save.addEventListener("click", (event) => {
          handler();
        });
        break;

      // INGREDIENT UNITS
      case "ingredients_save":
        this.ingredients_button_save.addEventListener("click", (event) => {
          handler();
        });
        break;

      // Default
      default:
        note.add("V.bind - ERROR : unswitched trigger " + trigger, "error");
    }
  }
}

function autocomplete(inp, arr, handle = function () {}) {
  //
  // Reference https://www.w3schools.com/howto/howto_js_autocomplete.asp

  /*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);

    // Separate labels from ids
    var arr_name = list_from_dict(arr, "name");
    //var arr_id = Object.keys(arr);

    /*for each item in the array...*/
    for (i = 0; i < arr_name.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (
        arr_name[i].substr(0, val.length).toUpperCase() === val.toUpperCase()
      ) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML =
          "<strong>" + arr_name[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr_name[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr_name[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
          closeAllLists();
          // Call additional handler
          handle();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      /*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 38) {
      //up
      /*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
		except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
