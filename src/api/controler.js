import { Model } from "../../src/models/model.js";
//import { Note } from "../../src/models/note.js";
import { View } from "../../src/views/view.js";
//import { Snack } from "../../src/views/snack.js";
import { recp_view_copy } from "../../src/config/copy.js";
import { app, snack, note } from "../../src/index.js";
import { defaultConfig } from "../../src/config/config.js";
import { onboardingContent } from "../../src/config/onboarding.js";
import { random_id, dict_sorter } from "../models/toolkit.js";

export class Controler {
  constructor(config = undefined) {
    // Attributes
    this.model = new Model();
    this.view = new View();
    // Config
    if (config === undefined) {
      this.config = defaultConfig;
    } else {
      this.config = config;
    }
    // Script
    this.script = undefined;
  }
  // METHODS
  spawn() {
    app.script_record("app.spawn()");
    this.view.spawn();
    this.bind();
    this.populate();
    this.model.content_load(onboardingContent);
  }
  bind() {
    app.script_record("app.bind()");
    // TESTED

    // VIEW BINDERS

    // MENU
    this.view.bind("script_initiate", this.handle_script_initiate);
    this.view.bind("script_terminate", this.handle_script_terminate);
    this.view.bind("script_export", this.script_export);
    this.view.bind("script_run", this.handle_script_run);
    this.view.bind("menu_debugmode", this.handle_view_menu_debugmode);
    this.view.bind("menu_prodmode", this.handle_view_menu_prodmode);
    this.view.bind("menu_export", this.handle_view_menu_export);
    this.view.bind("menu_import", this.handle_view_menu_import);
    // MY RECIPIES
    this.view.bind("myrecipies_new", this.handle_view_myRecipies_new);
    this.view.bind("myrecipies_interact", this.handle_view_myRecipies_interact);
    // THIS WEEK RECIPIES
    this.view.bind("thisweek_renew", this.handle_view_thisWeek_renew);
    this.view.bind("thisweek_add", this.handle_view_thisWeek_add);
    this.view.bind("thisweek_interact", this.handle_view_thisWeek_interact);
    this.view.bind(
      "thisweek_seasonfilter",
      this.handle_view_thisWeek_seasonFilter
    );

    // FRIDGE LIST
    this.view.bind("fridge_interact", this.handle_view_fridge_interact);
    this.view.bind("fridge_restart", this.handle_view_fridge_restart);
    // SHOPPING LIST
    this.view.bind("shopping_interact", this.handle_view_shopping_interact);
    this.view.bind("shopping_restart", this.handle_view_shopping_restart);
    this.view.bind("shopping_add", this.handle_view_shopping_add);
    this.view.bind(
      "shopping_makeavailable",
      this.handle_view_shopping_makeavailable
    );

    // RECIPE VIEW
    this.view.bind("recipeview_edit", this.handle_view_viewRecipe_edit);
    this.view.bind("recipeview_delete", this.handle_view_viewRecipe_delete);
    this.view.bind("recipeview_select", this.handle_view_viewRecipe_select);
    // RECIPE EDIT
    this.view.bind("recipeedit_save", this.handle_view_editRecipe_save);
    // INGREDIENT UNITS
    this.view.bind("ingredients_save", this.handle_view_ingredients_save);

    // MODEL BINDERS
    this.model.bind(
      "currentRecipe_update",
      this.handle_model_currentRecipe_update
    );
    this.model.bind("myrecipies_update", this.handle_model_myrecipies_update);
    this.model.bind("thisweek_update", this.handle_model_thisweek_update);
    this.model.bind(
      "thisweek_ingredient_update",
      this.handle_model_thisweek_ingredient_update
    );
    this.model.bind("fridge_update", this.handle_model_fridge_update);
    this.model.bind("shopping_update", this.handle_model_shopping_update);
    this.model.bind("ingredients_update", this.handle_model_ingredients_update);
  }
  populate() {
    app.script_record("app.populate()");
    // TESTED
    note.add("C.populate", "event");
    this.handle_model_myrecipies_update();
    this.handle_model_thisweek_update();
    this.handle_model_fridge_update();
    this.handle_model_shopping_update();
    this.handle_model_ingredients_update();
  }
  handle_view_menu_debugmode() {
    app.script_record({
      command: "app.handle_view_menu_debugmode()",
      origin: "user"
    });
    // TESTED
    note.add(
      "C.handle_view_menu_debugmode to " + !app.config.app.debug_mode,
      "event"
    );
    if (app.config.app.debug_mode) {
      app.config.app.debug_mode = false;
      snack.add("snack.closing_debug_mode");
    } else {
      app.config.app.debug_mode = true;
      snack.add("snack.opening_debug_mode");
    }
    app.view.neat_ui();
  }
  handle_view_menu_prodmode() {
    app.script_record({
      command: "app.handle_view_menu_prodmode()",
      origin: "user"
    });
    // TESTED
    note.add(
      "C.handle_view_menu_prodmode to " + !app.config.app.prod_mode,
      "event"
    );
    if (app.config.app.prod_mode) {
      app.config.app.prod_mode = false;
      snack.add("snack.closing_prod_mode");
    } else {
      app.config.app.prod_mode = true;
      snack.add("snack.opening_prod_mode");
    }
    app.view.neat_ui();
  }
  handle_view_menu_export() {
    app.script_record({
      command: "app.handle_view_menu_export()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_menu_export", "event");
    snack.add("snack.exporting_archive");
    app.model.export_reCP();
  }
  handle_view_menu_import() {
    app.script_record({
      command: "app.handle_view_menu_import()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_menu_import", "event");
    if (app.view.menu_button_import_filepath.files[0] !== undefined) {
      app.model.import_reCP(app.view.menu_button_import_filepath.files[0]);
      snack.add("snack.importing_archive");
    } else {
      note.add("INFO : No file to import", "info");
      snack.add("snack.import_empty");
    }
  }
  handle_view_myRecipies_new() {
    app.script_record({
      command: "app.handle_view_myRecipies_new()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_myRecipies_new", "event");
    app.model.currentRecipe = app.model.myRecipies_new();
    app.view.currentRecipe.id = undefined;
    app.view.currentRecipe.source = "myrecipies";
    app.view.populate(
      "recipeedit",
      app.model.currentRecipe,
      app.model.ingredientUntis
    );
    app.view.navigates("recipeedit_div");
  }
  handle_view_myRecipies_interact = (id) => {
    app.script_record({
      command: app.handle_view_myRecipies_interact,
      input: id,
      comment: "app.handle_view_myRecipies_interact(" + id + ")",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_myRecipies_interact : " + id, "event");
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "select":
            note.add(
              "C.handle_view_myRecipies_interact.select : " + id_data[0],
              "event"
            );
            app.model.myRecipies_select(id_data[0]);
            app.handle_model_thisweek_update();
            app.view.navigates("thisweek_div");
            break;
          case "delete":
            note.add(
              "C.handle_view_myRecipies_interact.delete : " + id_data[0],
              "event"
            );
            app.model.myRecipies_delete(id_data[0]);
            break;
          default:
            note.add("Error : recipe button not recognised : " + id, "error");
        }
        break;
      case "name":
        if (app.model.select_recipe("myrecipies", id_data[0])) {
          note.add("C.handle_view_myRecipies_interact.name", "event");
          app.view.currentRecipe.id = id_data[0];
          app.view.currentRecipe.source = "myrecipies";
          app.model.currentRecipe =
            app.model.myRecipies[app.view.currentRecipe.id];
          app.view.populate(
            "recipeview",
            app.model.currentRecipe,
            app.model.ingredientUntis
          );
          app.view.navigates("recipeview_div");
        } else {
          note.add("Error : recipe id not recognised : " + id_data[0], "error");
        }
        break;
      case "div":
        if (app.model.select_recipe("myrecipies", id_data[0])) {
          note.add("C.handle_view_myRecipies_interact.div", "event");
          app.view.currentRecipe.id = id_data[0];
          app.view.currentRecipe.source = "myrecipies";
          app.model.currentRecipe =
            app.model.myRecipies[app.view.currentRecipe.id];
          app.view.populate(
            "recipeview",
            app.model.currentRecipe,
            app.model.ingredientUntis
          );
          app.view.navigates("recipeview_div");
        } else {
          note.add("Error : recipe id not recognised : " + id_data[0], "error");
        }
        break;
      default:
        note.add("Error : clic not recognised : " + id, "error");
    }
  };
  handle_view_thisWeek_renew() {
    app.script_record({
      command: "app.handle_view_thisWeek_renew()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_thisWeek_renew", "event");
    app.model.thisWeekSelection_renew();
    snack.add("snack.thisweek_renewed");
    app.model.thisWeekSelection_ingredients_restart();
    app.handle_model_thisweek_update();
  }
  handle_view_thisWeek_add() {
    app.script_record({
      command: "app.handle_view_thisWeek_add()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_thisWeek_add", "event");
    app.model.thisWeekSelection_add();
    app.model.thisWeekSelection_ingredients_restart();
    app.handle_model_thisweek_update();
  }
  handle_view_thisWeek_interact = (id) => {
    app.script_record({
      command: "app.handle_view_thisWeek_interact(" + id + ")",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_thisWeek_interact : " + id, "event");
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "addportion":
            note.add("C.handle_view_thisWeek_interact.addportion", "event");
            app.model.myRecipies[id_data[0]].scaling += 1;
            app.handle_model_thisweek_update();
            app.model.thisWeekSelection_ingredients_restart();
            break;
          case "removeportion":
            note.add("C.handle_view_thisWeek_interact.removeportion", "event");
            app.model.myRecipies[id_data[0]].scaling = Math.max(
              app.model.myRecipies[id_data[0]].scaling - 1,
              1
            );
            app.handle_model_thisweek_update();
            app.model.thisWeekSelection_ingredients_restart();
            break;
          case "replace":
            note.add(
              "C.handle_view_thisWeek_interact.replace : " + id_data[0],
              "event"
            );
            app.model.thisWeekSelection_add();
            app.model.thisWeekSelection_remove(id_data[0]);
            snack.add("snack.thisweek_replaced");
            app.model.thisWeekSelection_ingredients_restart();
            break;
          case "cooked":
            note.add(
              "C.handle_view_thisWeek_interact.cooked : " + id_data[0],
              "event"
            );
            app.model.thisWeekSelection_cooked(id_data[0]);
            snack.add("snack.thisweek_cooked");
            break;
          case "delete":
            note.add(
              "C.handle_view_thisWeek_interact.delete : " + id_data[0],
              "event"
            );
            app.model.thisWeekSelection_remove(id_data[0]);
            app.model.thisWeekSelection_ingredients_restart();
            break;
          default:
            note.add("Error : recipe button not recognised : " + id, "error");
        }
        break;
      case "name":
        if (app.model.select_recipe("thisweek", id_data[0])) {
          note.add(
            "C.handle_view_thisWeek_interact.name : " + id_data[0],
            "event"
          );
          app.view.currentRecipe.id = id_data[0];
          app.view.currentRecipe.source = "thisweek";
          app.model.currentRecipe =
            app.model.myRecipies[app.view.currentRecipe.id];
          app.view.populate("recipeedit", app.model.currentRecipe);
          app.view.navigates("recipeview_div");
        } else {
          note.add("Error : recipe id not found : " + id_data[0], "error");
        }
        break;
      case "div":
        if (app.model.select_recipe("thisweek", id_data[0])) {
          note.add(
            "C.handle_view_thisWeek_interact.div : " + id_data[0],
            "event"
          );
          app.view.currentRecipe.id = id_data[0];
          app.view.currentRecipe.source = "thisweek";
          app.model.currentRecipe =
            app.model.myRecipies[app.view.currentRecipe.id];
          app.view.populate("recipeedit", app.model.currentRecipe);
          app.view.navigates("recipeview_div");
        } else {
          note.add("Error : recipe id not found : " + id_data[0], "error");
        }
        break;
      default:
        note.add("Error : clic not recognised : " + id, "error");
    }
  };
  handle_view_thisWeek_seasonFilter() {
    app.script_record({
      command: "app.handle_view_thisWeek_seasonFilter()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_thisWeek_seasonFilter", "event");
    if (app.model.settings.recipeSelector_filter_season) {
      app.model.settings.recipeSelector_filter_season = false;
    } else {
      app.model.settings.recipeSelector_filter_season = true;
    }
  }
  handle_view_fridge_restart() {
    app.script_record({
      command: "app.handle_view_fridge_restart()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_fridge_restart", "event");
    app.model.fridge_ingredients_restart();
  }
  handle_view_fridge_interact = (id) => {
    app.script_record({
      command: "app.handle_view_fridge_interact(" + id + ")",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_fridge_interact : " + id, "event");
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "add":
            note.add("C.handle_view_fridge_interact.add", "event");
            app.model.fridge_ingredients_toogleOne(id_data[0], 1);
            break;
          case "remove":
            note.add("C.handle_view_fridge_interact.remove", "event");
            app.model.fridge_ingredients_toogleOne(id_data[0], -1);
            break;
          case "toggle":
            note.add(
              "C.handle_view_fridge_interact.toggle : " + id_data[0],
              "event"
            );
            app.model.fridge_ingredients_toogle(id_data[0]);
            snack.add("snack.fridge_toogle");
            break;
          case "recover":
            note.add(
              "C.handle_view_fridge_interact.recover : " + id_data[0],
              "event"
            );
            app.model.fridge_ingredients_recover(id_data[0]);
            snack.add("snack.fridge_recover");
            break;
          default:
            note.add(
              "Error : ingredient button not recognised : " + id,
              "error"
            );
        }
        break;
      default:
        note.add("Error : clic not recognised : " + id, "error");
    }
  };
  // J'ai aussi
  handle_view_shopping_restart() {
    app.script_record({
      command: "app.handle_view_shopping_restart()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_shopping_restart", "event");
    app.model.shopping_ingredients_restart();
  }
  handle_view_shopping_interact = (id) => {
    app.script_record({
      command: "app.handle_view_shopping_interact(" + id + ")",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_shopping_interact : " + id, "event");
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "toggle":
            note.add(
              "C.handle_view_shopping_interact.toggle : " + id_data[0],
              "event"
            );
            app.model.shopping_ingredients_toggle(id_data[0]);
            snack.add("snack.shopping_toogle");
            break;
          case "recover":
            note.add(
              "C.handle_view_shopping_interact.recover : " + id_data[0],
              "event"
            );
            app.model.shopping_ingredients_recover(id_data[0]);
            snack.add("snack.shopping_recover");
            break;
          default:
            note.add(
              "Error : ingredient button not recognised : " + id,
              "error"
            );
        }
        break;
      default:
        note.add("Error : clic not recognised : " + id, "error");
    }
  };
  handle_view_shopping_add() {
    app.script_record({
      command: "app.handle_view_shopping_add()",
      origin: "user"
    });
    // V4
    note.add("C.handle_view_shopping_add", "event");
    snack.add("snack.functionality_unavailable");
  }
  handle_view_shopping_makeavailable() {
    app.script_record({
      command: "app.handle_view_shopping_makeavailable()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_shopping_makeavailable", "event");
    app.model.shopping_ingredients_makeavailable();
    snack.add("snack.shopping_madeavailable");
  }
  handle_view_viewRecipe_edit() {
    app.script_record({
      command: "app.handle_view_viewRecipe_edit()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_viewRecipe_edit", "event");
    app.view.currentRecipe.source = "myrecipies";
    app.model.currentRecipe = app.model.myRecipies[
      app.view.currentRecipe.id
    ].copy();
    app.view.populate(
      "recipeedit",
      app.model.currentRecipe,
      app.model.ingredientUntis
    );
    app.view.navigates("recipeedit_div");
  }
  handle_view_viewRecipe_delete() {
    app.script_record({
      command: "app.handle_view_viewRecipe_delete()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_viewRecipe_delete", "event");
    app.model.myRecipies_delete(app.view.currentRecipe.id);
    app.view.currentRecipe.source = undefined;
    app.view.currentRecipe.id = undefined;
    app.model.currentRecipe = undefined;
    app.view.navigates("myrecipies_div");
    snack.add(
      recp_view_copy["snack.viewrecipe_deleted"][app.config.app.language],
      3000,
      recp_view_copy["snack.viewrecipe_deleted"]["color"]
    );
  }
  handle_view_viewRecipe_select() {
    app.script_record({
      command: app.handle_view_viewRecipe_select,
      comment: "app.handle_view_viewRecipe_select()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_viewRecipe_select", "event");
    app.model.thisWeekSelection_add([app.view.currentRecipe.id], "by_id");
    app.model.thisWeekSelection_ingredients_restart();
    app.handle_model_thisweek_update();
    app.view.navigates("thisweek_div");
    snack.add(
      recp_view_copy["snack.viewrecipe_selected"][app.config.app.language],
      3000,
      recp_view_copy["snack.viewrecipe_selected"]["color"]
    );
  }
  handle_view_editRecipe_save() {
    app.script_record({
      command: "app.handle_view_editRecipe_save()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_editRecipe_save", "event");

    // Saving to current recipe
    app.model.currentRecipe.name = app.view.recipeedit_input_name.value;
    app.model.currentRecipe.portions = app.view.recipeedit_input_portion.value;

    // Ingredients
    app.model.currentRecipe.ingredients = {};
    [].forEach.call(app.view.recipeedit_ingredient_ul.childNodes, function (
      child
    ) {
      var child_data = child.id.split("-");
      var trigger_value = document.getElementById(
        child_data[0] + "-recipeedit-ingredient-name"
      ).value;
      if (trigger_value !== "" && trigger_value !== undefined) {
        app.model.currentRecipe.ingredient_add(
          {
            name: document.getElementById(
              child_data[0] + "-recipeedit-ingredient-name"
            ).value,
            count: Number(
              document.getElementById(
                child_data[0] + "-recipeedit-ingredient-count"
              ).value
            ),
            unit: document.getElementById(
              child_data[0] + "-recipeedit-ingredient-unit"
            ).value,
            existing_ing:
              "" +
              document
                .getElementById(child_data[0] + "-recipeedit-ingredient-li")
                .getAttribute("existing_ing")
          },
          child_data[0]
        );
      }
    });

    // Instructions
    app.model.currentRecipe.instructions = [];
    [].forEach.call(app.view.recipeedit_instruction_ol.childNodes, function (
      child
    ) {
      var child_data = child.id.split("-");
      var trigger_value = document.getElementById(
        child_data[0] + "-recipeedit-instruction-input"
      ).value;
      if (trigger_value !== "" && trigger_value !== undefined) {
        app.model.currentRecipe.instructions.push(
          document.getElementById(
            child_data[0] + "-recipeedit-instruction-input"
          ).value
        );
      }
    });
    if (app.view.currentRecipe.id === undefined) {
      // Adding as new recipe
      app.view.currentRecipe.id = app.model.myRecipies_save();
      app.view.currentRecipe.source = "myrecipies";
    } else {
      // Saving to existing recipe
      app.model.myRecipies_save(app.view.currentRecipe.id);
      if (app.model.myRecipies[app.view.currentRecipe.id] !== undefined) {
        snack.add("snack.recipeedit_saved");
      }
    }

    app.view.populate("recipeview", app.model.currentRecipe);
    app.view.navigates("recipeview_div");
  }
  handle_view_ingredients_save() {
    app.script_record({
      command: "app.handle_view_ingredients_save()",
      origin: "user"
    });
    // TESTED
    note.add("C.handle_view_ingredients_save", "event");
    // Ingredients
    [].forEach.call(app.view.ingredients_ol.childNodes, function (child) {
      var child_data = child.id.split("-");
      var trigger_value = document.getElementById(
        child_data[0] + "-ingredient_edit-name-input"
      ).value;
      if (trigger_value !== "" && trigger_value !== undefined) {
        if (
          document.getElementById(child_data[0] + "-ingredient_edit-name-input")
            .value !== app.model.ingredients[child_data[0]].name
        ) {
          app.model.ingredients_update(
            "name",
            child_data[0],
            document.getElementById(
              child_data[0] + "-ingredient_edit-name-input"
            ).value
          );
        }
        if (
          document.getElementById(child_data[0] + "-ingredient_edit-unit-input")
            .value !== app.model.ingredients[child_data[0]].unit
        ) {
          app.model.ingredients_update(
            "unit",
            child_data[0],
            document.getElementById(
              child_data[0] + "-ingredient_edit-unit-input"
            ).value
          );
        }
        if (
          document.getElementById(
            child_data[0] + "-ingredient_edit-season-select"
          ).value !== app.model.ingredients[child_data[0]].season
        ) {
          app.model.ingredients_update(
            "season",
            child_data[0],
            document.getElementById(
              child_data[0] + "-ingredient_edit-season-select"
            ).value
          );
        }
      }
    });
    app.populate();
    snack.add(
      recp_view_copy["snack.ingredients_saved"][app.config.app.language],
      3000,
      recp_view_copy["snack.ingredients_saved"]["color"]
    );
  }
  handle_model_currentRecipe_update() {
    app.script_record({
      command: "app.handle_model_currentRecipe_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_currentRecipe_update", "event");
    app.view.populate("recipeview", app.model.currentRecipe);
  }
  handle_model_myrecipies_update() {
    app.script_record({
      command: "app.handle_model_myrecipies_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_myrecipies_update", "event");
    app.view.populate("myrecipies", app.model.myRecipies);
  }
  handle_model_thisweek_update() {
    app.script_record({
      command: "app.handle_model_thisweek_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_thisweek_update", "event");
    app.view.populate("thisweekrecipies", app.model.myRecipies);
    app.model.thisWeekSelection_ingredients_restart();
  }
  handle_model_thisweek_ingredient_update() {
    app.script_record({
      command: "app.handle_model_thisweek_ingredient_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_thisweek_ingredient_update", "event");
    app.view.populate("thisweekingredients", app.model.ingredients);
    app.handle_model_fridge_update();
  }
  handle_model_fridge_update() {
    app.script_record({
      command: "app.handle_model_fridge_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_fridge_update", "event");
    app.view.populate("fridgelist", app.model.ingredients);
    app.handle_model_shopping_update();
  }
  handle_model_shopping_update() {
    app.script_record({
      command: "app.handle_model_shopping_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_shopping_update", "event");
    app.view.populate("shoppinglist", app.model.ingredients);
  }
  handle_model_ingredients_update() {
    app.script_record({
      command: "app.handle_model_ingredients_update()",
      origin: "model"
    });
    // TESTED
    note.add("C.handle_model_ingredients_update", "event");
    app.view.populate("ingredientList", app.model.ingredients);
    app.handle_model_thisweek_update();
  }
  // SCRIPTING
  script_state() {
    if (app.script !== undefined) {
      if (app.script.recording === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return undefined;
    }
  }
  script_capture() {
    return JSON.stringify(app.model.content_extract());
  }
  script_record(event) {
    var id = undefined;
    if (app.script_state()) {
      id = random_id();
      if (typeof event === "object") {
        event.date = Date.now();
        app.script.events[id] = event;
      } else {
        app.script.events[id] = {
          date: Date.now(),
          event: event
        };
      }
    }
    return id;
  }
  script_export() {
    note.add("C.handle_script_export", "event");
    app.script_record({
      command: "app.handle_script_export()",
      origin: "user"
    });
    let exp = {
      stateInitial: app.script.states.initial,
      events: JSON.stringify(app.script.events),
      stateFinal: app.script.states.final
    };
    console.log("app.script_export");
    console.log(exp);
    return exp;
  }
  handle_script_initiate() {
    note.add("C.handle_script_initiate", "event");
    app.script = {};
    app.script.states = {
      initial: app.script_capture(),
      final: undefined
    };
    app.script.events = {};
    app.script.recording = true;
    app.script_record({
      command: "app.handle_script_initiate()",
      origin: "script"
    });
    console.info("SCRIPT : RECORDING STARTED");
    console.info("SCRIPT : Initial state");
    console.log(app.script);
    app.view.neat_ui();
  }
  handle_script_terminate() {
    note.add("C.handle_script_terminate", "event");
    app.script_record({
      command: "app.handle_script_terminate()",
      origin: "script"
    });
    if (app.script !== undefined) {
      app.script.states.final = app.script_capture();
      app.script.recording = false;
      console.info("SCRIPT : RECORDING ENDED");
      console.info("SCRIPT : Final state");
      console.log(app.script);
      app.view.neat_ui();
    }
  }
  handle_script_run() {
    note.add("C.handle_script_run", "event");
    // Initialise
    console.info("SCRIPT : RUNNING...");
    console.info("SCRIPT : Initial state");
    console.log(JSON.parse(app.script.states.initial));
    app.model.content_load(JSON.parse(app.script.states.initial));
    // Run
    var eventKeys = dict_sorter(app.script.events, "date");
    for (var i = 0; i < eventKeys.length; i++) {
      if (app.script.events[eventKeys[i]].origin === "user") {
        if (app.script.events[eventKeys[i]].comment === undefined) {
          console.error("SCRIPT : Unmapped comment : ");
          console.error(app.script.events[eventKeys[i]]);
        } else {
          console.info("SCRIPT : " + app.script.events[eventKeys[i]].comment);
          if (app.script.events[eventKeys[i]].command === undefined) {
            console.error(
              "SCRIPT : Unmapped command : " +
                app.script.events[eventKeys[i]].comment
            );
          } else {
            if (app.script.events[eventKeys[i]].input !== undefined) {
              app.script.events[eventKeys[i]].command(
                app.script.events[eventKeys[i]].input
              );
            } else {
              app.script.events[eventKeys[i]].command();
            }
          }
        }
      } else {
        //console.log("// SCRIPT : " + app.script.events[eventKeys[i]].command);
      }
    }
    console.info("SCRIPT : ENDED");
    // Compare
    var newState = app.script_capture();
    if (newState === app.script.states.final) {
      console.info("SCRIPT : Reached the same state");
      console.log(JSON.parse(app.script.states.final));
    } else {
      console.error("ERROR : Did not reached the same state");
      console.info("SCRIPT : Expected final state :");
      console.log(JSON.parse(app.script.states.final));
      console.info("SCRIPT : Achieved new state :");
      console.log(JSON.parse(newState));
    }
  }
}
