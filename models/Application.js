const ObjectID = require('mongodb').ObjectID
const validator = require('validator')
const applicationCollection = require('../db').db().collection('applications')

function Application (data) {
    this.data = data
    this.errors = []
}

Application.prototype.validate = function() {
    if (this.data.firstName == '') this.errors.push('First Name field cannot be Empty')
    if (this.data.lastName == '') this.errors.push('Last Name field cannot be Empty')
    if (this.data.state == '') this.errors.push('You must type your state')
    if (this.data.LGA == '') this.errors.push('You must type your LGA')
    if (this.data.DoB == '') this.errors.push('You must choose your date of birth')
    if (this.data.passport == '') this.errors.push('Upload a passport')
    if (this.data.nationality == '') this.errors.push('Type your country')
    if (this.data.sex == 'select_your_gender') this.errors.push('Please select your gender')
    if (this.data.classForAdmin == '') this.errors.push('Select a class you want to apply for')
    if (this.data.lastSchool == '') this.errors.push("Select the last school you've attende 'type none is none'")
    if (this.data.ffirstName == '') this.errors.push('Parents First Name field cannot be Empty')
    if (this.data.flastName == '') this.errors.push('Parents Last Name field cannot be Empty')
    if (this.data.contactAddress == '') this.errors.push('Type your home address')
    if (this.data.phone == '') this.errors.push('Please type your phone number')
}

Application.prototype.cleanup = function() {
    if (typeof(this.data.firstName) != 'string') this.data.firstName = ''
    if (typeof(this.data.lastName) != 'string') this.data.lastName = ''
    if (typeof(this.data.middleName) != 'string') this.data.middleName = ''
    if (typeof(this.data.state) != 'string') this.data.state = ''
    if (typeof(this.data.LGA) != 'string') this.data.LGA = ''
    if (typeof(this.data.DoB) != 'string') this.data.DoB = ''
    if (typeof(this.data.placeDoB) != 'string') this.data.placeDoB = ''
    // if (typeof(this.data.passport) != 'string') this.data.passport = ''
    if (typeof(this.data.nationality) != 'string') this.data.nationality = ''
    if (typeof(this.data.sex) != 'string') this.data.sex = ''
    if (typeof(this.data.religion) != 'string') this.data.religion = ''
    if (typeof(this.data.tribe) != 'string') this.data.tribe = ''
    if (typeof(this.data.classForAdmin) != 'string') this.data.classForAdmin = ''
    if (typeof(this.data.lastSchool) != 'string') this.data.lastSchool = ''
    if (typeof(this.data.ffirstName) != 'string') this.data.ffirstName = ''
    if (typeof(this.data.fmiddleName) != 'string') this.data.fmiddleName = ''
    if (typeof(this.data.flastName) != 'string') this.data.flastName = ''
    if (typeof(this.data.contactAddress) != 'string') this.data.contactAddress = ''
    if (typeof(this.data.occupation) != 'string') this.data.occupation = ''
    if (typeof(this.data.phone) != 'string') this.data.phone = ''
    if (typeof(this.data.email) != 'string') this.data.email = ''

    
    this.data = {
        firstName: this.data.firstName.trim().toUpperCase(),
        middleName: this.data.middleName.trim().toUpperCase(),
        lastName: this.data.lastName.trim().toUpperCase(),
        state: this.data.state.trim().toUpperCase(),
        LGA: this.data.LGA.trim().toUpperCase(),
        DoB: this.data.DoB.trim().toUpperCase(),
        placeDoB: this.data.placeDoB.trim().toUpperCase(),
        passport: this.data.passport,
        nationality: this.data.nationality.trim().toUpperCase(),
        sex: this.data.sex.toUpperCase(),
        religion: this.data.religion.trim().toUpperCase(),
        tribe: this.data.tribe.trim().toUpperCase(),
        classForAdmin: this.data.classForAdmin.trim().toUpperCase(),
        lastSchool: this.data.lastSchool.trim().toUpperCase(),
        ffirstName: this.data.ffirstName.trim().toUpperCase(),
        fmiddleName: this.data.fmiddleName.trim().toUpperCase(),
        flastName: this.data.flastName.trim().toUpperCase(),
        contactAddress: this.data.contactAddress.trim(),
        occupation: this.data.occupation.trim().toUpperCase(),
        phone: this.data.phone.trim(),
        email: this.data.email.trim(),
        date: new Date()

    }
}

Application.prototype.submit = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanup()
        this.validate()
        if (!this.errors.length) {
            applicationCollection.insertOne(this.data).then(() => {
                resolve()
            }).catch(() => {
                reject('Please try again later')
            })
        } else {
            reject(this.errors)
        }
    })
}

Application.view = function() {
    return new Promise(async (resolve, reject) => {
        applicationCollection.find({}).toArray((err, app) => {
            if (err) throw err

            if (app) {
                resolve(app)
            } else {
                reject('Sorry we cannot find any application')
            }
        })
    })
}

Application.ifappExist = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) != 'string') {
            reject()
            return
        }

        let appDetail = await applicationCollection.findOne({_id: ObjectID(id)})
        if (appDetail) {
            resolve(appDetail)
        } else {
            reject('No such application found!')
        }
    })
}

module.exports = Application