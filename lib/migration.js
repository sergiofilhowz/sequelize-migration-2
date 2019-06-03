const path = require('path');
const { keyBy, sortBy } = require('lodash');
const fs = require('fs');

class SequelizeMigration {

  constructor(sequelize) {
    this.sequelize = sequelize;
    this.Migration = sequelize.import(path.join(__dirname, 'models', 'migration'));
    this.dialectName = sequelize.dialect.name;
    this.modules = [];
  }

  /**
   * Creates a new Migration module
   *
   * @param {Object} options
   * @param {String} options.name  The module name
   * @param {String} options.dir   The migrations directory (must have dialects folder inside)
   */
  addModule(options) {
    this.modules.push(options);
  };

  /**
   * Syncs the database
   */
  async sync() {
    await this.Migration.sync({ force: false });
    for (const dbModule of this.modules) {
      await this.syncModule(dbModule);
    }
  };

  async syncModule(moduleDescriptor) {
    const { Migration, dialectName } = this;
    const migrations = await Migration.findAll({
      where: { 'module': moduleDescriptor.name },
      order: [ ['script_name', 'ASC'] ]
    });

    const migrationsMap = migrations && keyBy(migrations, 'script_name') || {};
    const scripts = sortBy(fs.readdirSync(path.join(moduleDescriptor.dir, dialectName)))
      .filter(scriptName => migrationsMap[scriptName] === undefined);

    for (let script of scripts) {
      const result = /V(\d{14,17})[_][_](.*)\.sql/g.exec(script);
      const description = result && result[2].replace(/[_]/g, ' ');
      const version = result && result[1];
      if (result) {
        const migration = await Migration.create({
          'module': moduleDescriptor.name,
          'execution_ts': new Date(),
          'script_name': script,
          'description': description,
          'version': version,
          'success': false
        });
        const content = fs.readFileSync(path.join(moduleDescriptor.dir, dialectName, script), 'utf8');
        await this.sequelize.query(content);

        migration.success = true;
        await migration.save();
      }
    }
  }
}

module.exports = SequelizeMigration;