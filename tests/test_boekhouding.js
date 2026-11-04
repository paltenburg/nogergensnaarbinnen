"use strict";
const assert = require("node:assert/strict");
const {parseMoney,sheetIdFrom,rowFromValues,sameRow,direction} = require("../boekhouding/app.js");
for(const [value, expected] of [
  ["€1,000.00",1000],["€1.000,00",1000],["€3,149.90",3149.9],
  ["25,50",25.5],["-3,20",-3.2],["0",0],["€995.00",995]
])assert.equal(parseMoney(value),expected,"Failed amount: "+value);
assert.ok(Number.isNaN(parseMoney("abc")));
assert.ok(Number.isNaN(parseMoney("")));
assert.equal(sheetIdFrom("https://docs.google.com/spreadsheets/d/1Qu8E69DFp4hvvqtMyGFE_djJ5gqYHb0ufMWOgRYIPu4/edit"),"1Qu8E69DFp4hvvqtMyGFE_djJ5gqYHb0ufMWOgRYIPu4");
assert.equal(sheetIdFrom("https://evil.example/spreadsheets/d/1Qu8E69DFp4hvvqtMyGFE_djJ5gqYHb0ufMWOgRYIPu4/edit"),"");
const row=rowFromValues(["2026-05-02","Aldi","Janne","Popke","€51.00"],8);
assert.equal(row.rowNumber,8);
assert.equal(row.amount,51);
assert.equal(direction(row),1);
assert.equal(direction({...row,from:"Popke",to:"Janne"}),-1);
assert.equal(direction({...row,from:"",to:""}),0);
assert.ok(sameRow(row,{...row}));
assert.ok(!sameRow(row,{...row,amount:52}));
assert.equal(rowFromValues(["","","","","€995.00"],14).amount,995);
assert.equal(rowFromValues([],15),null);
console.log("Boekhouding unit tests geslaagd.");
