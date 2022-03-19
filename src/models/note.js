import { random_id, dict_sorter } from "../../src/models/toolkit.js";

export class Note {
  constructor() {
    this.container = undefined;
    this.buffer = {};
  }
  // METHODS
  add(newMessage, newFlag, newIndents = 0) {
    let flags = ["log", "info", "error", "event"];
    var newlog = undefined;
    if (flags.includes(newFlag)) {
      newlog = {
        flag: newFlag,
        message: newMessage,
        date: Date.now(),
        indents: newIndents
      };
    } else {
      newlog = {
        flag: "unknown",
        message: newMessage,
        date: Date.now(),
        indents: newIndents
      };
      console.info("Note.add, added even with unrecognised flag : " + newFlag);
    }
    this.buffer[random_id()] = newlog;
  }
  print(field = "date", filters = []) {
    var sortedBuffer = dict_sorter(this.buffer, field, filters);
    var indent = "";
    for (const i of sortedBuffer) {
      indent = "";
      for (var j = 0; j < this.buffer[i].indents; j++) {
        indent += "  ";
      }
      switch (this.buffer[i].flag) {
        case "log":
          console.log(indent + this.buffer[i].message);
          delete this.buffer[i];
          break;
        case "info":
          console.info(indent + this.buffer[i].message);
          delete this.buffer[i];
          break;
        case "error":
          console.error(indent + this.buffer[i].message);
          delete this.buffer[i];
          break;
        default:
        // Nothing
      }
    }
  }
}
