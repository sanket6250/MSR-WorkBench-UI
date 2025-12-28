// sql/sqlValidators.js

export const validateIdentifier = (value, max) => {
  if (!value) return "Required";
  if (value.length > max) return `Max ${max} characters`;
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value))
  return "Must start with a letter or underscore";
  return null;
};

export const isSizeRequired = (type) =>
  ["VARCHAR", "VARCHAR2"].includes(type);

// sql/sqlHelpers.js

export const enforceSinglePrimaryKey = (
  columns,
  currentIndex,
  newConstraints
) => {
  if (!newConstraints.includes("PRIMARY KEY")) return columns;

  return columns.map((col, index) => {
    if (index !== currentIndex) {
      return {
        ...col,
        constraints: col.constraints.filter(
          (c) => c !== "PRIMARY KEY"
        ),
      };
    }
    return col;
  });
};
