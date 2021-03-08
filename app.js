const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const handlebars = require('express-handlebars');
const moment = require('moment');
const pagamento = require('./models/Pagamento');
const path = require('path');

//Configurações
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY H:m')
        }
    }
}));

app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Sessões
app.use(session({
    secret: 'secsession',
    resave: true,
    saveUninitialized: true
}));

app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})

//CSS
app.use(express.static(path.join(__dirname, "public")));

/** Rotas **/

//Listar Pagamentos
app.get('/list-pagamentos', function (req, res) {
    pagamento.findAll({ order: [['id', 'ASC']] }).then(function (allPagamentos) {
        res.render('list-pagamentos', { pagamentos: allPagamentos.map(id => id.toJSON()) });
    });
});


//View Cadastro Pagamento
app.get('/cad-pagamento', function (req, res) {
    res.render('cad-pagamento');
});

//Add Pagamento
app.post('/add-pagamento', function (req, res) {
    pagamento.create({
        nome: req.body.nome,
        valor: req.body.valor
    }).then(function () {
        req.flash('success_msg', 'Pagamento cadastrado com Sucesso!');
        res.redirect('/list-pagamentos');
    }).catch(function (err) {
        req.flash('error_msg', 'Oops, não foi possivel cadastrar o pagamento!');
    });
});


//View - Editar Pagamento
app.get('/edit-pagamento/:id', function (req, res) {
    pagamento.findByPk(req.params.id).then(post => {
        res.render('edit-pagamento', {
            id: req.params.id,
            nome: post.nome,
            valor: post.valor
        });
    }).catch(function (err) {
        req.flash('error_msg', 'Oops, pagamento não encontrado');
    });
});

//View - Detalhes Pagamento
app.get('/view-pagamento/:id', function (req, res) {
    pagamento.findByPk(req.params.id).then(post => {
        res.render('view-pagamento', {
            id: req.params.id,
            nome: post.nome,
            valor: post.valor
        });
    }).catch(function (err) {
        req.flash('error_msg', 'Oops, pagamento não encontrado');
    });
});


//Update Pagamento
app.post('/update-pagamento/:id', function (req, res) {
    pagamento.update({
        nome: req.body.nome,
        valor: req.body.valor
    }, {
        where: {
            id: req.params.id
        }
    }).then(function () {
        req.flash('success_msg', 'Pagamento atualizado com Sucesso!');
        res.redirect('/list-pagamentos');
    }).catch(function (err) {
        req.flash('error_msg', 'Oops, não foi possivel atualizar o pagamento!');
    });
});

//Delete Pagamento
app.get('/del-pagamento/:id', function (req, res) {
    pagamento.destroy({
        where: {
            'id': req.params.id
        }
    }).then(function () {
        req.flash('success_msg', 'Excluido com Sucesso!');
        res.redirect('/list-pagamentos');
    }).catch(function (err) {
        req.flash('error_msg', 'Opps, não foi possivel excluir!');
    });

});

app.listen(8080)
