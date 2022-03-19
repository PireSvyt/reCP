import { Model } from "../../src/models/model.js";
import { Recipe } from "../../src/models/recipe.js";
import { dict_count_values } from "../../src/models/toolkit.js";

const assert = require("assert");

describe("Model (class)", () => {
  console.info("TEST : Model (class) ");
  describe("constructor", () => {
    console.info("TEST : Model (class) / constructor");
    // Preparation
    var m = new Model();

    // Tests
    it("myRecipies", () => {
      assert.deepStrictEqual({}, m.myRecipies);
    });
    it("ingredients", () => {
      assert.deepStrictEqual({}, m.ingredients);
    });
    it("bindings", () => {
      assert.deepStrictEqual({}, m.bindings);
    });
    it("currentRecipe", () => {
      assert.deepStrictEqual(undefined, m.currentRecipe);
    });
  });
  describe("methods", () => {
    console.info("TEST : Model (class) / methods");
    describe("content management", () => {
      console.info("TEST : Model (class) / methods / content management");
      var m = new Model();
      var content_empty = {};
      var content_v01 = {
        version: "0.1",
        settings: {
          defaultPortions: 4,
          defaultWeeklyRecipies: 3,
          recipeSelector_filter_season: true
        },
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

      describe("content load from json object", () => {
        it("empty", () => {
          m.content_load(content_empty);
          assert.deepStrictEqual("spawn", m.source);
        });
        it("version 0.1", () => {
          m.content_load(content_v01);
          assert.deepStrictEqual("loaded", m.source);
        });
      });
      describe("import and export reCP archive", () => {
        it.skip("export_reCP", () => {
          m.content_load(content_v01);
          //m.export_reCP();
          const fs = require("fs");
          const path = "./myRecipies.reCP";
          var last_update = undefined;
          try {
            const stats = fs.statSync(path);
            last_update = stats.mtime;
          } catch (error) {
            console.log(error);
          }
          assert.deepStrictEqual("spawn", last_update);
        });
      });
    });
    describe("my recipies", () => {
      console.info("TEST : Model (class) / methods / my recipies");
      // Prep
      var m = new Model();
      var recp = new Recipe("dummy recipe", 4);
      //var poireau_id = recp.ingredient_add({ name: "Poireaux", count: 200 });
      var carotte_id = recp.ingredient_add({ name: "Carottes", count: 300 });
      var other_recp = recp;
      other_recp.recipe_scale(2);

      it("save new", () => {
        m.currentRecipe = recp;
        var id = m.myRecipies_save();
        assert.notDeepStrictEqual(undefined, id);
      });

      it("delete", () => {
        m.currentRecipe = recp;
        var id = m.myRecipies_save();
        m.myRecipies_delete(id);
        assert.notDeepStrictEqual(0, Object.keys(m.myRecipies).length);
      });

      it("save portions", () => {
        m.currentRecipe = recp;
        m.currentRecipe = other_recp;
        var id = m.myRecipies_save();
        assert.deepStrictEqual(2, m.myRecipies[id].portions);
      });

      it("save ingredients", () => {
        m.currentRecipe = recp;
        m.currentRecipe = other_recp;
        var id = m.myRecipies_save();
        assert.deepStrictEqual(
          150,
          m.myRecipies[id].ingredients[carotte_id].count
        );
      });

      it("select status", () => {
        m.currentRecipe = recp;
        m.currentRecipe = other_recp;
        var id = m.myRecipies_save();
        var recipe_selection = m.myRecipies_select(id);
        assert.deepStrictEqual(true, recipe_selection);
      });

      it("select added", () => {
        m.currentRecipe = recp;
        m.currentRecipe = other_recp;
        m.myRecipies_save();
        assert.deepStrictEqual(
          1,
          dict_count_values(m.myRecipies, "thisweek", true)
        );
      });
    });
    describe("this week", () => {
      console.info("TEST : Model (class) / methods / this week");
      describe("operations", () => {
        // Prep
        var m = new Model();
        var recp_1 = new Recipe("dummy recipe 1", 1);
        recp_1.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
        recp_1.ingredient_add({ name: "Carottes", count: 300, need: 0 });
        m.currentRecipe = recp_1;
        m.myRecipies_save();
        var recp_2 = new Recipe("dummy recipe 2", 2);
        recp_2.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
        recp_2.ingredient_add({ name: "Carottes", count: 300, need: 0 });
        m.currentRecipe = recp_2;
        m.myRecipies_save();
        var recp_3 = new Recipe("dummy recipe 3", 3);
        recp_3.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
        recp_3.ingredient_add({ name: "Carottes", count: 300, need: 0 });
        m.currentRecipe = recp_3;
        m.myRecipies_save();
        var recp_4 = new Recipe("dummy recipe 4", 4);
        recp_4.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
        recp_4.ingredient_add({ name: "Carottes", count: 300, need: 0 });
        m.currentRecipe = recp_4;
        m.myRecipies_save();

        var id = m.thisWeekSelection_add();
        it("add", () => {
          assert.notDeepStrictEqual(
            1,
            dict_count_values(m.myRecipies, "thisweek", true)
          );
        });

        m.thisWeekSelection_remove(id);
        it("delete", () => {
          assert.notDeepStrictEqual(
            1,
            dict_count_values(m.myRecipies, "thisweek", true)
          );
        });

        var id_added = m.thisWeekSelection_add();
        var id_recplaced = m.thisWeekSelection_replace(id_added);
        it("replace", () => {
          assert.notDeepStrictEqual(id_added, id_recplaced);
        });

        var id_list = m.thisWeekSelection_renew();
        it("renew", () => {
          assert.deepStrictEqual(
            m.settings.defaultWeeklyRecipies,
            id_list.length
          );
        });
      });
      describe("selector", () => {
        // Prep

        it("empty (no recipies)", () => {
          var m_selector = new Model();
          assert.deepStrictEqual(
            undefined,
            m_selector.thisWeekSelector([], "random")
          );
        });

        var m_selector = new Model();
        var recp_1 = new Recipe("dummy recipe 1", 1);
        recp_1.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
        recp_1.ingredient_add({ name: "Carottes", count: 300, need: 0 });
        m_selector.currentRecipe = recp_1;
        m_selector.myRecipies_save();
        var recp_2 = new Recipe("dummy recipe 2", 2);
        recp_2.ingredient_add({ name: "Poireaux", count: 200, need: 0 });
        recp_2.ingredient_add({ name: "Bétraves", count: 300, need: 0 });
        m_selector.currentRecipe = recp_2;
        m_selector.myRecipies_save();

        const dummySelection_1 = m_selector.thisWeekSelector(
          Object.keys(m_selector.myRecipies),
          "random"
        );
        it("empty (complete filtering)", () => {
          assert.deepStrictEqual(undefined, dummySelection_1);
        });

        const dummySelection_2 = m_selector.thisWeekSelector(
          [Object.keys(m_selector.myRecipies)[0]],
          "by_id"
        );
        it("by_id", () => {
          assert.deepStrictEqual(
            Object.keys(m_selector.myRecipies)[0],
            dummySelection_2
          );
        });

        const dummySelection_3 = m_selector.thisWeekSelector([], "random");
        it("random", () => {
          assert.notDeepStrictEqual(undefined, dummySelection_3);
        });

        var keys = Object.keys(m_selector.myRecipies);
        var last_id = keys.pop();
        const dummySelection_4 = m_selector.thisWeekSelector(keys, "random");
        it("random filtering (unique choice)", () => {
          assert.deepStrictEqual(last_id, dummySelection_4);
        });

        keys = Object.keys(m_selector.myRecipies);
        var ing_keys = Object.keys(m_selector.ingredients);
        m_selector.ingredients_update("season", ing_keys[1], "Ete");
        m_selector.ingredients_update("season", ing_keys[2], "Hiver");
        var today = new Date();
        var thismonth = today.getMonth() + 1;
        var thisseasonrecipe = undefined;
        if (thismonth < 4 || 9 < thismonth) {
          thisseasonrecipe = keys[1];
        } else {
          thisseasonrecipe = keys[0];
        }
        it("random filtering (during season)", () => {
          assert.deepStrictEqual(
            thisseasonrecipe,
            m_selector.thisWeekSelector([], "random")
          );
        });
      });
    });
    describe("fridge", () => {
      console.info("TEST : Model (class) / methods / fridge");
      // Prep
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
      const m = new Model();
      m.content_load(dummy_content);
      m.thisWeekSelection_renew();
      m.thisWeekSelection_ingredients_restart();

      it("list not empty", () => {
        assert.notDeepStrictEqual(0, Object.keys(m.ingredients).length);
      });

      var need_flag = false;
      for (const ing of Object.entries(m.ingredients)) {
        if (ing.need !== undefined) {
          need_flag = true;
          break;
        }
      }
      var need_key = -1;
      for (const [ing_key, ing] of Object.entries(m.ingredients)) {
        if (ing.need > 0) {
          need_key = ing_key;
          break;
        }
      }
      it("need occurences", () => {
        assert.deepStrictEqual(true, need_flag);
      });

      m.fridge_ingredients_restart();
      it("need is null", () => {
        assert.deepStrictEqual(0, m.ingredients[need_key].available);
      });

      const previous_count = m.ingredients[need_key].available;
      m.fridge_ingredients_toogleOne(need_key, +10);
      it("need is toogled by 10", () => {
        assert.notDeepStrictEqual(
          previous_count + 10,
          m.ingredients[need_key].available
        );
      });

      m.fridge_ingredients_restart();
      m.fridge_ingredients_toogle(need_key);
      it("need is toogled completely", () => {
        assert.notDeepStrictEqual(
          m.ingredients[need_key].need,
          m.ingredients[need_key].available
        );
      });

      m.fridge_ingredients_recover(need_key);
      it("need is back to null", () => {
        assert.deepStrictEqual(0, m.ingredients[need_key].available);
      });
    });
    describe("shopping", () => {
      console.info("TEST : Model (class) / methods / shopping");
      // Prep
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
      const m = new Model();
      m.content_load(dummy_content);
      m.thisWeekSelection_renew();
      m.thisWeekSelection_ingredients_restart();
      m.fridge_ingredients_restart();
      m.shopping_ingredients_restart();

      var need_key = -1;
      for (const [ing_key, ing] of Object.entries(m.ingredients)) {
        if (ing.need > 0) {
          need_key = ing_key;
          break;
        }
      }
      var noneed_key = -1;
      for (const [ing_key, ing] of Object.entries(m.ingredients)) {
        if (ing.need === 0) {
          noneed_key = ing_key;
          break;
        }
      }
      if (noneed_key !== -1) {
        it("need dependent : shopping = 0 (need = 0)", () => {
          assert.deepStrictEqual(0, m.ingredients[noneed_key].shopping);
        });
      }

      m.fridge_ingredients_toogle(need_key);
      m.shopping_ingredients_restart();
      var shopping_need_1 = m.ingredients[need_key].shopping;
      it("available dependent : shopping = 0 (need = available)", () => {
        assert.deepStrictEqual(0, shopping_need_1);
      });

      m.fridge_ingredients_restart();
      m.shopping_ingredients_restart();
      m.shopping_ingredients_toggle(need_key);
      m.shopping_ingredients_recover(need_key);
      var shopping_need_2 = m.ingredients[need_key].shopping;
      it("toogle : shopping = need (recovered)", () => {
        assert.deepStrictEqual(0, shopping_need_2);
      });

      m.fridge_ingredients_restart();
      m.fridge_ingredients_toogleOne(
        need_key,
        0.5 * m.ingredients[need_key].need
      );
      m.shopping_ingredients_restart();
      m.shopping_ingredients_toggle(need_key);
      var scaled_need_3 = 0.5 * m.ingredients[need_key].need;
      var shopping_need_3 = m.ingredients[need_key].shopping;
      it("recover : shopping = a part of need (other part in fridge)", () => {
        assert.deepStrictEqual(scaled_need_3, shopping_need_3);
      });
    });
    describe("ingredients", () => {
      console.info("TEST : Model (class) / methods / ingredients");
    });
    describe("binding management", () => {
      console.info("TEST : Model (class) / methods / binding management");
    });
  });

  console.info("TEST : Model (class) - END");
});
