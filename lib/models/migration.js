module.exports = function (sequelize, { BIGINT, STRING, DATE, BOOLEAN }) {
  return sequelize.define('Migration', {
    'execution_id': { type: BIGINT, primaryKey: true, autoIncrement: true },
    'module': STRING,
    'execution_ts': DATE,
    'script_name': STRING,
    'description': STRING,
    'version': STRING,
    'success': BOOLEAN
  }, {
    timestamps: false,
    paranoid: false,
    tableName: 'db_migration'
  });
};