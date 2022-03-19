import { Controler } from "../src/api/controler.js";
import { Snack } from "./views/snack.js";
import { Note } from "./models/note.js";

//import "./api/storage.js";

// Spawn
export var snack = new Snack();
export var note = new Note();
export var app = new Controler();

// Open
app.spawn();
