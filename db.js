const dovenv = require('dotenv')
dovenv.config()
const mongodb = require('mongodb')



mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    module.exports = client
    const app = require('./app')
    app.listen(process.env.PORT || 3000, () => console.log('Server running'))
})

