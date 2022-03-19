// Standard data format is JSON
// Ref. https://en.wikipedia.org/wiki/JSON

// MVC architecture
// Ref. https://www.taniarascia.com/javascript-mvc-todo-app/

// TO UNCOMMENT FOR ONLINE RELEASE
import "../src/config/styles.css";
import { recp_view_copy } from "../src/config/copy.js";
import { onboardingContent } from "../src/config/onboarding.js";
import {
  random_id,
  list_from_dict,
  get_key_from_dict_field_value,
  dict_sorter,
  dict_count_values
} from "../../src/api/toolkit.js";

class M {
  // -
  // ATTRIBUTES
  constructor() {
    // TESTED
    this.settings = {
      defaultPortions: 4,
      defaultWeeklyRecipies: 3,
      recipeSelector_filter_season: true
    };
    this.myRecipies = {};
    this.ingredients = {};
    this.bindings = {};
    this.currentRecipe = undefined;
  }
  // METHODS
  select_recipe(source, id) {
    // TESTED
    if (id !== undefined && id in this.myRecipies) {
      switch (source) {
        case "myrecipies":
          this.currentRecipe = this.myRecipies[id];
          break;
        case "thisweek":
          this.currentRecipe = this.myRecipies[id];
          break;
        default:
          return false;
      }
    } else {
      return false;
    }
    this.trigger("currentRecipe_update");
    return true;
  }
  myRecipies_delete(id) {
    // TESTED
    delete this.myRecipies[id];
    this.trigger("myrecipies_update");
  }
  myRecipies_select(id) {
    // TESTED
    if (id !== undefined && this.myRecipies[id].thisweek !== true) {
      this.myRecipies[id].thisweek = true;
      this.myRecipies[id].scaling = this.settings.defaultPortions;
      this.trigger("thisweek_update");
      return true;
    } else {
      return false;
    }
  }
  myRecipies_save(id = undefined) {
    // TESTED
    // Recipe sort
    this.currentRecipe.clean();
    // Ingredients update
    for (const [ing_key, ing] of Object.entries(
      this.currentRecipe.ingredients
    )) {
      if (!Object.keys(this.ingredients).includes(ing_key)) {
        var ing_exists = undefined;
        for (const [mying_key, my_ing] of Object.entries(this.ingredients)) {
          if (my_ing.name === ing.name) {
            ing_exists = mying_key;
            break;
          }
        }
        if (ing_exists === undefined) {
          this.ingredients[ing_key] = {
            name: this.currentRecipe.ingredients[ing_key].name,
            unit: this.currentRecipe.ingredients[ing_key].unit,
            season: ""
          };
        } else {
          // Replace ingredient id in recipe
          this.currentRecipe.ingredients[ing_exists] = {
            name: this.currentRecipe.ingredients[ing_key].name,
            count: this.currentRecipe.ingredients[ing_key].count
          };
          delete this.currentRecipe.ingredients[ing_key];
        }
      }
    }
    // Recipe save
    if (id === undefined) {
      id = random_id();
      while (id in Object.keys(this.myRecipies)) {
        id = random_id();
      }
    }
    this.myRecipies[id] = this.currentRecipe.copy();
    // Trigger update
    this.trigger("myrecipies_update");
    this.trigger("ingredients_update");
    return id;
  }
  thisWeekSelection_add(except_id = [], mode = "random") {
    // TESTED
    if (
      Object.keys(this.myRecipies).length > 0 &&
      Object.keys(this.myRecipies).length >
        dict_count_values(this.myRecipies, "thisweek", true)
    ) {
      // Define recipe
      var id = this.thisWeekSelector(except_id, mode);
      // Add recipe
      if (id !== undefined) {
        this.myRecipies[id].thisweek = true;
        this.myRecipies[id].scaling = this.settings.defaultPortions;
        this.myRecipies[id].cooked = false;
      }
      return id;
    } else {
      return undefined;
    }
  }
  thisWeekSelector(except_id, mode) {
    // TESTED
    var id = undefined;
    switch (mode) {
      case "random":
        //console.log('M.thisWeekSelector : random except ' + except_id)
        var keys = Object.keys(this.myRecipies);
        //console.log('keys : ' + keys)
        // Remove selected keys
        var selected_keys = dict_sorter(app.model.myRecipies, "name", [
          ["thisweek", true, "=="]
        ]);
        for (var i = keys.length - 1; i >= 0; i--) {
          if (selected_keys.includes(keys[i])) {
            keys.splice(i, 1);
          }
        }
        // Remove except keys
        //console.log('thisWeekSelector filtering except_id')
        for (var i = keys.length - 1; i >= 0; i--) {
          if (except_id.includes(keys[i])) {
            keys.splice(i, 1);
          }
        }
        //console.log('keys : ' + keys)
        // Remove not season keys
        if (this.settings.recipeSelector_filter_season && keys.length > 0) {
          //console.log('thisWeekSelector filtering season')
          var today = new Date();
          var thismonth = today.getMonth() + 1;
          for (var i = keys.length - 1; i >= 0; i--) {
            //console.log('Considering season for recipe ' + keys[i] + ' : ' + this.myRecipies[keys[i]].name)
            for (const ing_key of Object.keys(
              this.myRecipies[keys[i]].ingredients
            )) {
              //console.log('Considering season for ingredient ' + ing_key + ' : ' + this.ingredients[ing_key]['season'])
              var istoremove = false;
              switch (this.ingredients[ing_key]["season"]) {
                case "Ete":
                  if (thismonth < 4 || 9 < thismonth) {
                    //console.log('We are in Winter so recipe ' + keys[i] + ' is removed')
                    istoremove = true;
                  } else {
                    //console.log('We are in Summer so ingredient ' + ing_key + ' is fine')
                  }
                  break;
                case "Hiver":
                  if (3 < thismonth && thismonth < 10) {
                    //console.log('We are in Summer so recipe ' + keys[i] + ' is removed')
                    istoremove = true;
                  } else {
                    //console.log('We are in Winter so ingredient ' + ing_key + ' is fine')
                  }
                  break;
                default:
                  //console.log('No constrain so ingredient ' + ing_key + ' is fine')
                  break;
              }
              if (istoremove) {
                keys.splice(i, 1);
                break;
              }
            }
          }
        }
        //console.log('keys : ' + keys)
        // Select among remaining keys
        if (keys.length > 0) {
          var id = keys[(keys.length * Math.random()) << 0];
        } else {
          var id = undefined;
        }
        //console.log('id : ' + id)
        break;
      case "by_id":
        var id = except_id[0];
        break;
      default:
        app.view.log("ERROR : thisWeekSelector, mode not recognised : " + mode);
    }
    return id;
  }
  thisWeekSelection_remove(id) {
    // TESTED
    this.myRecipies[id].thisweek = false;
    this.trigger("thisweek_update");
  }
  thisWeekSelection_replace(id) {
    // TESTED
    this.thisWeekSelection_remove(id);
    return this.thisWeekSelection_add([id]);
  }
  thisWeekSelection_renew() {
    // TESTED
    // Reset
    for (const [id, recp] of Object.entries(this.myRecipies)) {
      this.myRecipies[id].thisweek = false;
    }
    // Select
    var id_list = [];
    var target = this.settings.defaultWeeklyRecipies;
    if (
      this.settings.defaultWeeklyRecipies > Object.keys(this.myRecipies).length
    ) {
      target = Object.keys(this.myRecipies).length;
    }
    for (var i = 0; i < target; i++) {
      var id = this.thisWeekSelection_add(id_list);
      if (id !== undefined) {
        id_list.push(id);
      } else {
        break;
      }
    }
    this.trigger("thisweek_update");
    this.thisWeekSelection_ingredients_restart();
    return id_list;
  }
  thisWeekSelection_cooked(id) {
    // TODO
    if (this.myRecipies[id].cooked === true) {
      this.myRecipies[id].cooked = false;
    } else {
      this.myRecipies[id].cooked = true;
    }
    this.trigger("thisweek_update");
    this.thisWeekSelection_ingredients_restart();
  }
  thisWeekSelection_ingredients_restart() {
    // TESTED
    // Reset needs
    for (const [ing_key, ing] of Object.entries(this.ingredients)) {
      this.ingredients[ing_key].need = 0;
      /*console.log(ing_key + ' ' + this.ingredients[ing_key].need)*/
    }
    // Compute
    for (const [reCP_key, reCP] of Object.entries(this.myRecipies)) {
      if (reCP.thisweek === true && reCP.cooked === false) {
        for (const [ing_key, ing] of Object.entries(reCP.ingredients)) {
          if (ing.count > 0) {
            if (this.ingredients[ing_key] !== undefined) {
              this.ingredients[ing_key].need +=
                (ing.count * reCP.scaling) / reCP.portions;
            }
          }
        }
      }
    }
    this.trigger("thisweek_ingredient_update");
  }
  fridge_ingredients_restart() {
    // TESTED
    for (const [id, ing] of Object.entries(this.ingredients)) {
      this.ingredients[id].available = 0;
    }
    this.trigger("thisweek_update");
    this.trigger("fridge_update");
  }
  fridge_ingredients_toogle(id) {
    // TESTED
    this.ingredients[id].available = this.ingredients[id].need;
    this.trigger("thisweek_update");
    this.trigger("fridge_update");
  }
  fridge_ingredients_toogleOne(id, fridgeCounter) {
    // TESTED
    this.ingredients[id].available += fridgeCounter;
    this.trigger("thisweek_update");
    this.trigger("fridge_update");
  }
  fridge_ingredients_recover(id) {
    // TESTED
    this.ingredients[id].available = 0;
    this.trigger("thisweek_update");
    this.trigger("fridge_update");
  }
  shopping_ingredients_restart() {
    // TESTED
    for (const [id, ing] of Object.entries(this.ingredients)) {
      this.ingredients[id].shopping = 0;
    }
    this.trigger("shopping_update");
  }
  shopping_ingredients_toggle(id) {
    // TESTED
    this.ingredients[id].shopping =
      this.ingredients[id].need - this.ingredients[id].available;
    this.trigger("shopping_update");
  }
  shopping_ingredients_recover(id) {
    // TESTED
    this.ingredients[id].shopping = 0;
    this.trigger("shopping_update");
  }
  shopping_ingredients_makeavailable() {
    // TODO
    for (const [id, ing] of Object.entries(this.ingredients)) {
      if (this.ingredients[id].need > 0) {
        if (this.ingredients[id].shopping > 0) {
          this.ingredients[id].available += this.ingredients[id].shopping;
          this.ingredients[id].shopping = 0;
        }
      }
    }
    this.trigger("thisweek_update");
    this.trigger("fridge_update");
    this.trigger("shopping_update");
  }
  ingredients_update(scope, id, new_value) {
    // TODO
    //console.log('M.ingredients_update : ' + scope + ' (id:' + id + ')');
    // Update recipies
    for (const [recp_key, recp] of Object.entries(this.myRecipies)) {
      //console.log('recp_key : ' + recp_key);
      for (const [ing_key, ing] of Object.entries(recp.ingredients)) {
        //console.log('ing_key : ');
        //console.log(ing_key);
        if (ing_key === id) {
          switch (scope) {
            case "name":
              this.myRecipies[recp_key].ingredients[ing_key].name = new_value;
              break;
            case "unit":
              this.myRecipies[recp_key].ingredients[ing_key].unit = new_value;
              break;
            case "season":
              this.myRecipies[recp_key].ingredients[ing_key].season = new_value;
              break;
            default:
              console.log(
                "M.ingredients_update ERROR : scope not found " +
                  scope +
                  " (id:" +
                  id +
                  ")"
              );
          }
        }
      }
    }
    // Update ingredient unit list
    switch (scope) {
      case "name":
        this.ingredients[id]["name"] = new_value;
        break;
      case "unit":
        this.ingredients[id]["unit"] = new_value;
        break;
      case "season":
        this.ingredients[id]["season"] = new_value;
        break;
      default:
        console.log(
          "M.ingredients_update ERROR : scope not found " +
            scope +
            " (id:" +
            id +
            ")"
        );
    }
  }
  export_reCP() {
    // TESTED
    // Reference https://www.websparrow.org/web/how-to-create-and-save-text-file-in-javascript  https://www.cdnpkg.com/amcharts/file/FileSaver.min.js/
    var content = {
      version: "0.2",
      settings: app.model.settings,
      recipies: app.model.myRecipies,
      ingredients: app.model.ingredients
    };
    var blob = new Blob([JSON.stringify(content)], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "myRecipies.reCP");
  }
  import_reCP(reCP_file) {
    // TESTED
    var reader = new FileReader();
    reader.readAsText(reCP_file, "UTF-8");
    reader.onload = function (evt) {
      var content = JSON.parse(evt.target.result);
      app.model.content_load(content);
    };
    reader.onerror = function (evt) {
      console.log("ERROR : Reader error");
    };
  }
  content_load(content) {
    // TODO
    switch (content.version) {
      case "0.0":
        console.log("INFO : loading file version " + content.version);
        this.settings = content.settings;
        // Ingredients
        for (const [archive_name, archive_unit] of Object.entries(
          content.units
        )) {
          var id = random_id();
          while (id in Object.keys(content.units)) {
            id = random_id();
          }
          this.ingredients[id] = {
            name: archive_name,
            unit: archive_unit
          };
        }
        // Recipies
        for (const [key, recp] of Object.entries(content.recipies)) {
          var new_recp = new recipe(
            recp.name,
            recp.portions,
            recp.ingredients,
            recp.instructions
          );
          this.myRecipies[key] = new_recp;
        }
        this.trigger("myrecipies_update");
        this.trigger("ingredients_update");
        break;
      case "0.1":
        console.log("INFO : loading file version " + content.version);
        this.settings = content.settings;
        for (const [key, ing] of Object.entries(content.ingredients)) {
          var new_ing = {
            name: ing.name,
            unit: ing.unit,
            need: 0,
            available: 0,
            shopping: 0
          };
          this.ingredients[key] = new_ing;
        }
        for (const [key, recp] of Object.entries(content.recipies)) {
          var new_recp = new recipe(
            recp.name,
            recp.portions,
            recp.ingredients,
            recp.instructions
          );
          this.myRecipies[key] = new_recp;
        }
        this.trigger("myrecipies_update");
        this.trigger("ingredients_update");
        break;
      case "0.2":
        console.log("INFO : loading file version " + content.version);
        this.settings = content.settings;
        this.ingredients = content.ingredients;
        for (const [key, recp] of Object.entries(content.recipies)) {
          var new_recp = new recipe(
            recp.name,
            recp.portions,
            recp.ingredients,
            recp.instructions
          );
          new_recp.thisweek = recp.thisweek;
          new_recp.scaling = recp.scaling;
          this.myRecipies[key] = new_recp;
        }
        this.trigger("myrecipies_update");
        this.trigger("ingredients_update");
        break;
      default:
        console.log("ERROR : version not recognised");
    }
  }
  // BINDING
  bind(trigger, handler) {
    // TESTED
    console.log("M.bind " + trigger);
    this.bindings[trigger] = handler;
  }
  trigger(trigger) {
    // TESTED
    console.log("M.trigger " + trigger);
    if (typeof this.bindings[trigger] === "function") {
      this.bindings[trigger]();
    } else {
      this.bindings[trigger];
    }
  }
}
class recipe {
  // -
  constructor(name, portions, ingredients = {}, instructions = []) {
    // TESTED
    this.name = name;
    this.picture = undefined;
    this.portions = portions;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }
  // METHODS
  portions_update(newPortions) {
    // TESTED
    this.portions = newPortions;
  }
  ingredient_add(ingredient, id = undefined) {
    // TESTED
    if (id === undefined) {
      id = random_id();
      while (id in this.ingredients) {
        id = random_id();
      }
    }
    this.ingredients[id] = ingredient;
    return id;
  }
  ingredient_delete(id) {
    // TESTED
    delete this.ingredients[id];
  }
  ingredient_update(id, newCount) {
    // TESTED
    this.ingredients[id].count = newCount;
  }
  clean() {
    var ing_keys = Object.keys(this.ingredients);
    // Sum and delete duplicated ingredients
    for (var i = 0; i < ing_keys.length; i++) {
      for (var j = i + 1; j < ing_keys.length; j++) {
        if (
          this.ingredients[ing_keys[i]].name ===
          this.ingredients[ing_keys[j]].name
        ) {
          if (this.ingredients[ing_keys[j]].accounted === undefined) {
            this.ingredients[ing_keys[i]].count += this.ingredients[
              ing_keys[j]
            ].count;
            this.ingredients[ing_keys[j]].accounted = true;
          } else {
            if (!this.ingredients[ing_keys[j]].accounted) {
              this.ingredients[ing_keys[i]].count += this.ingredients[
                ing_keys[j]
              ].count;
              this.ingredients[ing_keys[j]].accounted = true;
            }
          }
        }
      }
    }
    for (var i = 0; i < ing_keys.length; i++) {
      if (this.ingredients[ing_keys[i]].accounted) {
        this.ingredient_delete(ing_keys[i]);
      }
    }
  }
  recipe_scale(portions) {
    // TESTED
    for (const [key, ing] of Object.entries(this.ingredients)) {
      this.ingredients[key].count *= portions / this.portions;
    }
    this.portions = portions;
  }
  copy() {
    // TESTED
    var ingredients = {};
    for (const [key, ing] of Object.entries(this.ingredients)) {
      ingredients[key] = ing;
    }
    var recipe_copy = new recipe(
      this.name,
      this.portions,
      ingredients,
      this.instructions
    );
    return recipe_copy;
  }
  print() {
    console.log("recipe");
    console.log("  . name : " + this.name);
    console.log("  . portions : " + this.portions);
    console.log("  . ingredients : ");
    for (const [key, ing] of Object.entries(this.ingredients)) {
      console.log("      . " + key + " : " + ing.count + " " + ing.name);
    }
    console.log("  . instructions : ");
    for (const [ins] of this.instructions) {
      console.log("      . " + ins);
    }
  }
}

// Data
let recp_view_sections = [
  // -
  "myrecipies_div",
  "thisweek_div",
  "fridge_div",
  "shopping_div",
  "recipeview_div",
  "recipeedit_div",
  "ingredients_div",
  "testsuite_div",
  "menu_div"
];
class V {
  // -
  // ATTRIBUTES
  constructor() {
    // -
    this.app = this.getElement("#root");
    this.navigations = [];
    this.currentRecipe = {
      id: undefined,
      source: undefined
    };
    this.snack = new S();
    this.log = new L();
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
    this.nav_bar_div = this.createElement(this.app, "div", "nav_bar_div");
    this.nav_bar_div.id = "nav_bar_div";
    this.nav_bar_button_menu = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_menu.textContent =
      recp_view_copy["nav_bar.button.menu.textContent"][app.language];
    this.nav_bar_button_myrecipies = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_myrecipies.textContent =
      recp_view_copy["nav_bar.button.myrecipies.textContent"][app.language];
    this.nav_bar_button_thisweek = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_thisweek.textContent =
      recp_view_copy["nav_bar.button.thisweek.textContent"][app.language];
    this.nav_bar_button_fridge = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_fridge.textContent =
      recp_view_copy["nav_bar.button.fridge.textContent"][app.language];
    this.nav_bar_button_shopping = this.createElement(
      this.nav_bar_div,
      "button",
      "nav_bar_button"
    );
    this.nav_bar_button_shopping.textContent =
      recp_view_copy["nav_bar.button.shopping.textContent"][app.language];

    // MENU
    this.menu_div = this.createElement(this.app, "div", "section_div");
    this.menu_div.id = "menu_div";

    this.menu_section_title = this.createElement(
      this.menu_div,
      "h2",
      "section_title"
    );
    this.menu_section_title.innerHTML =
      recp_view_copy["menu.section_title.innerHTML"][app.language];

    // Parameters
    this.menu_label_parameters = this.createElement(this.menu_div, "h4");
    this.menu_label_parameters.textContent =
      recp_view_copy["menu.label.parameters.textContent"][app.language];
    this.menu_button_navigates_myingredients = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_navigates_myingredients.textContent =
      recp_view_copy["menu.button.navigates_myingredients.textContent"][
        app.language
      ];

    // Archive management
    this.menu_label_archivemanagement = this.createElement(this.menu_div, "h4");
    this.menu_label_archivemanagement.textContent =
      recp_view_copy["menu.label.archivemanagement.textContent"][app.language];
    this.menu_label_export = this.createElement(this.menu_div, "p", "");
    this.menu_label_export.innerHTML =
      recp_view_copy["menu.label.export.innerHTML"][app.language];
    this.menu_button_export = this.createElement(this.menu_div, "button");
    this.menu_button_export.textContent =
      recp_view_copy["menu.button.export.textContent"][app.language];
    this.menu_label_import = this.createElement(this.menu_div, "p", "");
    this.menu_label_import.innerHTML =
      recp_view_copy["menu.label.import.innerHTML"][app.language];
    this.menu_button_import_filepath = this.createElement(
      this.menu_div,
      "input"
    );
    this.menu_button_import_filepath.textContent =
      recp_view_copy["menu.button.import_filepath.textContent"][app.language];
    this.menu_button_import_filepath.type = "file";
    this.menu_button_import_filepath.accept = ".reCP";
    this.menu_button_import_action = this.createElement(
      this.menu_div,
      "button"
    );
    this.menu_button_import_action.textContent =
      recp_view_copy["menu.button.import_action.textContent"][app.language];

    // Advanced parameters
    this.menu_label_advancedparameters = this.createElement(
      this.menu_div,
      "h4"
    );
    this.menu_label_advancedparameters.textContent =
      recp_view_copy["menu.label.advancedparameters.textContent"][app.language];

    this.menu_label_debug = this.createElement(
      this.menu_div,
      "label",
      "menu_checkbox_label"
    );
    this.menu_label_debug.innerHTML =
      recp_view_copy["menu.label.debug.innerHTML"][app.language];
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
        app.language
      ];

    this.menu_label_prod = this.createElement(
      this.menu_div,
      "label",
      "menu_checkbox_label"
    );
    this.menu_label_prod.innerHTML =
      recp_view_copy["menu.label.prod.innerHTML"][app.language];
    this.menu_checkbox_prod = this.createElement(
      this.menu_div,
      "input",
      "toggle_button"
    );
    this.menu_checkbox_prod.type = "checkbox";
    this.menu_checkbox_prod.id = "menu_checkbox_prod";

    // MY RECIPIES
    this.myrecipies_div = this.createElement(this.app, "div", "section_div");
    this.myrecipies_div.id = "myrecipies_div";
    this.myrecipies_section_title = this.createElement(
      this.myrecipies_div,
      "h2",
      "section_title"
    );
    this.myrecipies_section_title.innerHTML =
      recp_view_copy["myrecipies.section_title.innerHTML"][app.language];

    this.myrecipies_button_new = this.createElement(
      this.myrecipies_div,
      "button",
      "floating_button"
    );
    this.myrecipies_button_new.textContent =
      recp_view_copy["myrecipies.button.new.textContent"][app.language];

    this.myrecipies_ul = this.createElement(
      this.myrecipies_div,
      "ul",
      "recipe_ul"
    );
    // TODO

    // THIS WEEK RECIPIES
    this.thisweek_div = this.createElement(this.app, "div", "section_div");
    this.thisweek_div.id = "thisweek_div";
    this.thisweek_section_title = this.createElement(
      this.thisweek_div,
      "h2",
      "section_title"
    );
    this.thisweek_section_title.innerHTML =
      recp_view_copy["thisweek.section_title.innerHTML"][app.language];

    this.thisweek_button_renew = this.createElement(
      this.thisweek_div,
      "button",
      "TBD_button"
    );
    this.thisweek_button_renew.textContent =
      recp_view_copy["thisweek.button.renew.textContent"][app.language];
    this.thisweek_button_add = this.createElement(
      this.thisweek_div,
      "button",
      "floating_button"
    );
    this.thisweek_button_add.textContent =
      recp_view_copy["thisweek.button.add.textContent"][app.language];

    this.thisweek_toggle_seasonfilter = this.createElement(
      this.thisweek_div,
      "button",
      "toggle_button"
    );
    this.thisweek_toggle_seasonfilter.textContent =
      recp_view_copy["thisweek.toggle.seasonfilter.textContent"][app.language];
    if (app.model.settings.recipeSelector_filter_season) {
      this.thisweek_toggle_seasonfilter.classList.toggle("toggled");
    }

    this.thisweek_label_recipies = this.createElement(this.thisweek_div, "h4");
    this.thisweek_label_recipies.innerHTML =
      recp_view_copy["thisweek.label.recipies.innerHTML"][app.language];
    this.thisweek_ul = this.createElement(this.thisweek_div, "ul", "recipe_ul");

    this.thisweek_label_ingredients = this.createElement(
      this.thisweek_div,
      "h4"
    );
    this.thisweek_label_ingredients.innerHTML =
      recp_view_copy["thisweek.label.ingredients.innerHTML"][app.language];
    this.thisweek_ingredients_ul = this.createElement(
      this.thisweek_div,
      "ul",
      "ingredient_ul"
    );

    // FRIDGE INGREDIENTS
    this.fridge_div = this.createElement(this.app, "div", "section_div");
    this.fridge_div.id = "fridge_div";
    this.fridge_section_title = this.createElement(
      this.fridge_div,
      "h2",
      "section_title"
    );
    this.fridge_section_title.innerHTML =
      recp_view_copy["fridge.section_title.innerHTML"][app.language];

    this.fridge_button_restart = this.createElement(
      this.fridge_div,
      "button",
      "TBD_button"
    );
    this.fridge_button_restart.textContent =
      recp_view_copy["fridge.button.restart.textContent"][app.language];

    this.fridge_label_ingredients = this.createElement(this.fridge_div, "h4");
    this.fridge_label_ingredients.innerHTML =
      recp_view_copy["fridge.label.ingredients.innerHTML"][app.language];
    this.fridge_ul = this.createElement(this.fridge_div, "ul", "ingredient_ul");

    this.fridge_label_checkeding = this.createElement(this.fridge_div, "h4");
    this.fridge_label_checkeding.innerHTML =
      recp_view_copy["fridge.label.checkeding.innerHTML"][app.language];
    this.fridge_checkeding_ul = this.createElement(
      this.fridge_div,
      "ul",
      "ingredient_ul"
    );

    // SHOPPING LIST
    this.shopping_div = this.createElement(this.app, "div", "section_div");
    this.shopping_div.id = "shopping_div";
    this.shopping_section_title = this.createElement(
      this.shopping_div,
      "h2",
      "section_title"
    );
    this.shopping_section_title.innerHTML =
      recp_view_copy["shopping.section_title.innerHTML"][app.language];

    this.shopping_button_restart = this.createElement(
      this.shopping_div,
      "button",
      "TBD_button"
    );
    this.shopping_button_restart.textContent =
      recp_view_copy["shopping.button.restart.textContent"][app.language];

    this.shopping_button_add = this.createElement(
      this.shopping_div,
      "button",
      "floating_button"
    );
    this.shopping_button_add.textContent =
      recp_view_copy["shopping.button.add.textContent"][app.language];

    this.shopping_label_ingredients = this.createElement(
      this.shopping_div,
      "h4"
    );
    this.shopping_label_ingredients.innerHTML =
      recp_view_copy["shopping.label.ingredients.innerHTML"][app.language];
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
      recp_view_copy["shopping.label.checkeding.innerHTML"][app.language];
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
        app.language
      ];

    // RECIPE VIEWER
    this.recipeview_div = this.createElement(this.app, "div", "section_div");
    this.recipeview_div.id = "recipeview_div";
    this.recipeview_section_title = this.createElement(
      this.recipeview_div,
      "h2",
      "section_title"
    );
    this.recipeview_section_title.innerHTML =
      recp_view_copy["recipeview.section_title.innerHTML"][app.language];

    this.recipeview_button_delete = this.createElement(
      this.recipeview_div,
      "button",
      "floating_button"
    );
    this.recipeview_button_delete.textContent =
      recp_view_copy["recipeview.button.delete.textContent"][app.language];
    this.recipeview_button_edit = this.createElement(
      this.recipeview_div,
      "button",
      "floating_button"
    );
    this.recipeview_button_edit.textContent =
      recp_view_copy["recipeview.button.edit.textContent"][app.language];
    this.recipeview_button_select = this.createElement(
      this.recipeview_div,
      "button",
      "floating_button"
    );
    this.recipeview_button_select.textContent =
      recp_view_copy["recipeview.button.select.textContent"][app.language];

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
      recp_view_copy["recipeview.label.ingredient.innerHTML"][app.language];
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
      recp_view_copy["recipeview.label.instruction.innerHTML"][app.language];
    this.recipeview_instruction_ol = this.createElement(
      this.recipeview_div,
      "ol",
      "recipeview_instruction_ol"
    );

    // RECIPE EDITOR
    this.recipeedit_div = this.createElement(this.app, "div", "section_div");
    this.recipeedit_div.id = "recipeedit_div";
    this.recipeedit_section_title = this.createElement(
      this.recipeedit_div,
      "h2",
      "section_title"
    );
    this.recipeedit_section_title.innerHTML =
      recp_view_copy["recipeedit.section_title.innerHTML"][app.language];

    this.recipeedit_button_save = this.createElement(
      this.recipeedit_div,
      "button",
      "floating_button"
    );
    this.recipeedit_button_save.textContent =
      recp_view_copy["recipeedit.button.save.textContent"][app.language];

    this.recipeedit_label_name = this.createElement(
      this.recipeedit_div,
      "h4",
      "form_label"
    );
    this.recipeedit_label_name.innerHTML =
      recp_view_copy["recipeedit.label.name.innerHTML"][app.language];
    this.recipeedit_input_name = this.createElement(
      this.recipeedit_div,
      "input",
      "form_input"
    );
    this.recipeedit_input_name.id = "recipeedit_input_name";
    this.recipeedit_input_name.placeholder =
      recp_view_copy["recipeedit.input.name.placeholder"][app.language];

    this.recipeedit_label_portion = this.createElement(
      this.recipeedit_div,
      "h4",
      "form_label"
    );
    this.recipeedit_label_portion.innerHTML =
      recp_view_copy["recipeedit.label.portion.innerHTML"][app.language];
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
      recp_view_copy["recipeedit.label.ingredients.innerHTML"][app.language];
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
      recp_view_copy["recipeedit.label.instructions.innerHTML"][app.language];
    this.recipeedit_instruction_ol = this.createElement(
      this.recipeedit_div,
      "ol",
      "recipeedit_instruction_ol"
    );
    this.recipeedit_instruction_ol.id = "recipeedit_instruction_ol";

    // MY INGREDIENTS
    this.ingredients_div = this.createElement(this.app, "div", "section_div");
    this.ingredients_div.id = "ingredients_div";
    this.ingredients_section_title = this.createElement(
      this.ingredients_div,
      "h2",
      "section_title"
    );
    this.ingredients_section_title.innerHTML =
      recp_view_copy["ingredients.section_title.innerHTML"][app.language];

    this.ingredients_button_save = this.createElement(
      this.ingredients_div,
      "button",
      "TBD_button"
    );
    this.ingredients_button_save.textContent =
      recp_view_copy["ingredients.button.save.textContent"][app.language];

    this.ingredients_ol = this.createElement(
      this.ingredients_div,
      "ul",
      "ingredients_ol"
    );
    this.ingredients_ol.id = "ingredients_ol";

    // TEST SUITE
    this.testsuite_div = this.createElement(this.app, "div", "section_div");
    this.testsuite_div.id = "testsuite_div";
    this.testsuite_section_title = this.createElement(
      this.testsuite_div,
      "h2",
      "section_title"
    );
    this.testsuite_section_title.innerHTML =
      recp_view_copy["testsuite.section_title.innerHTML"][app.language];

    this.testsuite_label_testsuite = this.createElement(
      this.testsuite_div,
      "h3"
    );
    this.testsuite_label_testsuite.textContent =
      recp_view_copy["testsuite.label.testsuite.textContent"][app.language];
    this.testsuite_ul = this.createElement(this.testsuite_div, "ul");
    this.testsuite_ul.id = "testsuite_ul";

    this.testsuite_label_console = this.createElement(this.testsuite_div, "h3");
    this.testsuite_label_console.textContent =
      recp_view_copy["testsuite.label.console.textContent"][app.language];
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
      app.view.navigates_back();
    };

    // SNACK & LOG
    this.snack.build();
    this.log.build();

    // Neat UI
    this.neat_ui();

    // FOCUS
    if (app.debug_mode) {
      this.navigates("testsuite_div");
    } else {
      this.navigates("thisweek_div");
    }
  }
  neat_ui() {
    // TESTED
    if (app.debug_mode == false) {
      this.menu_checkbox_debug.checked = false;
      this.menu_label_prod.style.display = "none";
      this.menu_checkbox_prod.style.display = "none";
      this.menu_button_navigates_testsuite.style.display = "none";
    } else {
      this.menu_checkbox_debug.checked = true;
      this.menu_label_prod.style.display = "initial";
      this.menu_checkbox_prod.style.display = "initial";
      this.menu_button_navigates_testsuite.style.display = "initial";
      if (app.prod_mode) {
        this.menu_checkbox_prod.checked = true;
      } else {
        this.menu_checkbox_prod.checked = false;
      }
    }
  }
  populate(list, content = undefined, additionalcontent = undefined) {
    // TESTED
    app.view.log.add("V.populate " + list);
    switch (list) {
      case "myrecipies":
        this.myrecipies_ul.innerHTML = "";
        var sorted_myrecipies = dict_sorter(content, "name");
        if (sorted_myrecipies !== undefined) {
          for (var i = 0; i < sorted_myrecipies.length; i++) {
            var key = sorted_myrecipies[i];
            var recp = content[key];
            var recipe_li = this.createElement(
              this.myrecipies_ul,
              "li",
              "recipe_li"
            );
            recipe_li.id = key + "-myrecipies-li";
            var li_div = this.createElement(recipe_li, "div", "recipe_li_div");
            li_div.id = key + "-myrecipies-div";
            var li_label = this.createElement(
              li_div,
              "label",
              "recipe_li_label"
            );
            li_label.id = key + "-myrecipies-div";
            li_label.textContent = recp.name + " - " + recp.portions + " p.";
            // Delete & select
            if (!app.view.isMobile) {
              var li_button_delete = this.createElement(
                li_div,
                "button",
                "recipe_li_button"
              );
              li_button_delete.id = key + "-myrecipies-button-delete";
              li_button_delete.textContent =
                recp_view_copy["myrecipies.button.delete.textContent"][
                  app.language
                ];
              var li_button_select = this.createElement(
                li_div,
                "button",
                "recipe_li_button"
              );
              li_button_select.id = key + "-myrecipies-button-select";
              li_button_select.textContent =
                recp_view_copy["myrecipies.button.select.textContent"][
                  app.language
                ];
            }
          }
        }
        break;
      case "thisweekrecipies":
        this.thisweek_ul.innerHTML = "";
        var sorted_thisweekrecipies = dict_sorter(content, "name", [
          ["thisweek", false],
          ["thisweek", undefined]
        ]);
        if (sorted_thisweekrecipies !== undefined) {
          for (var i = 0; i < sorted_thisweekrecipies.length; i++) {
            if (content[sorted_thisweekrecipies[i]].thisweek == true) {
              var key = sorted_thisweekrecipies[i];
              var recp = content[key];
              var recipe_li = this.createElement(
                this.thisweek_ul,
                "li",
                "recipe_li"
              );
              recipe_li.id = key + "-thisweek-li";
              var li_div = this.createElement(
                recipe_li,
                "div",
                "recipe_li_div"
              );
              li_div.id = key + "-thisweek-div";
              var li_label = this.createElement(
                li_div,
                "label",
                "recipe_li_label"
              );
              li_label.id = key + "-thisweek-name";
              li_label.textContent = recp.name;
              if (content[sorted_thisweekrecipies[i]].cooked == true) {
                li_label.classList.toggle("strikethrough");
                var li_button_cooked = this.createElement(
                  li_div,
                  "button",
                  "recipe_li_button"
                );
                li_button_cooked.id = key + "-thisweek-button-cooked";
                li_button_cooked.textContent =
                  recp_view_copy["thisweek.button.recover.textContent"][
                    app.language
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
                li_scaling.textContent = recp.scaling;
                var li_button_addportion = this.createElement(
                  li_div,
                  "button",
                  "recipe_li_button"
                );
                li_button_addportion.id = key + "-thisweek-button-addportion";
                li_button_addportion.textContent = "+";
                // Delete, replace & cooked
                if (!app.view.isMobile) {
                  var li_button_delete = this.createElement(
                    li_div,
                    "button",
                    "recipe_li_button"
                  );
                  li_button_delete.id = key + "-thisweek-button-delete";
                  li_button_delete.textContent =
                    recp_view_copy["thisweek.button.delete.textContent"][
                      app.language
                    ];
                  var li_button_replace = this.createElement(
                    li_div,
                    "button",
                    "recipe_li_button"
                  );
                  li_button_replace.id = key + "-thisweek-button-replace";
                  li_button_replace.textContent =
                    recp_view_copy["thisweek.button.replace.textContent"][
                      app.language
                    ];
                  var li_button_cooked = this.createElement(
                    li_div,
                    "button",
                    "recipe_li_button"
                  );
                  li_button_cooked.id = key + "-thisweek-button-cooked";
                  li_button_cooked.textContent =
                    recp_view_copy["thisweek.button.cooked.textContent"][
                      app.language
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
          for (var i = 0; i < sorted_thisweekingredients.length; i++) {
            var key = sorted_thisweekingredients[i];
            var ingredient = content[key];
            if (ingredient.need != 0) {
              var ingredient_li = this.createElement(
                this.thisweek_ingredients_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-thisweek-li";
              var li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-thisweek-div";
              var li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-thisweek-name";
              li_label_name.textContent = ingredient.name;
              if (ingredient.need <= ingredient.available) {
                li_label_name.classList.toggle("strikethrough");
              }
              var li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-thisweek-count";
              li_label_count.textContent = ingredient.need;
              var li_label_unit = this.createElement(
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
          for (var i = 0; i < sorted_fridgelingredients.length; i++) {
            var key = sorted_fridgelingredients[i];
            var ingredient = content[key];
            // Ingredient need is not fulfilled
            if (
              ingredient.need != 0 &&
              ingredient.need > ingredient.available
            ) {
              var ingredient_li = this.createElement(
                this.fridge_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-fridge-li";
              var li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-fridge-div";
              var li_label_name = this.createElement(
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
              var li_label_count = this.createElement(
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
              var li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-fridge-unit";
              li_label_unit.textContent = ingredient.unit;
              // Toggle
              if (!app.view.isMobile) {
                var li_button_toggle = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_toggle.id = key + "-fridge-button-toggle";
                li_button_toggle.textContent =
                  recp_view_copy["fridge.button.toggle.textContent"][
                    app.language
                  ];
              }
            }
            // Ingredient is toogled
            if (
              ingredient.need != 0 &&
              ingredient.need == ingredient.available
            ) {
              var ingredient_li = this.createElement(
                this.fridge_checkeding_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-fridge-li";
              var li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-fridge-div";
              var li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-fridge-name";
              li_label_name.textContent = ingredient.name;
              // Count
              var li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-fridge-count";
              li_label_count.textContent =
                ingredient.available + "/" + ingredient.need;
              var li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-fridge-unit";
              li_label_unit.textContent = ingredient.unit;
              // Untoggle
              if (!app.view.isMobile) {
                var li_button_recover = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_recover.id = key + "-fridge-button-recover";
                li_button_recover.textContent =
                  recp_view_copy["fridge.button.recover.textContent"][
                    app.language
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
          for (var i = 0; i < sorted_shoppinglingredients.length; i++) {
            var key = sorted_shoppinglingredients[i];
            var ingredient = content[key];
            // Ingredient need is not fulfilled
            if (
              ingredient.need != 0 &&
              ingredient.need > ingredient.available &&
              ingredient.need - ingredient.available > ingredient.shopping
            ) {
              var ingredient_li = this.createElement(
                this.shopping_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-shopping-li";
              var li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-shopping-div";
              var li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-shopping-name";
              li_label_name.textContent = ingredient.name;
              var li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-shopping-count";
              li_label_count.textContent =
                ingredient.need - ingredient.available;
              var li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-shopping-unit";
              li_label_unit.textContent = ingredient.unit;
              // Toggle
              if (!app.view.isMobile) {
                var li_button_toggle = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_toggle.id = key + "-shopping-button-toggle";
                li_button_toggle.textContent =
                  recp_view_copy["fridge.button.toggle.textContent"][
                    app.language
                  ];
              }
            }
            // Ingredient is toogled
            if (
              ingredient.need != 0 &&
              ingredient.need > ingredient.available &&
              ingredient.need - ingredient.available == ingredient.shopping
            ) {
              var ingredient_li = this.createElement(
                this.shopping_checkeding_ul,
                "li",
                "ingredient_li"
              );
              ingredient_li.id = key + "-shopping-li";
              var li_div = this.createElement(
                ingredient_li,
                "div",
                "ingredient_li_div"
              );
              li_div.id = key + "-shopping-div";
              var li_label_name = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_name.id = key + "-shopping-name";
              li_label_name.textContent = ingredient.name;
              // Count
              var li_label_count = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_count.id = key + "-shopping-count";
              li_label_count.textContent =
                ingredient.need - ingredient.available;
              var li_label_unit = this.createElement(
                li_div,
                "label",
                "ingredient_li_label"
              );
              li_label_unit.id = key + "-shopping-unit";
              li_label_unit.textContent = ingredient.unit;
              // Untoggle
              if (!app.view.isMobile) {
                var li_button_recover = this.createElement(
                  li_div,
                  "button",
                  "ingredient_li_button"
                );
                li_button_recover.id = key + "-shopping-button-recover";
                li_button_recover.textContent =
                  recp_view_copy["fridge.button.recover.textContent"][
                    app.language
                  ];
              }
            }
          }
        }
        break;
      case "recipeedit":
        this.recipeedit_input_name.value = content.name;
        this.recipeedit_input_portion.value = content.portions;
        app.view.recipeedit_ingredient_ul.innerHTML = "";
        var sorted_ingredients = dict_sorter(content.ingredients, "name");
        if (sorted_ingredients !== undefined) {
          for (var i = 0; i < sorted_ingredients.length; i++) {
            var ing_key = sorted_ingredients[i];
            var ing = content.ingredients[ing_key];
            app.view.add_new_input_row("ingredient", [ing_key, ing]);
          }
        }
        app.view.add_new_input_row("ingredient", undefined, additionalcontent);
        app.view.recipeedit_instruction_ol.innerHTML = "";
        content.instructions.forEach(function (inst) {
          app.view.add_new_input_row("instruction", inst);
        });
        app.view.add_new_input_row("instruction");
        break;
      case "recipeview":
        this.recipeview_name_label.innerHTML = content.name;
        if (app.view.currentRecipe.source == "thisweek") {
          this.recipeview_portion_label.innerHTML =
            content.scaling + " portions";
        } else {
          this.recipeview_portion_label.innerHTML =
            content.portions + " portions";
        }
        app.view.recipeview_ingredient_ul.innerHTML = "";
        var sorted_ingredients = dict_sorter(content.ingredients, "name");
        if (sorted_ingredients !== undefined) {
          for (var i = 0; i < sorted_ingredients.length; i++) {
            var ing_key = sorted_ingredients[i];
            var ing = content.ingredients[ing_key];
            var ing_li = app.view.createElement(
              app.view.recipeview_ingredient_ul,
              "li",
              "recipeview_ingredient_li"
            );
            if (app.view.currentRecipe.source == "thisweek") {
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
        var sorted_ingredients = dict_sorter(content, "name");
        if (sorted_ingredients !== undefined) {
          for (var i = 0; i < sorted_ingredients.length; i++) {
            var ing_key = sorted_ingredients[i];
            var ing = content[ing_key];
            app.view.add_new_input_row("ingredient_edit", ing_key, ing);
          }
        }
        // Sort list

        break;
      default:
        app.view.log.add(
          "V.populate - ERROR : unswitched list " + list,
          "logerror"
        );
    }
  }
  add_new_input_row(row, content = undefined, additionalcontent = undefined) {
    // TESTED
    switch (row) {
      case "ingredient":
        var ing_li = app.view.createElement(
          app.view.recipeedit_ingredient_ul,
          "li",
          "recipeedit_ingredient_li"
        );
        if (content !== undefined) {
          var ing_id = content[0];
          var existing_ing = true;
        } else {
          var ing_id = random_id();
          var existing_ing = false;
        }
        ing_li.id = ing_id + "-recipeedit-ingredient-li";
        ing_li.setAttribute("existing_ing", existing_ing);
        var ing_input_name = app.view.createElement(
          ing_li,
          "input",
          "recipeedit_ingredient_input_name"
        );
        ing_input_name.id = ing_id + "-recipeedit-ingredient-name";
        var ing_input_count = app.view.createElement(
          ing_li,
          "input",
          "recipeedit_ingredient_input_count"
        );
        ing_input_count.id = ing_id + "-recipeedit-ingredient-count";
        var ing_input_unit = app.view.createElement(
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
            app.language
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
              app.language
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
              app.language
            ];
          ing_input_unit.placeholder =
            recp_view_copy["recipeedit.input.ing_input_unit.placeholder"][
              app.language
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
        var inst_li = app.view.createElement(
          app.view.recipeedit_instruction_ol,
          "li",
          "recipeedit_instruction_li"
        );
        var inst_id = random_id();
        inst_li.id = inst_id + "-recipeedit-instruction-li";
        var inst_input = app.view.createElement(
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
            app.language
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
              app.language
            ];
        }
        break;
      case "ingredient_edit":
        var ing_li = app.view.createElement(
          app.view.ingredients_ol,
          "li",
          "ingredient_edit_li"
        );
        ing_li.id = content + "-ingredient_edit-li";
        var ing_name_input = app.view.createElement(
          ing_li,
          "input",
          "ingredients_name_input"
        );
        ing_name_input.id = content + "-ingredient_edit-name-input";
        var ing_unit_input = app.view.createElement(
          ing_li,
          "input",
          "ingredients_unit_input"
        );
        ing_unit_input.id = content + "-ingredient_edit-unit-input";
        var ing_season_select = app.view.createElement(
          ing_li,
          "select",
          "ingredients_season_select"
        );
        ing_season_select.id = content + "-ingredient_edit-season-select";
        var ing_season_select_values = ["Toute l'année", "Ete", "Hiver"];
        for (const val of ing_season_select_values) {
          var option = app.view.createElement(ing_season_select, "option");
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
    }
  }
  navigates(section) {
    // TESTED
    app.view.log.add("V.navigates " + section);
    for (var i = 0; i < recp_view_sections.length; i++) {
      //console.log(recp_view_sections[i]);
      if (section == recp_view_sections[i]) {
        this.getElement("#" + section).style.display = "block";
      } else {
        this.getElement("#" + recp_view_sections[i]).style.display = "none";
      }
    }
    app.view.navigations.push(section);
  }
  navigates_back() {
    // V5
    app.view.log.add("V.navigates_back");
    if (app.view.navigations.length > 0) {
      var section = app.view.navigations.pop();
      for (var i = 0; i < recp_view_sections.length; i++) {
        //console.log(recp_view_sections[i]);
        if (section == recp_view_sections[i]) {
          this.getElement("#" + section).style.display = "block";
        } else {
          this.getElement("#" + recp_view_sections[i]).style.display = "none";
        }
      }
    }
  }
  bind(trigger, handler = undefined) {
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
        app.view.myrecipies_ul.addEventListener("click", (event) => {
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
        app.view.thisweek_ul.addEventListener("click", (event) => {
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
        app.view.fridge_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        app.view.fridge_checkeding_ul.addEventListener("click", (event) => {
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
        app.view.shopping_ul.addEventListener("click", (event) => {
          const id = event.target.id;
          handler(id);
        });
        app.view.shopping_checkeding_ul.addEventListener("click", (event) => {
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
        app.view.log.add(
          "V.bind - ERROR : unswitched trigger " + trigger,
          "logerror"
        );
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
    var arr_id = Object.keys(arr);

    /*for each item in the array...*/
    for (i = 0; i < arr_name.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (
        arr_name[i].substr(0, val.length).toUpperCase() == val.toUpperCase()
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
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
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
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
class S {
  // -
  constructor() {
    this.displaylist = {};
    this.container = undefined;
  }
  // METHODS
  build() {
    var b = app.view.getElement("#root");
    this.container = app.view.createElement(b, "div", "snackbar");
    this.container.id = "snackbar_div";
  }
  add(message, duration = 3000, color = "darkgrey") {
    app.view.log.add("SNACK : " + message, "loginfo");
    // Retreive content
    if (recp_view_copy[message] !== undefined) {
      var snack_message = recp_view_copy[message][app.language];
      var snack_color = recp_view_copy[message]["color"];
      if (snack_color === undefined) {
        snack_color = color;
      }
    } else {
      var snack_message = message;
      var snack_color = color;
    }
    // Check container
    if (app.view.snack.container === undefined) {
      app.view.log.add("ERROR : S.add not possible before S.build", "logerror");
    } else {
      // Create snack
      var id = random_id() + "-snack";
      var snack_div = app.view.createElement(
        app.view.getElement("#snackbar_div"),
        "div",
        ""
      );
      snack_div.id = id;
      snack_div.className = "snackmessage";
      snack_div.style.backgroundColor = snack_color;
      var snack_content = app.view.createElement(snack_div, "p", "");
      snack_content.innerHTML = snack_message;
      this.displaylist[id] = {
        div: snack_div,
        prio: -1
      };

      // Shift previous message
      app.view.snack.moveup();

      // Plan deletion
      setTimeout(function () {
        app.view.snack.remove(id);
      }, duration);
    }
    return id;
  }
  moveup() {
    var sorter = dict_sorter(app.view.snack.displaylist, "prio");
    for (var i = 0; i < sorter.length; i++) {
      app.view.snack.displaylist[sorter[i]]["prio"] += 1;
      app.view.snack.displaylist[sorter[i]]["div"].style.bottom =
        30 + 60 * i + "px";
    }
  }
  remove(id) {
    app.view.snack.displaylist[id]["div"].parentNode.removeChild(
      app.view.snack.displaylist[id]["div"]
    );
    delete app.view.snack.displaylist[id];
  }
}
class L {
  constructor() {
    this.container = undefined;
  }
  // METHODS
  build() {
    var console_div = app.view.getElement("#console_div");
    this.container = app.view.createElement(console_div, "ul", "console_ul");
  }
  add(message, flag = "lognormal") {
    const element = document.createElement("li");
    element.classList.add(flag);
    this.container.prepend(element);
    console.log(message);
    element.innerHTML = message;
  }
}

class C {
  // -
  // ATTRIBUTES
  constructor() {
    // -
    this.model = new M();
    this.view = new V();
    this.testsuite = new T();

    // Configuration
    this.language = "FR"; // FR, EN

    // Advanced parameters
    this.debug_mode = true;
    this.prod_mode = false;
  }
  // TESTS
  testsuite_run() {
    // TESTED
    this.testsuite.T_M();
    app.view.snack.add(
      recp_view_copy["snack.testsuite_run"][app.language],
      3000,
      recp_view_copy["snack.testsuite_run"]["color"]
    );
  }

  // METHODS
  bind() {
    // TESTED

    // VIEW BINDERS

    // MENU
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
      app.handle_model_currentRecipe_update
    );
    this.model.bind("myrecipies_update", app.handle_model_myrecipies_update);
    this.model.bind("thisweek_update", app.handle_model_thisweek_update);
    this.model.bind(
      "thisweek_ingredient_update",
      app.handle_model_thisweek_ingredient_update
    );
    this.model.bind("fridge_update", app.handle_model_fridge_update);
    this.model.bind("shopping_update", app.handle_model_shopping_update);
    this.model.bind("ingredients_update", app.handle_model_ingredients_update);
  }
  populate() {
    // TESTED
    app.view.log.add("C.populate");
    app.handle_model_myrecipies_update();
    app.handle_model_thisweek_update();
    app.handle_model_fridge_update();
    app.handle_model_shopping_update();
    app.handle_model_ingredients_update();
  }
  handle_view_menu_debugmode() {
    // TESTED
    app.view.log.add("C.handle_view_menu_debugmode to " + !app.debug_mode);
    if (app.debug_mode) {
      app.debug_mode = false;
      app.view.snack.add("snack.closing_debug_mode");
    } else {
      app.debug_mode = true;
      app.view.snack.add("snack.opening_debug_mode");
    }
    app.view.neat_ui();
  }
  handle_view_menu_prodmode() {
    // TESTED
    app.view.log.add("C.handle_view_menu_prodmode to " + !app.debug_mode);
    if (app.prod_mode) {
      app.prod_mode = false;
      app.view.snack.add("snack.closing_prod_mode");
    } else {
      app.prod_mode = true;
      app.view.snack.add("snack.opening_prod_mode");
    }
    app.view.neat_ui();
  }
  handle_view_menu_export() {
    // TESTED
    app.view.log.add("C.handle_view_menu_export");
    app.view.snack.add("snack.exporting_archive");
    app.model.export_reCP();
  }
  handle_view_menu_import() {
    // TESTED
    app.view.log.add("C.handle_view_menu_import");
    if (app.view.menu_button_import_filepath.files[0] !== undefined) {
      app.model.import_reCP(app.view.menu_button_import_filepath.files[0]);
      app.view.snack.add("snack.importing_archive");
    } else {
      app.view.log.add("INFO : No file to import", "loginfo");
      app.view.snack.add("snack.import_empty");
    }
  }
  handle_view_myRecipies_new() {
    // TESTED
    app.view.log.add("C.handle_view_myRecipies_new");
    app.model.currentRecipe = new recipe(
      "",
      app.model.settings.defaultPortions
    );
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
    // TESTED
    app.view.log.add("C.handle_view_myRecipies_interact : " + id);
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "select":
            app.view.log.add(
              "C.handle_view_myRecipies_interact.select : " + id_data[0]
            );
            app.model.myRecipies_select(id_data[0]);
            app.handle_model_thisweek_update();
            app.view.navigates("thisweek_div");
            break;
          case "delete":
            app.view.log.add(
              "C.handle_view_myRecipies_interact.delete : " + id_data[0]
            );
            app.model.myRecipies_delete(id_data[0]);
            break;
          default:
            app.view.log.add(
              "Error : recipe button not recognised : " + id,
              "logerror"
            );
        }
        break;
      case "name":
        if (app.model.select_recipe("myrecipies", id_data[0])) {
          app.view.log.add("C.handle_view_myRecipies_interact.name");
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
          app.view.log.add(
            "Error : recipe id not recognised : " + id_data[0],
            "logerror"
          );
        }
        break;
      case "div":
        if (app.model.select_recipe("myrecipies", id_data[0])) {
          app.view.log.add("C.handle_view_myRecipies_interact.div");
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
          app.view.log.add(
            "Error : recipe id not recognised : " + id_data[0],
            "logerror"
          );
        }
        break;
      default:
        app.view.log.add("Error : clic not recognised : " + id, "logerror");
    }
  };
  handle_view_thisWeek_renew() {
    // TESTED
    app.view.log.add("C.handle_view_thisWeek_renew");
    app.model.thisWeekSelection_renew();
    app.view.snack.add("snack.thisweek_renewed");
    app.model.thisWeekSelection_ingredients_restart();
    app.handle_model_thisweek_update();
  }
  handle_view_thisWeek_add() {
    // TESTED
    app.view.log.add("C.handle_view_thisWeek_add");
    app.model.thisWeekSelection_add();
    app.model.thisWeekSelection_ingredients_restart();
    app.handle_model_thisweek_update();
  }
  handle_view_thisWeek_interact = (id) => {
    // TESTED
    app.view.log.add("C.handle_view_thisWeek_interact : " + id);
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "addportion":
            app.view.log.add("C.handle_view_thisWeek_interact.addportion");
            app.model.myRecipies[id_data[0]].scaling += 1;
            app.handle_model_thisweek_update();
            app.model.thisWeekSelection_ingredients_restart();
            break;
          case "removeportion":
            app.view.log.add("C.handle_view_thisWeek_interact.removeportion");
            app.model.myRecipies[id_data[0]].scaling = Math.max(
              app.model.myRecipies[id_data[0]].scaling - 1,
              1
            );
            app.handle_model_thisweek_update();
            app.model.thisWeekSelection_ingredients_restart();
            break;
          case "replace":
            app.view.log.add(
              "C.handle_view_thisWeek_interact.replace : " + id_data[0]
            );
            app.model.thisWeekSelection_add();
            app.model.thisWeekSelection_remove(id_data[0]);
            app.view.snack.add("snack.thisweek_replaced");
            app.model.thisWeekSelection_ingredients_restart();
            break;
          case "cooked":
            app.view.log.add(
              "C.handle_view_thisWeek_interact.cooked : " + id_data[0]
            );
            app.model.thisWeekSelection_cooked(id_data[0]);
            app.view.snack.add("snack.thisweek_cooked");
            break;
          case "delete":
            app.view.log.add(
              "C.handle_view_thisWeek_interact.delete : " + id_data[0]
            );
            app.model.thisWeekSelection_remove(id_data[0]);
            app.model.thisWeekSelection_ingredients_restart();
            break;
          default:
            app.view.log.add(
              "Error : recipe button not recognised : " + id,
              "logerror"
            );
        }
        break;
      case "name":
        if (app.model.select_recipe("thisweek", id_data[0])) {
          app.view.log.add(
            "C.handle_view_thisWeek_interact.name : " + id_data[0]
          );
          app.view.currentRecipe.id = id_data[0];
          app.view.currentRecipe.source = "thisweek";
          app.model.currentRecipe =
            app.model.myRecipies[app.view.currentRecipe.id];
          app.view.populate("recipeedit", app.model.currentRecipe);
          app.view.navigates("recipeview_div");
        } else {
          app.view.log.add(
            "Error : recipe id not found : " + id_data[0],
            "logerror"
          );
        }
        break;
      case "div":
        if (app.model.select_recipe("thisweek", id_data[0])) {
          app.view.log.add(
            "C.handle_view_thisWeek_interact.div : " + id_data[0]
          );
          app.view.currentRecipe.id = id_data[0];
          app.view.currentRecipe.source = "thisweek";
          app.model.currentRecipe =
            app.model.myRecipies[app.view.currentRecipe.id];
          app.view.populate("recipeedit", app.model.currentRecipe);
          app.view.navigates("recipeview_div");
        } else {
          app.view.log.add(
            "Error : recipe id not found : " + id_data[0],
            "logerror"
          );
        }
        break;
      default:
        app.view.log.add("Error : clic not recognised : " + id, "logerror");
    }
  };
  handle_view_thisWeek_seasonFilter() {
    // TESTED
    app.view.log.add("C.handle_view_thisWeek_seasonFilter");
    if (app.model.settings.recipeSelector_filter_season) {
      app.model.settings.recipeSelector_filter_season = false;
    } else {
      app.model.settings.recipeSelector_filter_season = true;
    }
  }
  handle_view_fridge_restart() {
    // TESTED
    app.view.log.add("C.handle_view_fridge_restart");
    app.model.fridge_ingredients_restart();
  }
  handle_view_fridge_interact = (id) => {
    // TESTED
    app.view.log.add("C.handle_view_fridge_interact : " + id);
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "add":
            app.view.log.add("C.handle_view_fridge_interact.add");
            app.model.fridge_ingredients_toogleOne(id_data[0], 1);
            break;
          case "remove":
            app.view.log.add("C.handle_view_fridge_interact.remove");
            app.model.fridge_ingredients_toogleOne(id_data[0], -1);
            break;
          case "toggle":
            app.view.log.add(
              "C.handle_view_fridge_interact.toggle : " + id_data[0]
            );
            app.model.fridge_ingredients_toogle(id_data[0]);
            app.view.snack.add("snack.fridge_toogle");
            break;
          case "recover":
            app.view.log.add(
              "C.handle_view_fridge_interact.recover : " + id_data[0]
            );
            app.model.fridge_ingredients_recover(id_data[0]);
            app.view.snack.add("snack.fridge_recover");
            break;
          default:
            app.view.log.add(
              "Error : ingredient button not recognised : " + id,
              "logerror"
            );
        }
        break;
      default:
        app.view.log.add("Error : clic not recognised : " + id, "logerror");
    }
  };
  // J'ai aussi
  handle_view_shopping_restart() {
    // TESTED
    app.view.log.add("C.handle_view_shopping_restart");
    app.model.shopping_ingredients_restart();
  }
  handle_view_shopping_interact = (id) => {
    // TESTED
    app.view.log.add("C.handle_view_shopping_interact : " + id);
    var id_data = id.split("-");
    switch (id_data[2]) {
      case "button":
        switch (id_data[3]) {
          case "toggle":
            app.view.log.add(
              "C.handle_view_shopping_interact.toggle : " + id_data[0]
            );
            app.model.shopping_ingredients_toggle(id_data[0]);
            app.view.snack.add("snack.shopping_toogle");
            break;
          case "recover":
            app.view.log.add(
              "C.handle_view_shopping_interact.recover : " + id_data[0]
            );
            app.model.shopping_ingredients_recover(id_data[0]);
            app.view.snack.add("snack.shopping_recover");
            break;
          default:
            app.view.log.add(
              "Error : ingredient button not recognised : " + id,
              "logerror"
            );
        }
        break;
      default:
        app.view.log.add("Error : clic not recognised : " + id, "logerror");
    }
  };
  handle_view_shopping_add() {
    // V4
    app.view.log.add("C.handle_view_shopping_add");

    app.view.snack.add("snack.functionality_unavailable");
  }
  handle_view_shopping_makeavailable() {
    // TESTED
    app.view.log.add("C.handle_view_shopping_makeavailable");
    app.model.shopping_ingredients_makeavailable();
    app.view.snack.add("snack.shopping_madeavailable");
  }
  handle_view_viewRecipe_edit() {
    // TESTED
    app.view.log.add("C.handle_view_viewRecipe_edit");
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
    // TESTED
    app.view.log.add("C.handle_view_viewRecipe_delete");
    app.model.myRecipies_delete(app.view.currentRecipe.id);
    app.view.currentRecipe.source = undefined;
    app.view.currentRecipe.id = undefined;
    app.model.currentRecipe = undefined;
    app.view.navigates("myrecipies_div");
    app.view.snack.add(
      recp_view_copy["snack.viewrecipe_deleted"][app.language],
      3000,
      recp_view_copy["snack.viewrecipe_deleted"]["color"]
    );
  }
  handle_view_viewRecipe_select() {
    // TESTED
    app.view.log.add("C.handle_view_viewRecipe_select");
    app.model.thisWeekSelection_add([app.view.currentRecipe.id], "by_id");
    app.model.thisWeekSelection_ingredients_restart();
    app.handle_model_thisweek_update();
    app.view.navigates("thisweek_div");
    app.view.snack.add(
      recp_view_copy["snack.viewrecipe_selected"][app.language],
      3000,
      recp_view_copy["snack.viewrecipe_selected"]["color"]
    );
  }
  handle_view_editRecipe_save() {
    // TESTED
    app.view.log.add("C.handle_view_editRecipe_save");

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
      if (trigger_value != "" && trigger_value !== undefined) {
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
        app.view.snack.add("snack.recipeedit_saved");
      }
    }

    app.view.populate("recipeview", app.model.currentRecipe);
    app.view.navigates("recipeview_div");
  }
  handle_view_ingredients_save() {
    // TESTED
    app.view.log.add("C.handle_view_ingredients_save");
    // Ingredients
    [].forEach.call(app.view.ingredients_ol.childNodes, function (child) {
      var child_data = child.id.split("-");
      var trigger_value = document.getElementById(
        child_data[0] + "-ingredient_edit-name-input"
      ).value;
      if (trigger_value != "" && trigger_value !== undefined) {
        //console.log('' + document.getElementById(child_data[0] + '-ingredient_edit-name-input').value)
        //console.log('' + app.model.ingredients[child_data[0]].name)
        if (
          document.getElementById(child_data[0] + "-ingredient_edit-name-input")
            .value != app.model.ingredients[child_data[0]].name
        ) {
          app.model.ingredients_update(
            "name",
            child_data[0],
            document.getElementById(
              child_data[0] + "-ingredient_edit-name-input"
            ).value
          );
        }
        //console.log('' + document.getElementById(child_data[0] + '-ingredient_edit-unit-input').value)
        //console.log('' + app.model.ingredients[child_data[0]].unit)
        if (
          document.getElementById(child_data[0] + "-ingredient_edit-unit-input")
            .value != app.model.ingredients[child_data[0]].unit
        ) {
          app.model.ingredients_update(
            "unit",
            child_data[0],
            document.getElementById(
              child_data[0] + "-ingredient_edit-unit-input"
            ).value
          );
        }
        //console.log('' + document.getElementById(child_data[0] + '-ingredient_edit-season-select').value)
        //console.log('' + app.model.ingredients[child_data[0]].season)
        if (
          document.getElementById(
            child_data[0] + "-ingredient_edit-season-select"
          ).value != app.model.ingredients[child_data[0]].season
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
    app.view.snack.add(
      recp_view_copy["snack.ingredients_saved"][app.language],
      3000,
      recp_view_copy["snack.ingredients_saved"]["color"]
    );
  }
  handle_model_currentRecipe_update() {
    // TESTED
    app.view.log.add("C.handle_model_currentRecipe_update");
    app.view.populate("recipeview", app.model.currentRecipe);
  }
  handle_model_myrecipies_update() {
    // TESTED
    app.view.log.add("C.handle_model_myrecipies_update");
    app.view.populate("myrecipies", app.model.myRecipies);
  }
  handle_model_thisweek_update() {
    // TESTED
    app.view.log.add("C.handle_model_thisweek_update");
    app.view.populate("thisweekrecipies", app.model.myRecipies);
    app.model.thisWeekSelection_ingredients_restart();
  }
  handle_model_thisweek_ingredient_update() {
    // TESTED
    app.view.populate("thisweekingredients", app.model.ingredients);
    app.handle_model_fridge_update();
  }
  handle_model_fridge_update() {
    // TESTED
    app.view.log.add("C.handle_model_fridge_update");
    app.view.populate("fridgelist", app.model.ingredients);
    app.handle_model_shopping_update();
  }
  handle_model_shopping_update() {
    // TESTED
    app.view.log.add("C.handle_model_shopping_update");
    app.view.populate("shoppinglist", app.model.ingredients);
  }
  handle_model_ingredients_update() {
    // TESTED
    app.view.log.add("C.handle_model_ingredients_update");
    app.view.populate("ingredientList", app.model.ingredients);
    app.handle_model_thisweek_update();
  }
}

class T {
  // -
  constructor() {
    this.container = "testsuite_ul";
  }
  T_M() {
    console.log("+-----------------------------+");
    console.log("|  RUNNING MODEL TEST SUITES  |");
    console.log("+-----------------------------+");

    var unitest_data = this.T_M_myRecipies();
    unitest_data.run_test();
    unitest_data.print(this.container);
    //unitest_data.log(0);

    var unitest_data = this.T_M_thisWeekSelection();
    unitest_data.run_test();
    unitest_data.print(this.container);
    //unitest_data.log(0);

    var unitest_data = this.T_M_fridge();
    unitest_data.run_test();
    unitest_data.print(this.container);
    //unitest_data.log(0);

    var unitest_data = this.T_M_shopping();
    unitest_data.run_test();
    unitest_data.print(this.container);
    //unitest_data.log(0);

    var unitest_data = this.T_V_recipeedit();
    unitest_data.run_test();
    unitest_data.print(this.container);
    //unitest_data.log(0);

    var toggler = document.getElementsByClassName("caret");
    for (var i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }

    console.log("+-----------------------------+");
    console.log("|    MODEL TEST SUITES END    |");
    console.log("+-----------------------------+");
  }
  T_M_myRecipies(level = 0) {
    // Data
    var test_data = new unitest("myRecipies (functions)", 0);

    // Tests
    var model = new M();
    var recp = new recipe("dummy recipe", 4);
    var poireau_id = recp.ingredient_add({ name: "Poireaux", count: 200 });
    var carotte_id = recp.ingredient_add({ name: "Carottes", count: 300 });
    var other_recp = recp;
    other_recp.recipe_scale(2);

    model.currentRecipe = recp;
    var id = model.myRecipies_save();
    var subsubtest_data_1 = new unitest("save new", level + 1);
    subsubtest_data_1.expectation = 1;
    subsubtest_data_1.result = Object.keys(model.myRecipies).length;
    test_data.add_subtest(subsubtest_data_1);

    model.myRecipies_delete(id);
    var subsubtest_data_2 = new unitest("delete", level + 1);
    subsubtest_data_2.expectation = 0;
    subsubtest_data_2.result = Object.keys(model.myRecipies).length;
    test_data.add_subtest(subsubtest_data_2);

    model.currentRecipe = other_recp;
    id = model.myRecipies_save(id);
    var subsubtest_data_3 = new unitest("save portions", level + 1);
    subsubtest_data_3.expectation = 2;
    subsubtest_data_3.result = model.myRecipies[id].portions;
    test_data.add_subtest(subsubtest_data_3);

    var subsubtest_data_4 = new unitest("save ingredients", level + 1);
    subsubtest_data_4.expectation = 150;
    subsubtest_data_4.result =
      model.myRecipies[id].ingredients[carotte_id].count;
    test_data.add_subtest(subsubtest_data_4);

    var recipe_selection = model.myRecipies_select(id);
    var subsubtest_data_5 = new unitest("select status", level + 1);
    subsubtest_data_5.expectation = true;
    subsubtest_data_5.result = recipe_selection;
    test_data.add_subtest(subsubtest_data_5);

    var subsubtest_data_6 = new unitest("select added", level + 1);
    subsubtest_data_6.expectation = 1;
    subsubtest_data_6.result = dict_count_values(
      model.myRecipies,
      "thisweek",
      true
    );
    test_data.add_subtest(subsubtest_data_6);

    // Record
    return test_data;
  }
  T_M_thisWeekSelection(level = 0) {
    // Data
    var test_data = new unitest("thisWeekSelection (functions)", 0);

    // Tests
    var model = new M();
    var recp_1 = new recipe("dummy recipe 1", 1);
    recp_1.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
    recp_1.ingredient_add({ name: "Carottes", count: 300, need: 0 });
    model.currentRecipe = recp_1;
    model.myRecipies_save();
    var recp_2 = new recipe("dummy recipe 2", 2);
    recp_2.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
    recp_2.ingredient_add({ name: "Carottes", count: 300, need: 0 });
    model.currentRecipe = recp_2;
    model.myRecipies_save();
    var recp_3 = new recipe("dummy recipe 3", 3);
    recp_3.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
    recp_3.ingredient_add({ name: "Carottes", count: 300, need: 0 });
    model.currentRecipe = recp_3;
    model.myRecipies_save();
    var recp_4 = new recipe("dummy recipe 4", 4);
    recp_4.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
    recp_4.ingredient_add({ name: "Carottes", count: 300, need: 0 });
    model.currentRecipe = recp_4;
    model.myRecipies_save();

    var id = model.thisWeekSelection_add();
    var subsubtest_data_1 = new unitest("add", level + 1);
    subsubtest_data_1.expectation = 1;
    subsubtest_data_1.result = dict_count_values(
      model.myRecipies,
      "thisweek",
      true
    );
    test_data.add_subtest(subsubtest_data_1);

    model.thisWeekSelection_remove(id);
    var subsubtest_data_2 = new unitest("delete", level + 1);
    subsubtest_data_2.expectation = 0;
    subsubtest_data_2.result = dict_count_values(
      model.myRecipies,
      "thisweek",
      true
    );
    test_data.add_subtest(subsubtest_data_2);

    var id_added = model.thisWeekSelection_add();
    var id_recplaced = model.thisWeekSelection_replace(id_added);
    var subsubtest_data_3 = new unitest("replace", level + 1);
    subsubtest_data_3.expectation = id_added;
    subsubtest_data_3.test = "!=";
    subsubtest_data_3.result = id_recplaced;
    test_data.add_subtest(subsubtest_data_3);

    var id_list = model.thisWeekSelection_renew();
    var subsubtest_data_4 = new unitest("renew", level + 1);
    subsubtest_data_4.expectation = model.settings.defaultWeeklyRecipies;
    subsubtest_data_4.result = id_list.length;
    test_data.add_subtest(subsubtest_data_4);

    // To delete
    /*model.thisWeekSelection_scale(id_list[0], 10);
		var subsubtest_data_5 = new unitest("scale", level+1);
		subsubtest_data_5.expectation = 10;
		subsubtest_data_5.result = model.mykRecipies[id_list[0]].portions;
		test_data.add_subtest(subsubtest_data_5);
		*/

    test_data.add_subtest(this.T_M_thisWeekSelector(level + 1));

    // Record
    return test_data;
  }
  T_M_thisWeekSelector(level = 0) {
    // Data
    var test_data = new unitest("selector", 0);

    // Tests
    var model = new M();

    var subsubtest_data_1 = new unitest("empty (no recipies)", level + 1);
    subsubtest_data_1.expectation = undefined;
    subsubtest_data_1.result = model.thisWeekSelector([], "random");
    test_data.add_subtest(subsubtest_data_1);

    var recp_1 = new recipe("dummy recipe 1", 1);
    recp_1.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
    recp_1.ingredient_add({ name: "Carottes", count: 300, need: 0 });
    model.currentRecipe = recp_1;
    model.myRecipies_save();
    var recp_2 = new recipe("dummy recipe 2", 2);
    recp_2.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
    recp_2.ingredient_add({ name: "Bétraves", count: 300, need: 0 });
    model.currentRecipe = recp_2;
    model.myRecipies_save();

    var subsubtest_data_2 = new unitest(
      "empty (complete filtering)",
      level + 1
    );
    subsubtest_data_2.expectation = undefined;
    subsubtest_data_2.result = model.thisWeekSelector(
      Object.keys(model.myRecipies),
      "random"
    );
    test_data.add_subtest(subsubtest_data_2);

    var subsubtest_data_3 = new unitest("by_id", level + 1);
    subsubtest_data_3.expectation = Object.keys(model.myRecipies)[0];
    subsubtest_data_3.result = model.thisWeekSelector(
      [Object.keys(model.myRecipies)[0]],
      "by_id"
    );
    test_data.add_subtest(subsubtest_data_3);

    var subsubtest_data_4 = new unitest("random", level + 1);
    subsubtest_data_4.expectation = undefined;
    subsubtest_data_4.test = "!=";
    subsubtest_data_4.result = model.thisWeekSelector([], "random");
    test_data.add_subtest(subsubtest_data_4);

    var keys = Object.keys(model.myRecipies);
    var last_id = keys.pop();
    var subsubtest_data_5 = new unitest(
      "random filtering (unique choice)",
      level + 1
    );
    subsubtest_data_5.expectation = last_id;
    subsubtest_data_5.result = model.thisWeekSelector(keys, "random");
    test_data.add_subtest(subsubtest_data_5);

    var keys = Object.keys(model.myRecipies);
    var ing_keys = Object.keys(model.ingredients);
    //console.log('model : ')
    //console.log(model)
    //console.log('ing_keys : ' + ing_keys)
    model.ingredients_update("season", ing_keys[1], "Ete");
    model.ingredients_update("season", ing_keys[2], "Hiver");
    var today = new Date();
    var thismonth = today.getMonth() + 1;
    //console.log('thismonth : ' + thismonth)
    if (thismonth < 4 || 9 < thismonth) {
      var thisseasonrecipe = keys[1];
    } else {
      var thisseasonrecipe = keys[0];
    }
    var subsubtest_data_6 = new unitest(
      "random filtering (during season)",
      level + 1
    );
    subsubtest_data_6.expectation = thisseasonrecipe;
    subsubtest_data_6.result = model.thisWeekSelector([], "random");
    test_data.add_subtest(subsubtest_data_6);

    // Record
    return test_data;
  }
  T_M_fridge(level = 0) {
    // Data
    var test_data = new unitest("fridge (functions)", 0);

    const dummy_content = {
      version: "0.1",
      settings: { defaultPortions: 4, defaultWeeklyRecipies: 3 },
      recipies: {
        "0d0aa90a": {
          name: "Tarte aux carottes",
          portions: "2",
          ingredients: {
            "6d9f6460": { name: "Légumes : Carottes", count: 500, unit: "g" },
            "9413b158": { name: "Légumes : Oignons", count: 1, unit: "u" },
            "1586ebd8": { name: "Oeufs", count: 2, unit: "u" }
          },
          instructions: []
        },
        a8abee08: {
          name: "Tarte aux poireaux",
          portions: "2",
          ingredients: {
            "94sdb158": { name: "Légumes : Poireaux", count: 6, unit: "u" }
          },
          instructions: ["Couper les poireaux"]
        },
        "0e35c6be": {
          name: "Salade d'automne",
          portions: "2",
          ingredients: {
            c5fdaeec: {
              name: "Légumes : Endives",
              count: 6,
              unit: "u",
              existing_ing: "false"
            },
            "1af14b89": {
              name: "Fruits : Pommes",
              count: 1,
              unit: "u",
              existing_ing: "false"
            }
          },
          instructions: []
        },
        "2f0afa9b": {
          name: "mazkedzmùakdeùaz",
          portions: "4",
          ingredients: {},
          instructions: []
        }
      },
      ingredients: {
        "6d9f6460": { name: "Légumes : Carottes", unit: "g" },
        "9413b158": { name: "Légumes : Oignons", unit: "u" },
        "1586ebd8": { name: "Oeufs", unit: "u" },
        "94sdb158": { name: "Légumes : Poireaux", unit: "u" },
        c5fdaeec: { name: "Légumes : Endives", unit: "u" },
        "1af14b89": { name: "Fruits : Pommes", unit: "u" }
      }
    };

    // Tests
    const model = new M();
    model.content_load(dummy_content);
    model.thisWeekSelection_renew();
    model.thisWeekSelection_ingredients_restart();

    var subsubtest_data_1 = new unitest("list not empty", level + 1);
    subsubtest_data_1.expectation = 0;
    subsubtest_data_1.test = "<";
    subsubtest_data_1.result = Object.keys(model.ingredients).length;
    test_data.add_subtest(subsubtest_data_1);

    var need_flag = false;
    for (const [ing_key, ing] of Object.entries(model.ingredients)) {
      if (ing.need !== undefined) {
        need_flag = true;
        break;
      }
    }

    var need_key = -1;
    for (const [ing_key, ing] of Object.entries(model.ingredients)) {
      if (ing.need > 0) {
        need_key = ing_key;
        break;
      }
    }

    var subsubtest_data_2 = new unitest("need occurences", level + 1);
    subsubtest_data_2.expectation = true;
    subsubtest_data_2.result = need_flag;
    test_data.add_subtest(subsubtest_data_2);

    model.fridge_ingredients_restart();

    var subsubtest_data_3 = new unitest("need is null", level + 1);
    subsubtest_data_3.expectation = 0;
    subsubtest_data_3.result = model.ingredients[need_key].available;
    test_data.add_subtest(subsubtest_data_3);

    const previous_count = model.ingredients[need_key].available;
    model.fridge_ingredients_toogleOne(need_key, +10);

    var subsubtest_data_4 = new unitest("need is toogled by 10", level + 1);
    subsubtest_data_4.expectation = previous_count + 10;
    subsubtest_data_4.result = model.ingredients[need_key].available;
    test_data.add_subtest(subsubtest_data_4);

    model.fridge_ingredients_restart();
    model.fridge_ingredients_toogle(need_key);

    var subsubtest_data_5 = new unitest(
      "need is toogled completely",
      level + 1
    );
    subsubtest_data_5.expectation = model.ingredients[need_key].need;
    subsubtest_data_5.result = model.ingredients[need_key].available;
    test_data.add_subtest(subsubtest_data_5);

    model.fridge_ingredients_recover(need_key);

    var subsubtest_data_6 = new unitest("need is back to null", level + 1);
    subsubtest_data_6.expectation = 0;
    subsubtest_data_6.result = model.ingredients[need_key].available;
    test_data.add_subtest(subsubtest_data_6);

    // Record
    return test_data;
  }
  T_M_shopping(level = 0) {
    // Data
    var test_data = new unitest("shopping (functions)", 0);

    const dummy_content = {
      version: "0.1",
      settings: { defaultPortions: 4, defaultWeeklyRecipies: 3 },
      recipies: {
        "0d0aa90a": {
          name: "Tarte aux carottes",
          portions: "2",
          ingredients: {
            "6d9f6460": { name: "Légumes : Carottes", count: 500, unit: "g" },
            "9413b158": { name: "Légumes : Oignons", count: 1, unit: "u" },
            "1586ebd8": { name: "Oeufs", count: 2, unit: "u" }
          },
          instructions: []
        },
        a8abee08: {
          name: "Tarte aux poireaux",
          portions: "2",
          ingredients: {
            "94sdb158": { name: "Légumes : Poireaux", count: 6, unit: "u" }
          },
          instructions: ["Couper les poireaux"]
        },
        "0e35c6be": {
          name: "Salade d'automne",
          portions: "2",
          ingredients: {
            c5fdaeec: {
              name: "Légumes : Endives",
              count: 6,
              unit: "u",
              existing_ing: "false"
            },
            "1af14b89": {
              name: "Fruits : Pommes",
              count: 1,
              unit: "u",
              existing_ing: "false"
            }
          },
          instructions: []
        },
        "2f0afa9b": {
          name: "mazkedzmùakdeùaz",
          portions: "4",
          ingredients: {},
          instructions: []
        }
      },
      ingredients: {
        "6d9f6460": { name: "Légumes : Carottes", unit: "g" },
        "9413b158": { name: "Légumes : Oignons", unit: "u" },
        "1586ebd8": { name: "Oeufs", unit: "u" },
        "94sdb158": { name: "Légumes : Poireaux", unit: "u" },
        c5fdaeec: { name: "Légumes : Endives", unit: "u" },
        "1af14b89": { name: "Fruits : Pommes", unit: "u" }
      }
    };

    // Tests
    const model = new M();
    model.content_load(dummy_content);
    model.thisWeekSelection_renew();
    model.thisWeekSelection_ingredients_restart();
    model.fridge_ingredients_restart();
    model.shopping_ingredients_restart();

    var need_key = -1;
    for (const [ing_key, ing] of Object.entries(model.ingredients)) {
      if (ing.need > 0) {
        need_key = ing_key;
        break;
      }
    }
    var noneed_key = -1;
    for (const [ing_key, ing] of Object.entries(model.ingredients)) {
      if (ing.need == 0) {
        noneed_key = ing_key;
        break;
      }
    }

    var subsubtest_data_1 = new unitest(
      "need dependent : shopping = 0 (need <> 0)",
      level + 1
    );
    subsubtest_data_1.expectation = 0;
    subsubtest_data_1.result = model.ingredients[need_key].shopping;
    test_data.add_subtest(subsubtest_data_1);

    if (noneed_key != -1) {
      var subsubtest_data_2 = new unitest(
        "need dependent : shopping = 0 (need = 0)",
        level + 1
      );
      subsubtest_data_2.expectation = 0;
      subsubtest_data_2.result = model.ingredients[noneed_key].shopping;
      test_data.add_subtest(subsubtest_data_2);
    }

    model.fridge_ingredients_toogle(need_key);
    model.shopping_ingredients_restart();

    var subsubtest_data_3 = new unitest(
      "available dependent : shopping = 0 (need = available)",
      level + 1
    );
    subsubtest_data_3.expectation = 0;
    subsubtest_data_3.result = model.ingredients[need_key].shopping;
    test_data.add_subtest(subsubtest_data_3);

    model.fridge_ingredients_restart();
    model.shopping_ingredients_restart();
    model.shopping_ingredients_toggle(need_key);
    model.shopping_ingredients_recover(need_key);

    var subsubtest_data_4 = new unitest(
      "toogle : shopping = need (recovered)",
      level + 1
    );
    subsubtest_data_4.expectation = 0;
    subsubtest_data_4.result = model.ingredients[need_key].shopping;
    test_data.add_subtest(subsubtest_data_4);

    model.fridge_ingredients_restart();
    model.fridge_ingredients_toogleOne(
      need_key,
      0.5 * model.ingredients[need_key].need
    );
    model.shopping_ingredients_restart();
    model.shopping_ingredients_toggle(need_key);

    var subsubtest_data_5 = new unitest(
      "recover : shopping = a part of need (other part in fridge)",
      level + 1
    );
    subsubtest_data_5.expectation = 0.5 * model.ingredients[need_key].need;
    subsubtest_data_5.result = model.ingredients[need_key].shopping;
    test_data.add_subtest(subsubtest_data_5);

    // Record
    return test_data;
  }
  T_V_recipeedit(level = 0) {
    // Data
    var test_data = new unitest("recipeedit (view)", 0);

    // Sub tests

    // TODO
    test_data.activity = "inactive";

    // Storage
    return test_data;
  }
}
class unitest {
  // TESTED
  // ATTRIBUTES
  constructor(new_test_name, new_level) {
    this.test_name = new_test_name;
    this.comment = undefined;
    this.outcome = undefined;
    this.expectation = undefined;
    this.result = undefined;
    this.test = undefined;
    this.level = new_level;
    this.subtests_data = {};
    this.container_id = undefined;
  }
  // METHODS
  add_subtest(value) {
    value.level = this.level + 1;
    this.subtests_data[value.test_name] = value;
    this.outcome =
      (this.outcome * (Object.keys(this.subtests_data).length - 1) +
        value.outcome) /
      Object.keys(this.subtests_data).length;
  }
  run_test() {
    if (Object.keys(this.subtests_data).length > 0) {
      this.outcome = 0;
      var relevant_test_number = 0;
      for (const [subtest_name, subtest_data] of Object.entries(
        this.subtests_data
      )) {
        if (subtest_data.activity != "inactive") {
          subtest_data.run_test();
          this.outcome = this.outcome + subtest_data.outcome;
          relevant_test_number++;
        }
      }
      this.outcome = this.outcome / relevant_test_number;
    } else {
      var margin = 0.001;
      if (this.test === undefined || this.test === "==") {
        if (Array.isArray(this.expectation)) {
          if (this.expectation.length != this.result.length) {
            this.outcome = 0;
          } else {
            this.outcome = 1;
            for (var i = 0; i < this.expectation.length; i++) {
              var subtest = new unitest(undefined, undefined);
              subtest.expectation = this.expectation[i];
              subtest.test = "==";
              subtest.result = this.result[i];
              subtest.run_test(0);
              if (subtest.outcome != 1) {
                this.outcome = 0;
                break;
              }
            }
          }
        } else {
          if (typeof this.expectation == "object") {
            if (
              JSON.stringify(this.expectation) == JSON.stringify(this.result)
            ) {
              this.outcome = 1;
            } else {
              this.outcome = 0;
            }
          } else {
            if (this.expectation == this.result) {
              this.outcome = 1;
            } else {
              this.outcome = 0;
            }
          }
        }
      }
      if (this.test == "~=") {
        if (Array.isArray(this.expectation)) {
          if (typeof this.expectation != typeof this.result) {
            this.outcome = 0;
          } else {
            if (this.expectation.length != this.result.length) {
              this.outcome = 0;
            } else {
              this.outcome = 1;
              for (var i = 0; i < this.expectation.length; i++) {
                var subtest = new unitest(undefined, undefined);
                subtest.expectation = this.expectation[i];
                subtest.test = "~=";
                subtest.result = this.result[i];
                subtest.run_test(0);
                if (subtest.outcome != 1) {
                  this.outcome = 0;
                  break;
                }
              }
            }
          }
        } else {
          if (typeof this.expectation == "number") {
            if (this.expectation > 0) {
              if (
                this.expectation * (1 - margin) <= this.result &&
                this.result <= this.expectation * (1 + margin)
              ) {
                this.outcome = 1;
              } else {
                this.outcome = 0;
              }
            } else {
              if (
                this.expectation * (1 - margin) >= this.result &&
                this.result >= this.expectation * (1 + margin)
              ) {
                this.outcome = 1;
              } else {
                this.outcome = 0;
              }
            }
          } else {
            console.log(
              "ERROR : unitest.run_test.~= does not handle the types of variables)"
            );
            this.outcome = 0;
          }
        }
      }
      if (this.test == "!=") {
        if (this.expectation != this.result) {
          this.outcome = 1;
        } else {
          this.outcome = 0;
        }
      }
      if (this.test == ">=") {
        if (this.expectation >= this.result) {
          this.outcome = 1;
        } else {
          this.outcome = 0;
        }
      }
      if (this.test == ">") {
        if (this.expectation > this.result) {
          this.outcome = 1;
        } else {
          this.outcome = 0;
        }
      }
      if (this.test == "<=") {
        if (this.expectation <= this.result) {
          this.outcome = 1;
        } else {
          this.outcome = 0;
        }
      }
      if (this.test == "<") {
        if (this.expectation < this.result) {
          this.outcome = 1;
        } else {
          this.outcome = 0;
        }
      }
    }
  }
  print(container_id) {
    let container = document.getElementById(container_id);
    if (container != null) {
      this.container_id = container_id;
      var test_li = document.createElement("li");
      var test_span = document.createElement("span");
      test_span.style.fontWeight = "bold";
      if (this.activity !== undefined && this.activity === "inactive") {
        var node = document.createTextNode(this.test_name + " - Inactive");
        test_span.appendChild(node);
        test_li.appendChild(test_span);
        test_span.style.color = "lightgrey";
      } else if (this.outcome == 1) {
        var node = document.createTextNode(this.test_name);
        test_span.appendChild(node);
        test_li.appendChild(test_span);
        test_span.style.color = "green";
      } else if (this.outcome == 0) {
        var node = document.createTextNode(this.test_name + " - Failed");
        test_span.appendChild(node);
        test_li.appendChild(test_span);
        test_span.style.color = "red";
      } else {
        var node = document.createTextNode(
          this.test_name + " - " + Math.round(100 * this.outcome) + "%"
        );
        test_span.appendChild(node);
        test_li.appendChild(test_span);
        test_span.style.color = "orange";
      }
      container.appendChild(test_li);

      var test_ul = document.createElement("ul");
      if (this.outcome == 1 || this.activity == "inactive") {
        test_span.className = "caret";
        test_ul.className += "nested";
      } else {
        test_span.className = "caret caret-down";
        test_ul.className += "nested active";
      }
      test_li.appendChild(test_ul);

      function print_li(input = undefined) {
        var para = document.createElement("li");
        var node = document.createTextNode(input);
        para.appendChild(node);
        test_ul.appendChild(para);
        return para;
      }

      if (Object.keys(this.subtests_data).length > 0) {
        var subtest_li = print_li(
          "Subtests : " + Object.keys(this.subtests_data).length
        );
        subtest_li.id = random_id();
        test_ul.appendChild(subtest_li);

        var subtest_ul = document.createElement("ul");
        subtest_ul.className += "nested";
        subtest_ul.id = random_id();
        subtest_li.appendChild(subtest_ul);

        for (const [subtest_name, subtest_data] of Object.entries(
          this.subtests_data
        )) {
          subtest_data.print(subtest_li.id);
        }
      } else {
        if (this.comment !== undefined) {
          print_li("Comment : " + this.comment);
        }
        print_li("Expectation : " + this.expectation);
        if (this.test !== undefined) {
          print_li("Test : " + this.test);
        }
        print_li("Result : " + this.result);
      }
    }
  }
  log() {
    var indent = "";
    for (var i = 0; i < this.level; i++) {
      indent = indent + "    ";
    }
    console.log(indent + "INFO : UNITEST - " + this.test_name);
    if (this.outcome !== undefined) {
      if (this.comment !== undefined) {
        console.log(indent + "  . Comment : " + this.comment);
      }
      console.log(indent + "  . Outcome : " + this.outcome * 100 + "%");
      if (this.outcome != 1) {
        if (Object.keys(this.subtests_data).length > 0) {
          console.log(
            indent + "  . Subtests : " + Object.keys(this.subtests_data).length
          );
          for (const [subtest_name, subtest_data] of Object.entries(
            this.subtests_data
          )) {
            subtest_data.log();
          }
        } else {
          if (this.expectation !== undefined) {
            if (typeof this.expectation == "object") {
              console.log(indent + "  . Expectation : ");
              console.log(this.expectation);
            } else {
              console.log(indent + "  . Expectation : " + this.expectation);
            }
          }
          if (typeof this.result == "object") {
            console.log(indent + "  . Result : ");
            console.log(this.result);
          } else {
            console.log(indent + "  . Result : " + this.result);
          }
        }
      }
    }
  }
}

// TOOLKIT
/*
function random_id(length = 8) {
  // TESTED
  var temp_id = Math.random().toString(16).substr(2, length);
  var container = document.getElementById(temp_id);
  while (container != null) {
    temp_id = Math.random().toString(16).substr(2, length);
    container = document.getElementById(temp_id);
  }
  return temp_id;
}
function list_from_dict(dict, field) {
  // TESTED
  var list = [];
  for (const [key, content] of Object.entries(dict)) {
    list.push(content[field]);
  }
  return list;
}
function get_key_from_dict_field_value(dict, field, value) {
  // TESTED
  for (const [key, content] of Object.entries(dict)) {
    if (content[field] == value) {
      return key;
    }
  }
  return undefined;
}
function dict_sorter(dict, field, filters = []) {
  // TESTED
  if (dict === undefined) {
    return undefined;
  } else {
    if (filters != []) {
      var sorter = [];
      for (const [key, val] of Object.entries(dict)) {
        var addItem = true;
        for (const [filter_field, filter_value, filter_test] of filters) {
          switch (filter_test) {
            case "==":
              if (filter_value != val[filter_field]) {
                addItem = false;
                break;
              }
              break;
            case "!=":
              if (filter_value == val[filter_field]) {
                addItem = false;
                break;
              }
              break;
          }
        }
        if (addItem) {
          sorter.push(key);
        }
      }
    } else {
      var sorter = Object.keys(dict);
    }
    for (var i = 0; i < sorter.length; i++) {
      var minIdx = i;
      for (var j = i + 1; j < sorter.length; j++) {
        switch (typeof dict[sorter[j]][field]) {
          case "number":
            if (dict[sorter[j]][field] < dict[sorter[minIdx]][field]) {
              minIdx = j;
            }
            break;
          case "string":
            if (dict[sorter[j]][field] < dict[sorter[minIdx]][field]) {
              minIdx = j;
            }
            break;
          default:
            console.error(
              "ERROR dict_sorter type not supported (unsorted outcome)"
            );
            return Object.keys(dict);
        }
      }
      if (minIdx > i) {
        var temp_key = sorter[i];
        sorter.splice(i, 1, sorter[minIdx]);
        sorter.splice(minIdx, 1, temp_key);
      }
    }
  }
  return sorter;
}
function dict_count_values(dict, field, value) {
  // TESTED
  var counter = 0;
  for (const [key, content] of Object.entries(dict)) {
    if (content[field] == value) {
      counter += 1;
    }
  }
  return counter;
}
*/

const app = new C(); // -
app.view.spawn();
app.bind();
app.populate();
app.testsuite_run();
app.model.content_load(onboardingContent);

/*const { MongoClient } = require("./mongodb-client-0.0.1/package");
const uri =
  "mongodb+srv://mongoPireTest:7Pgg6QWv0ZEVNaCR@recpclustertrial.qmxbn.mongodb.net/test?retryWrites=true&w=majority";
console.log("uri");
console.log(uri);
onst client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log("client");
console.log(client);
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
console.log("client once connected");
console.log(client);*/
