import {
  random_id,
  dict_sorter,
  dict_count_values
} from "../../src/models/toolkit.js";
import { Recipe } from "../../src/models/recipe.js";
import { note } from "../index.js";
const apiIngredient = require("../api/ingredient.js");

export class Model {
  // -
  // ATTRIBUTES
  constructor() {
    // TESTED
    this.source = "spawn";
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

    // Fetch ingredients from server
    this.ingredients = apiIngredient.getIngredients();

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
  myRecipies_new() {
    return new Recipe("", this.settings.defaultPortions);
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
    var i = undefined;
    switch (mode) {
      case "random":
        var keys = Object.keys(this.myRecipies);
        // Remove selected keys
        var selected_keys = dict_sorter(this.myRecipies, "name", [
          ["thisweek", true, "=="]
        ]);
        for (i = keys.length - 1; i >= 0; i--) {
          if (selected_keys.includes(keys[i])) {
            keys.splice(i, 1);
          }
        }
        // Remove except keys
        for (i = keys.length - 1; i >= 0; i--) {
          if (except_id.includes(keys[i])) {
            keys.splice(i, 1);
          }
        }
        // Remove not season keys
        if (this.settings.recipeSelector_filter_season && keys.length > 0) {
          var today = new Date();
          var thismonth = today.getMonth() + 1;
          for (i = keys.length - 1; i >= 0; i--) {
            for (const ing_key of Object.keys(
              this.myRecipies[keys[i]].ingredients
            )) {
              var istoremove = false;
              switch (this.ingredients[ing_key]["season"]) {
                case "Ete":
                  if (thismonth < 4 || 9 < thismonth) {
                    istoremove = true;
                  }
                  break;
                case "Hiver":
                  if (3 < thismonth && thismonth < 10) {
                    istoremove = true;
                  }
                  break;
                default:
                // Nothing
              }
              if (istoremove) {
                keys.splice(i, 1);
                break;
              }
            }
          }
        }
        // Select among remaining keys
        if (keys.length > 0) {
          id = keys[(keys.length * Math.random()) << 0];
        } else {
          id = undefined;
        }
        break;
      case "by_id":
        id = except_id[0];
        break;
      default:
        note.add(
          "ERROR : thisWeekSelector, mode not recognised : " + mode,
          "error"
        );
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
    for (const id of Object.keys(this.myRecipies)) {
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
    for (const ing_key of Object.keys(this.ingredients)) {
      this.ingredients[ing_key].need = 0;
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
    for (const id of Object.keys(this.ingredients)) {
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
    for (const id of Object.keys(this.ingredients)) {
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
    for (const id of Object.keys(this.ingredients)) {
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
    // Update recipies
    for (const [recp_key, recp] of Object.entries(this.myRecipies)) {
      for (const ing_key of Object.keys(recp.ingredients)) {
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
              note.add(
                "M.ingredients_update ERROR : scope not found " +
                  scope +
                  " (id:" +
                  id +
                  ")",
                "error"
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
        note.add(
          "M.ingredients_update ERROR : scope not found " +
            scope +
            " (id:" +
            id +
            ")",
          "error"
        );
    }
  }
  content_extract() {
    var content = undefined;
    content = {
      /*version: "0.2",
      settings: this.settings,
      recipies: this.myRecipies,
      ingredients: this.ingredients*/
      version: "0.3",
      model: this
    };
    return content;
  }
  export_reCP() {
    // TESTED
    // Reference https://www.websparrow.org/web/how-to-create-and-save-text-file-in-javascript  https://www.cdnpkg.com/amcharts/file/FileSaver.min.js/
    var content = this.content_extract();
    var blob = new Blob([JSON.stringify(content)], {
      type: "text/plain;charset=utf-8"
    });
    this.saveAs(blob, "myRecipies.reCP");
  }
  import_reCP(reCP_file) {
    // TESTED
    var reader = new FileReader();
    reader.readAsText(reCP_file, "UTF-8");
    reader.onload = function (evt) {
      var content = JSON.parse(evt.target.result);
      this.content_load(content);
    };
    reader.onerror = function (evt) {
      note.add("ERROR : Reader error", "error");
    };
  }
  content_load(content) {
    // TODO
    var new_recp = undefined;
    switch (content.version) {
      case "0.0":
        note.add("Loading file version " + content.version, "info");
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
          new_recp = new Recipe(
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
        note.add("Loading file version " + content.version, "info");
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
          new_recp = new Recipe(
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
        note.add("INFO : loading file version " + content.version, "info");
        this.settings = content.settings;
        this.ingredients = content.ingredients;
        for (const [key, recp] of Object.entries(content.recipies)) {
          new_recp = new Recipe(
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
      case "0.3":
        note.add("INFO : loading file version " + content.version, "info");
        this.settings = content.model.settings;
        this.ingredients = content.model.ingredients;
        for (const [key, recp] of Object.entries(content.model.myRecipies)) {
          new_recp = new Recipe(
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
        console.error(
          "ERROR : Model.content_load, version not recognised : " +
            content.version
        );
        return;
    }
    this.source = "loaded";
  }
  // BINDING
  bind(trigger, handler) {
    // TESTED
    note.add("M.bind " + trigger, "log");
    this.bindings[trigger] = handler;
  }
  trigger(trigger) {
    // TESTED
    note.add("Model.trigger " + trigger, "event");
    if (this.bindings[trigger] !== undefined) {
      if (typeof this.bindings[trigger] === "function") {
        this.bindings[trigger]();
      } else {
        this.bindings[trigger];
      }
    }
  }
}
