var fs = require('fs')
var express = require('express')
var body = require('body-parser')
var session = require('client-sessions')
let favicon = require('serve-favicon')

var middleware = require('./middleware')

module.exports.createUserSession = function(req, res, user) {
    var theUser = {
        id: user.id,
        email: user.email
    }

    req.session.user = theUser
    req.user = theUser
    res.locals.user = theUser
}

module.exports.createApp = function() {
    var app = express()
    app.set('port', (process.env.PORT || 5000))

    app.use(express.static(__dirname + '/public'))
    app.use(favicon(__dirname + '/public/img/favicon.ico'))
    // views is directory for all template files
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs')
    app.use(middleware.simpleAuth)

    app.use(body.json())
    app.use(body.urlencoded({ extended: true }))
    app.use(session({
        cookieName: 'session',
        secret: 'the game',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
    }))


    //routes
    app.use(require('./routes/main'))
    app.use(require('./routes/auth'))

    return app;
}