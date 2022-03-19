import { Recipe } from "../../src/models/recipe.js";

const assert = require("assert");

describe("recipe (class)", () => {
  console.info("TEST : recipe (class)");
  describe("constructor", () => {
    console.info("TEST : recipe (class) / constructor");
    // Preparation
    var recp = new Recipe("dummy recipe", 4);

    // Tests
    it("name", () => {
      assert.deepStrictEqual("dummy recipe", recp.name);
    });
    it("portions", () => {
      assert.deepStrictEqual(4, recp.portions);
    });
    it("ingredients", () => {
      assert.deepStrictEqual({}, recp.ingredients);
    });
    it("instructions", () => {
      assert.deepStrictEqual([], recp.instructions);
    });
  });

  describe("methods", () => {
    console.info("TEST : recipe (class) / methods");
    it("portions_update", () => {
      var recp = new Recipe("dummy recipe", 4);
      recp.portions_update(5);
      assert.deepStrictEqual(5, recp.portions);
    });

    it("ingredient_add name", () => {
      var recp = new Recipe("dummy recipe", 4);
      var ing_id = recp.ingredient_add({ name: "Carottes", count: 200 });
      assert.deepStrictEqual("Carottes", recp.ingredients[ing_id].name);
    });
    it("ingredient_add count", () => {
      var recp = new Recipe("dummy recipe", 4);
      var ing_id = recp.ingredient_add({ name: "Carottes", count: 200 });
      assert.deepStrictEqual(200, recp.ingredients[ing_id].count);
    });

    it("ingredient_delete", () => {
      var recp = new Recipe("dummy recipe", 4);
      var ing_id = recp.ingredient_add({ name: "Carottes", count: 200 });
      recp.ingredient_delete(ing_id);
      assert.deepStrictEqual({}, recp.ingredients);
    });

    it("ingredient_update", () => {
      var recp2 = new Recipe("dummy recipe 2", 4);
      var ing_id = recp2.ingredient_add({ name: "Poireaux", count: 200 });
      recp2.ingredient_update(ing_id, 500);
    });

    it("ingredient_update", () => {
      var recp2 = new Recipe("dummy recipe 2", 4);
      var ing_id = recp2.ingredient_add({ name: "Poireaux", count: 200 });
      recp2.ingredient_update(ing_id, 500);
      recp2.recipe_scale(2);
      assert.deepStrictEqual(250, recp2.ingredients[ing_id].count);
    });
  });

  console.info("TEST : recipe (class) - END");
});
