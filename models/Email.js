const emailCollection = require('../db').db().collection('emails')
const { ObjectID } = require('mongodb')
const validator = require('validator')

function Email(email) {
    this.email = email
    this.errors = []
}

Email.prototype.validate = function() {
    if (this.email.name == '') this.errors.push('You must Provide your full name')
    if (this.email.email == '') this.errors.push('You must provide a valid email address')
    if (!validator.isEmail(this.email.email)) this.errors.push('Your email is not valid')
    if (this.email.phone == '') this.errors.push('You must Provide your phone number')
    if (this.email.message == '') this.errors.push('Please type your message')
}

Email.prototype.cleanup = function() {
    if (typeof(this.email.name) != 'string') this.email.name = ''
    if (typeof(this.email.email) != 'string') this.email.email = ''
    if (typeof(this.email.phone) != 'string') this.email.phone = ''
    if (typeof(this.email.message) != 'string') this.email.message = ''

    this.email = {
        name: this.email.name.trim().toUpperCase(),
        email: this.email.email.trim(),
        phone: this.email.phone.trim(),
        message: this.email.message.trim(),
        date: new Date()
    }
}

Email.emailCount = function() {
    return new Promise(async (resolve, reject) => {
        let emailCount = await emailCollection.countDocuments()
        resolve(emailCount)
    })
}

Email.prototype.send = function() {
    return new Promise((resolve, reject) => {
        this.cleanup()
        this.validate()
        if (!this.errors.length) {
            emailCollection.insertOne(this.email).then(() => {
                resolve()
            }).catch(() => {
                reject('Please try again later')
            })
            resolve()
        } else {
            reject(this.errors)
        }
        
        resolve()
    })
}

Email.all = function() {
    return new Promise((resolve, reject) => {
        emailCollection.find({}).toArray(function(err, emails) {
            if (emails) {
                resolve(emails)
            } else {
                reject('We cannont find any email')
            }
        })
    })
}


Email.delete = function(emailId) {
    return new Promise((resolve, reject) => {
        if (typeof(emailId) != 'string' || !ObjectID.isValid(emailId)) {
            reject() 
            return
        }

        emailCollection.findOneAndDelete({_id: ObjectID(emailId)}).then(() => {
            resolve()
        }).catch(() => {
            reject('Please try again later')
        })
    })
}

Email.view = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject()
            return
        }

        let email = await emailCollection.findOne({_id: ObjectID(id)})
        resolve(email)
    })
}
module.exports = Email