# Sequelize Migration 2
[![Build Status](https://travis-ci.org/sergiofilhowz/sequelize-migration-2.svg?branch=master)](https://travis-ci.org/sergiofilhowz/sequelize-migration-2)

Module to Handle Migration with SQL scripts

## Supported Dialects
Currently Sequelize Migration 2 is supporting only MySQL and PostgreSQL. Other databases may work, but it wasn't tested.

## Install
`npm install sequelize-migration-2 --save`

### To use the module

    // you must first create the sequelize instance
    // sequelize == my sequelize instance
    
    // import the sequelize migration and create a new instance with the sequelize instance
    var SequelizeMigration = require('sequelize-migration-2'),
        migration = new SequelizeMigration(sequelize);
        
    // then add the module
    migration.addModule({
        name: 'my-module-name',
        dir: 'path/to/my/scripts/directory'
    });
    // your script directory must have one folder for each configured dialect
    // scripts/
    //   └─ mysql/
    //   └─ postgres/
    
    // now all you have to do is
    migration.sync().then(() => { // returns a Promise (Sequelize.Promise)
        console.log('hell yeah!');
    }); 
    
## Notice
* The module name is very important because it may have conflict with other modules, ensure you have a unique module name identifier.
* One table will be created into your database called `db_migration`
* Your script directory must have one folder for each configured dialect. E.g

```
scripts/
  └─ mysql/
  └─ postgres/
```

## Contibuting
All you have to do is execute only two commands, thank you!

```
$ npm install
$ npm test
```

## Upcoming Features
* MD5 checksum
