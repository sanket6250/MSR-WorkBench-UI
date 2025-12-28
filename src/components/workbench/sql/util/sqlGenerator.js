// sql/sqlGenerator.js

export const generateCreateTableSQL = (
  tableName,
  columns
) => {
  if (!tableName) return "";

  const columnDefs = [];
  const foreignKeys = [];

  columns.forEach((c) => {
    if (!c.name) return;

    let line = `${c.name} ${c.type}`;
    if (c.size) line += `(${c.size})`;
    if (c.constraints.includes("NOT NULL"))
      line += " NOT NULL";
    if (c.constraints.includes("UNIQUE"))
      line += " UNIQUE";

    columnDefs.push(`  ${line}`);

    if (
      c.constraints.includes("FOREIGN KEY") &&
      c.refTable &&
      c.refColumn
    ) {
      foreignKeys.push(
        `  FOREIGN KEY (${c.name}) REFERENCES ${c.refTable}(${c.refColumn})`
      );
    }
  });

  const pk = columns.find((c) =>
    c.constraints.includes("PRIMARY KEY")
  );
  if (pk) {
    columnDefs.push(
      `  PRIMARY KEY (${pk.name})`
    );
  }

  return `CREATE TABLE ${tableName} (\n${[
    ...columnDefs,
    ...foreignKeys,
  ].join(",\n")}\n);`;
};
