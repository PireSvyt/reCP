import { recp_view_copy } from "../../src/config/copy.js";
import { config } from "../../src/config/config.js";
import { random_id, dict_sorter } from "../../src/models/toolkit.js";
import { snack } from "../index.js";

export class Snack {
  // -
  constructor() {
    this.displaylist = {};
    this.container = this.getElement("#snack-div");
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
  add(message, duration = 3000, color = "darkgrey") {
    // Retreive content
    var snack_message = undefined;
    var snack_color = undefined;
    if (recp_view_copy[message] !== undefined) {
      snack_message = recp_view_copy[message][config.app.language];
      snack_color = recp_view_copy[message]["color"];
      if (snack_color === undefined) {
        snack_color = color;
      }
    } else {
      snack_message = message;
      snack_color = color;
    }
    // Check container
    if (this.container !== undefined) {
      // Create snack
      var id = random_id();
      var snack_div = this.createElement(this.container, "div", "");
      snack_div.id = id;
      snack_div.className = "snackmessage";
      snack_div.style.backgroundColor = snack_color;
      var snack_content = this.createElement(snack_div, "p", "");
      snack_content.innerHTML = snack_message;
      this.displaylist[id] = {
        div: snack_div,
        prio: -1,
        content: snack_message,
        id: id
      };

      // Shift previous message
      this.moveup();

      // Plan deletion
      setTimeout(function () {
        snack.delete(id);
      }, duration);
    }
    return id;
  }
  moveup() {
    var sorter = dict_sorter(this.displaylist, "prio");
    for (var i = 0; i < sorter.length; i++) {
      this.displaylist[sorter[i]]["prio"] += 1;
      this.displaylist[sorter[i]]["div"].style.bottom = 30 + 60 * i + "px";
    }
  }
  delete(id) {
    if (document.getElementById(id)) {
      this.displaylist[id]["div"].parentNode.removeChild(
        this.displaylist[id]["div"]
      );
      delete this.displaylist[id];
    }
  }
}
