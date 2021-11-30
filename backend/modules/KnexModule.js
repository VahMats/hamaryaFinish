const mysqlConfigs = require('../configs/mysql')

const knex = require('knex')(mysqlConfigs);

module.exports = async (query, bindings = []) => {
    const [ row = [] ] = await knex.raw(query, bindings);
    return row;
}
