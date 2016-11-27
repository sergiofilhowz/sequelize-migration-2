var path = require('path'),
    _ = require('lodash'),
    fs = require('fs');

module.exports = function SequelizeMigration(sequelize) {
    'use strict';

    var Migration = sequelize.import(path.join(__dirname, 'models', 'migration')),
        dialectName = sequelize.dialect.name,
        Promise = sequelize.Promise,
        modules = [];

    this.Migration = Migration;

    this.addModule = addModule;
    this.sync = sync;

    /**
     * Creates a new Migration module
     *
     * @param {Object} options
     * @param {String} options.name  The module name
     * @param {String} options.dir   The migrations directory
     *                               (must have dialects folder inside)
     */
    function addModule(options) {
        modules.push(options);
    };

    /**
     * Syncs the database
     */
     function sync() {
        return Migration.sync({ force : false })
            .then(() => Promise.each(modules, dbModule => syncModule(dbModule)));
    };

    function syncModule(moduleDescriptor) {
        return Migration.findAll({
            where : { module : moduleDescriptor.name },
            order : [
                ['script_name', 'ASC']
            ]
        }).then(migrations => {
            var migrationsMap = migrations && _.keyBy(migrations, 'script_name') || {};
            var scripts = _.sortBy(fs.readdirSync(path.join(moduleDescriptor.dir, dialectName)))
                .filter(scriptName => migrationsMap[scriptName] === undefined);

            return Promise.each(scripts, script => {
                // V20161126195933546__create_sample.sql
                let result = /V(\d{17})[_][_](.*)\.sql/g.exec(script),
                    description = result && result[2].replace(/[_]/g, ' '),
                    version = result && result[1];
                if (result) {
                    return Migration.create({
                        module : moduleDescriptor.name,
                        execution_ts : new Date(),
                        script_name : script,
                        description : description,
                        version : version,
                        success : false
                    }).then(migration => {
                        migration.success = true;
                        var content = fs.readFileSync(path.join(moduleDescriptor.dir, dialectName, script), 'utf8');
                        return sequelize.query(content)
                            .then(() => migration.save());
                    });
                }
            });
        });
    };
};