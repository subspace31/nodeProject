let models = require('./models')
let utils = require('./utils')

module.exports.simpleAuth = function(req, res, next) {
    if (req.session && req.session.user) {
        models.User.findOne({
            where: {
                email: req.session.user.email
            }}).then(user => {
               utils.createUserSession(req, res, user)
        })
        next()
    } else {
        next()
    }
}