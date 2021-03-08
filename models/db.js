const Sequelize = require('sequelize');

const conn = new Sequelize('nodejs', 'root', '252525', {
    host: 'localhost',
    dialect: 'mariadb'
});

module.exports = {
    Sequelize: Sequelize,
    conn: conn
}