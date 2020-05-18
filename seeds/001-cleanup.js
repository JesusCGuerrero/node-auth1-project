const cleaner = require("knex-cleaner");

function cleanTables(knex) {
  return cleaner
    .clean(knex, {
<<<<<<< HEAD
      mode: "delete",
=======
      mode: "truncate",
>>>>>>> 45103d3dcca0139b6bde7cc0cce6b05008aa2cd1
      restartIdentity: true, // ask PosrgreSQL to reset the Primary Keys back to 0
      ignoreTables: ["knex_migrations", "knex_migrations_lock"],
    })
    .then(() => console.log("\n== All tables truncated, ready to seed ==\n"));
}

exports.seed = function (knex) {
  if (knex.client.config.client === "sqlite3") {
    /* 
      a recent version of SQLite3 broke knex-cleaner's functionality when foreign keys are enabled,
      so we're temporarily disabling foreign keys when running the seeds against SQLite3.
    */
    return knex.raw("PRAGMA foreign_keys = OFF;").then(() => cleanTables(knex));
  } else {
    return cleanTables(knex);
  }
};