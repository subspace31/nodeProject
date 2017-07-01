var connectionString = process.env.DATABASE_URL || 'postgres://postgres:reddragon@localhost/postgres'
models = require('./models.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize( connectionString, {
    define: {
        timestamps: false
    }
})

module.exports.User = sequelize.define('sellers', {
    email: Sequelize.TEXT,
    password: Sequelize.TEXT
})

module.exports.Category = sequelize.define('categories', {
    category: Sequelize.TEXT,
    description: Sequelize.TEXT,
})

module.exports.Image = sequelize.define('images', {
    seller_id: {
        type: Sequelize.INTEGER,
        references: {
            model: models.User,
            key: 'seller_id'
        }
    },
    path: Sequelize.TEXT,
    name: Sequelize.TEXT
})

module.exports.Item = sequelize.define('items', {
    seller_id: {
        type: Sequelize.INTEGER,
        references: {
            model: models.User,
            key: 'seller_id'
        }
    },
    name: Sequelize.TEXT,
    description: Sequelize.TEXT,
    cost: Sequelize.TEXT,
    category_id: {
        type: Sequelize.INTEGER,
        references: {
            model: models.Category,
            key: 'id'
        }
    }
})

module.exports.Item_Image = sequelize.define('item_images', {
    item_id: {
        type: Sequelize.INTEGER,
        references: {
            model: models.Item,
            key: 'item_id'
        }
    },
    image_id: {
        type: Sequelize.INTEGER,
        references: {
            model: models.Image,
            key: 'id'
        }
    }
})