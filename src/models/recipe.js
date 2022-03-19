import { random_id } from "../../src/models/toolkit.js";

export class Recipe {
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
    for (i = 0; i < ing_keys.length; i++) {
      if (this.ingredients[ing_keys[i]].accounted) {
        this.ingredient_delete(ing_keys[i]);
      }
    }
  }
  recipe_scale(portions) {
    // TESTED
    for (var key of Object.keys(this.ingredients)) {
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
    var recipe_copy = new Recipe(
      this.name,
      this.portions,
      ingredients,
      this.instructions
    );
    return recipe_copy;
  }
}
