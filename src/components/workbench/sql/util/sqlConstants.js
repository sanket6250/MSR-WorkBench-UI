// sql/sqlConstants.js

export const DB_LIMITS = {
  postgres: { table: 63, column: 63 },
  mysql: { table: 64, column: 64 },
  mssql: { table: 128, column: 128 },
  oracle: { table: 30, column: 30 },
};

export const DATA_TYPES = {
  postgres: ["VARCHAR", "INT", "BIGINT", "BOOLEAN", "DATE"],
  mysql: ["VARCHAR", "INT", "BIGINT", "BOOLEAN", "DATE"],
  mssql: ["VARCHAR", "INT", "BIGINT", "BIT", "DATE"],
  oracle: ["VARCHAR2", "NUMBER", "DATE"],
};

export const CONSTRAINT_OPTIONS = [
  "PRIMARY KEY",
  "UNIQUE",
  "NOT NULL",
  "FOREIGN KEY",
  "NONE"
];
