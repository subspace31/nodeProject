var cool = require('cool-ascii-faces')
var fs = require('fs')

var express = require('express')
var app = express()

var body = require('body-parser')

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:reddragon@localhost/postgres'
const { Pool } = require('pg')
const pool = new Pool( {connectionString} )

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))
app.use(body.json())
app.use(body.urlencoded({
    extended: true
}))

// views is directory for all template files
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function(request, response) {
    var cat = []
    pool.query('SELECT * FROM categories ORDER BY category', (err, res) => {
          if (err) throw err
          else {
              console.log(res.rows[1].category)
              console.log(res.rowCount)
              for (let i = 0; i < res.rowCount; i++)
                  cat.push(res.rows[i].category)
              response.render('pages/index', {cat})
          }
    })
})

app.get('/cool', function(req, res) {
    res.send(cool())
})

app.get('/shipping', function(req, res) {
    res.render('pages/postalrates')
})

app.get('/login', function(req, res) {
    res.render('pages/login')
})

app.post('/calculate', function(req, res) {
    var weight = +req.body.weight
    var type = req.body.type

    console.log(calcShipping(weight, type).toFixed(2))
    res.render('pages/response', { cost:calcShipping(weight, type).toFixed(2), weight, type })
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'))
})

function calcShipping(weight, type) {
    var answer = 0;
    switch (type) {
        case 'Letters (Stamped)':
            if (weight > 0 && weight <= 3.5) {
                answer = 0.49
            } else answer = 0.98

            for (let i = 1; i < weight; i++) {
                answer += 0.21
            }
            break;
        case 'Letters (Metered)':
            if (weight > 0 && weight <= 3.5) {
                answer = 0.46
            } else answer = 0.98

            for (let i = 1; i < weight; i++) {
                answer += 0.21
            }
            break;
        case 'Large Envelopes (Flats)':
            if (weight > 0) {
                answer = 0.98
            }
            for (let i = 1; i < weight; i++) {
                answer += 0.21
            }
            break;
        case 'Parcel':
            if (weight > 0) {
                answer = 2.67
            }
            for (let i = 4; i < weight; i++) {
                answer += 0.21
            }
            break;
    }
    return answer;
}