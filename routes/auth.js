let bcrypt = require('bcryptjs')
let express = require('express')

let models = require('../models')
let utils = require('../utils')

let router = express.Router()

let loggedIn = false
let data = {
    title: '',
    logAction: ((loggedIn) ? 'logout':'Log Out'),
    logText: ((loggedIn) ? 'login':'Login'),
}

router.get('/register', function(req, res) {
    if (req.session && req.session.user)
        loggedIn = true
    data.title = 'Register'
    res.render('pages/register.ejs', data)
})

router.post('/register', function(req, res) {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(req.body.password, salt)

    models.User.findOrCreate({
        where: {
            email: req.body.email,
            password: hash
        }
    }).spread((user, created) => {
        console.log(user.get({
            plain:true
        }))
        utils.createUserSession(req, res, created)
        res.redirect('/')
    })
})


router.get('/login', function(req, res) {
    if (req.session && req.session.user)
        loggedIn = true
    data.title = 'Login'
    res.render('pages/login.ejs', data)
})

router.post('/login', function(req, res) {
    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (bcrypt.compareSync(req.body.password, user.dataValues.password)) {
            console.log(user.get({plain:true}))
            utils.createUserSession(req, res, user.get({ plain:true }))
            res.redirect('/')
        }
    })

})

router.get('/logout', function(req, res) {
    if (req.session) {
        req.session.reset()
    }
    res.redirect('/login')
})

module.exports = router
