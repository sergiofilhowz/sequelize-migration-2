module.exports = function (sequelize, DataTypes) {
    var Migration = sequelize.define('Migration', {
        execution_id : {
            type : DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement : true
        },

        module : DataTypes.STRING,
        execution_ts : DataTypes.DATE,
        script_name : DataTypes.STRING,
        description : DataTypes.STRING,
        version : DataTypes.STRING,
        success : DataTypes.BOOLEAN
    }, {
        timestamps : false,
        paranoid : false,
        tableName : 'db_migration'
    });

    return Migration;
};