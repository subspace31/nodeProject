let express = require('express');
let cool = require('cool-ascii-faces')

let models = require('../models');
let utils = require('../utils');


let router = express.Router();

let loggedIn = false
let data = {
    title: '',
    id: 0,
    logAction: ((loggedIn) ? 'login':'logout'),
    logText: ((loggedIn) ? 'Login':'Log Out'),
}

router.get('/', function(req, res) {
    if (req.session && req.session.user){
        loggedIn = true
        data.id = req.session.user.id
    }
    data.title = 'Add Listing'

    let cat = []
    models.Category.all().then(cats => {
        cats.forEach( category => {
            cat.push(category.dataValues.category + '')
        })
        data.cat = cat
        res.render('pages/index', data)
    })
})

router.get('/cool', function(req, res) {
    res.send(cool())
})

router.post('/getImages', function(req, res) {
    models.Image.findAll({
            where: {
                seller_id: req.session.user.id
            }
        }).then(response => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response[0].dataValues.name));
            console.log(response[0].dataValues.name)
        })

})

router.get('/upload', function(req, res) {
    let temp_path = req.files.upload.path;
})

module.exports = router
