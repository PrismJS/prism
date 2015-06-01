"use strict";

var fs = require("fs");
var vm = require('vm');

var fileContent = fs.readFileSync(__dirname + "/../../components.js", "utf8");
var context = {};
vm.createContext(context);
vm.runInContext(fileContent, context);

module.exports = context.components;
