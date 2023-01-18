const fs = require("fs");
const idl = require("../target/idl/maius_invest.json");

fs.writeFileSync("config/idl.json", JSON.stringify(idl));
fs.copyFileSync(
  "../target/types/maius_invest.ts",
  "config/maius_invest.ts"
);