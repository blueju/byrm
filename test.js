#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var ini = require('ini');
var NRMRC = path.join(process.env.HOME, '.byrmrc');

console.log("NRMRC Contents:");
var nrmrc = fs.readFileSync(NRMRC, 'utf-8');
console.log(nrmrc)
console.log("Parsed NRMRC Contents:");
var parsed_nrmrc = ini.parse(nrmrc);
console.log(parsed_nrmrc);

var cli = require('./cli.js');

console.log("Custom Registry ->")
var quiz = cli.getCustomRegistry();

console.log(quiz);

console.log("All registry ->")
var all = cli.getAllRegistry();
console.log(all);

console.log("Current registry ->")
cli.getCurrentRegistry((cur)=>{
  console.log(cur)
})

