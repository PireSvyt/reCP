import { View } from "../../src/views/view.js";

const assert = require("assert");

describe.skip("View (class)", () => {
  describe("constructor", () => {
    // Preparation
    var div = document.createElement("div");
    div.id = "view.test-div";
    document.body.appendChild(div);
    var view = new View(div);

    // Tests
    it("app", () => {
      assert.deepStrictEqual(true, view.app.tagName === "DIV");
    });
    it("navigations", () => {
      assert.deepStrictEqual([], view.navigations);
    });
    it("currentRecipe id", () => {
      assert.deepStrictEqual(undefined, view.currentRecipe.id);
    });
    it("currentRecipe source", () => {
      assert.deepStrictEqual(undefined, view.currentRecipe.source);
    });
    it.skip("snack", () => {
      assert.deepStrictEqual(undefined, view.snack);
    });
    it.skip("isMobile", () => {
      assert.deepStrictEqual(undefined, view.isMobile);
    });
  });
  describe("spawn (method)", () => {
    // Preparation
    var div = document.createElement("div");
    div.id = "view.test-div";
    document.body.appendChild(div);
    var view = new View(div);

    // Tests
    view.spawn();
    it("nav_bar_div", () => {
      assert.deepStrictEqual(
        true,
        view.nav_bar_div.tagName === "DIV" &&
          view.nav_bar_div.id === "nav_bar_div"
      );
    });
    it("menu_div", () => {
      assert.deepStrictEqual(
        true,
        view.menu_div.tagName === "DIV" && view.menu_div.id === "menu_div"
      );
    });
    it("myrecipies_div", () => {
      assert.deepStrictEqual(
        true,
        view.myrecipies_div.tagName === "DIV" &&
          view.myrecipies_div.id === "myrecipies_div"
      );
    });
    it("thisweek_div", () => {
      assert.deepStrictEqual(
        true,
        view.thisweek_div.tagName === "DIV" &&
          view.thisweek_div.id === "thisweek_div"
      );
    });
    it("fridge_div", () => {
      assert.deepStrictEqual(
        true,
        view.fridge_div.tagName === "DIV" && view.fridge_div.id === "fridge_div"
      );
    });
    it("shopping_div", () => {
      assert.deepStrictEqual(
        true,
        view.shopping_div.tagName === "DIV" &&
          view.shopping_div.id === "shopping_div"
      );
    });
  });
  describe("neat_ui (method)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });
  describe("populate (method)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });
  describe("add_new_input_row (method)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });
  describe("navigates (method)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });
  describe("navigates_back (method)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });
  describe("bind (method)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });
  describe("autocomplete (function)", () => {
    // Preparation

    // Tests
    it("nav_bar_div", () => {
      assert.deepStrictEqual(true, false);
    });
  });

  console.info("TEST : view (class) - END");
});
