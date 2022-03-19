import { Snack } from "../../src/views/snack.js";

const assert = require("assert");

describe("Snack (class)", () => {
  console.info("TEST : Snack (class)"); // Preparation
  describe("constructor", () => {
    console.info("TEST : Snack (class) / constructor"); // Preparation
    var div = document.createElement("div");
    div.id = "snack.test-div";
    document.body.appendChild(div);
    var s = new Snack();
    s.container = s.createElement(document.body, "div", "");

    // Tests
    it("displaylist", () => {
      assert.deepStrictEqual({}, s.displaylist);
    });
    it("container", () => {
      assert.deepStrictEqual("DIV", s.container.tagName);
    });

    // Cleaning
    div.remove();
  });
  describe("methods", () => {
    console.info("TEST : Snack (class) / methods");
    // Preparation
    var div = document.createElement("div");
    div.id = "snack.test-div";
    document.body.appendChild(div);
    var s = new Snack();
    s.container = s.createElement(document.body, "div", "");

    describe("add", () => {
      console.info("TEST : Snack (class) / methods / add");
      // Tests
      var s_id = s.add("dummy message", 1000, "yellow");
      var snck = document.getElementById(s_id);
      it("message", () => {
        assert.deepStrictEqual("dummy message", s.displaylist[s_id].content);
      });
      it.skip("duration", () => {
        assert.deepStrictEqual(true, false);
      });
      it("color", () => {
        assert.deepStrictEqual("yellow", snck.style.backgroundColor);
      });
    });
    describe("moveup", () => {
      console.info("TEST : Snack (class) / methods / moveup");
      // Tests
      var s_id = s.add("dummy message", 1000, "yellow");
      var snck = document.getElementById(s_id);
      let original_pos = snck.style.bottom;
      s.add("dummy message 2", 1000, "blue");
      let final_pos = snck.style.bottom;

      it("moved", () => {
        assert.deepStrictEqual(true, final_pos > original_pos);
      });
    });
    describe("delete", () => {
      console.info("TEST : Snack (class) / methods / delete");
      // Tests
      var s_id = s.add("dummy message", 1000, "yellow");
      s.delete(s_id);
      it("is removed from list", () => {
        assert.deepStrictEqual(false, s.displaylist[s_id] !== undefined);
      });
      it("is removed from ui", () => {
        assert.deepStrictEqual(null, document.getElementById(s_id));
      });
    });

    // Cleaning
    div.remove();
  });

  console.info("TEST : Snack (class) - END");
});
