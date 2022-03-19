import {
  random_id,
  list_from_dict,
  get_key_from_dict_field_value,
  dict_sorter,
  dict_count_values
} from "../../src/models/toolkit.js";

const assert = require("assert");

describe("toolkit (function)", () => {
  describe("random_id (function)", () => {
    console.info("TEST : toolkit / rand_id (function)");
    // Preparation
    var rid1 = random_id();
    var rid2 = random_id();

    // Tests
    it("uniqueness", () => {
      assert.notEqual(rid1, rid2);
    });
    it("length (default)", () => {
      assert.equal(rid1.length, 8);
    });
    it("length (custom)", () => {
      assert.equal(random_id(12).length, 12);
    });
  });

  describe("list_from_dict (function)", () => {
    console.info("TEST : toolkit / list_from_dict (function)");
    // Preparation
    var empty_dict = {};
    var filled_dict = {
      key1: {
        field1: 1,
        field2: 3
      },
      key2: {
        field1: 2,
        field2: 2
      },
      key3: {
        field1: 3,
        field2: 1
      }
    };

    // Tests
    it("empty dict", () => {
      assert.deepStrictEqual([], list_from_dict(empty_dict, "field1"));
    });
    it("field1", () => {
      assert.deepStrictEqual([1, 2, 3], list_from_dict(filled_dict, "field1"));
    });
    it("field2", () => {
      assert.deepStrictEqual([3, 2, 1], list_from_dict(filled_dict, "field2"));
    });
  });

  describe("get_key_from_dict_field_value (function)", () => {
    console.info("TEST : toolkit / get_key_from_dict_field_value (function)");
    // Preparation
    var empty_dict = {};
    var filled_dict = {
      key1: {
        field1: 1,
        field2: 3
      },
      key2: {
        field1: 2,
        field2: 2
      },
      key3: {
        field1: 3,
        field2: 1
      }
    };

    // Tests
    it("empty dict", () => {
      assert.deepStrictEqual(
        undefined,
        get_key_from_dict_field_value(empty_dict, "field1", "dummy value")
      );
    });
    it("field1", () => {
      assert.deepStrictEqual(
        "key1",
        get_key_from_dict_field_value(filled_dict, "field1", 1)
      );
    });
    it("field2", () => {
      assert.deepStrictEqual(
        "key1",
        get_key_from_dict_field_value(filled_dict, "field2", 3)
      );
    });
  });

  describe("dict_sorter (function)", () => {
    console.info("TEST : toolkit / dict_sorter (function)");
    // Preparation
    var empty_dict = {};
    var filled_dict = {
      key1: {
        field1: 1,
        field2: 3
      },
      key2: {
        field1: 2,
        field2: 2
      },
      key3: {
        field1: 3,
        field2: 1
      }
    };
    var text_dict = {
      key1: {
        field1: "aba",
        field2: "caa"
      },
      key2: {
        field1: "aca",
        field2: "baa"
      },
      key3: {
        field1: "acg",
        field2: "aaa"
      }
    };

    // Tests
    it("empty dict", () => {
      assert.deepStrictEqual([], dict_sorter(empty_dict, "field1"));
    });
    it("number field1", () => {
      assert.deepStrictEqual(
        ["key1", "key2", "key3"],
        dict_sorter(filled_dict, "field1")
      );
    });
    it("number field2", () => {
      assert.deepStrictEqual(
        ["key3", "key2", "key1"],
        dict_sorter(filled_dict, "field2")
      );
    });
    it("text field1", () => {
      assert.deepStrictEqual(
        ["key1", "key2", "key3"],
        dict_sorter(text_dict, "field1")
      );
    });
    it("text field2", () => {
      assert.deepStrictEqual(
        ["key3", "key2", "key1"],
        dict_sorter(text_dict, "field2")
      );
    });
    it("filters is not (one)", () => {
      assert.deepStrictEqual(
        ["key3", "key2"],
        dict_sorter(text_dict, "field2", [["field1", "aba", "!="]])
      );
    });
    it("filters is not (two)", () => {
      assert.deepStrictEqual(
        ["key3"],
        dict_sorter(text_dict, "field2", [
          ["field1", "aba", "!="],
          ["field1", "aca", "!="]
        ])
      );
    });
    it("filters is (one)", () => {
      assert.deepStrictEqual(
        ["key1"],
        dict_sorter(text_dict, "field2", [["field1", "aba", "=="]])
      );
    });
  });

  describe("dict_count_values (function)", () => {
    console.info("TEST : toolkit / dict_count_values (function)");
    // Preparation
    var empty_dict = {};
    var filled_dict = {
      key1: {
        field1: 1,
        field2: 3
      },
      key2: {
        field1: 2,
        field2: 2
      },
      key3: {
        field1: 3,
        field2: 1
      }
    };
    var text_dict = {
      key1: {
        field1: "aba",
        field2: "caa"
      },
      key2: {
        field1: "aca",
        field2: "aaa"
      },
      key3: {
        field1: "acg",
        field2: "aaa"
      }
    };

    // Tests
    it("empty dict", () => {
      assert.deepStrictEqual(0, dict_count_values(empty_dict, "field1", 22));
    });
    it("number field1", () => {
      assert.deepStrictEqual(1, dict_count_values(filled_dict, "field1", 2));
    });
    it("text field1", () => {
      assert.deepStrictEqual(2, dict_count_values(text_dict, "field2", "aaa"));
    });

    console.info("TEST : toolkit - END");
  });
});
