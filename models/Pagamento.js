const db = require('./db');

const Pagamento = db.conn.define('tbl_pagamentos', {
    nome: {
        type: db.Sequelize.STRING
    },
    valor: {
        type: db.Sequelize.DOUBLE
    }
});

module.exports = Pagamento;