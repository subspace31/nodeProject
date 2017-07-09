let express = require('express')
let cool = require('cool-ascii-faces')
let formidable = require('formidable')
let path = require('path')
let fs = require('fs')

let models = require('../models')
let utils = require('../utils')


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
    } else {
        res.redirect('/login')
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

    if (req.session && req.session.user) {
        let images = []
        let options = {
            where: {
                seller_id: req.session.user.id
            }
        }
        if (req.body.limit)
            options.limit = req.body.limit
        if (req.body.offset)
            options.offset = req.body.offset

        models.Image.findAndCountAll(options).then(response => {
            let data = {
                count: response.count
            }
            response.rows.forEach(image => {
                images.push(image.dataValues.name)
            })

            data.images = images

            res.json(data)
        })
    }
})

router.post('/upload', function(req, res) {
    console.log('upload called')

    let form = new formidable.IncomingForm()

    form.multiples = true
    form.uploadDir = path.join(__dirname, '..', '/public/img', '/15')

    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name))
        models.Image.findOrCreate({
            where: {
                seller_id: req.session.user.id,
                name: file.name
            }
        })
    })

    form.on('error', function(err) {
        console.log('An error has occurred: \n' + err)
    })

    form.on('end', function() {
        res.end('success')
    })

    form.parse(req)
})

module.exports = router
