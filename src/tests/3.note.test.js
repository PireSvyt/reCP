import { Note } from "../../src/models/note.js";

const assert = require("assert");

describe("Log (class)", () => {
  console.info("TEST : Log (class) ");
  describe("constructor", () => {
    console.info("TEST : Log (class) / constructor");
    // Preparation
    var note = new Note();

    // Tests
    it("container", () => {
      assert.deepStrictEqual(undefined, note.container);
    });
    it("buffer", () => {
      assert.deepStrictEqual({}, note.buffer);
    });
  });
  describe("methods", () => {
    console.info("TEST : Note (class) / methods");

    // Preparation
    var note = new Note();

    note.add("dummy log", "log");
    note.add("dummy info", "info");
    note.add("dummy error", "error");
    let bufferSize_3adds = Object.keys(note.buffer).length;
    describe("add", () => {
      console.info("TEST : Note (class) / methods / add");
      // Tests
      it("container", () => {
        assert.deepStrictEqual(3, bufferSize_3adds);
      });
    });

    note.print();
    let bufferSize_print = Object.keys(note.buffer).length;
    describe("print", () => {
      console.info("TEST : Note (class) / methods / print");
      // Tests
      it("container", () => {
        assert.deepStrictEqual(0, bufferSize_print);
      });
    });
  });

  console.info("TEST : Note (class) - END");
});
