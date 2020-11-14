const validator = require('validator')
// const { admin } = require('../controllers/templateController')
const teachersCollection = require('../db').db().collection("teachers")
const teachersDataCollection = require('../db').db().collection('teachersData')
const studentCollection = require('../db').db().collection('students')
const adminCollection = require('../db').db().collection('admin')
const ObjectID = require('mongodb').ObjectID

function User(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if (typeof(this.data.email) != 'string') this.data.email = ''
    if (typeof(this.data.password) != 'string') this.data.password = ''

    // over write the user data

    this.data = {
        email: this.data.email.toLowerCase().trim(),
        password: this.data.password,
    }
}

User.prototype.validate = function() {
    if (this.data.email == '') this.errors.push('username field cannot be empty')
    if (this.data.password == '') this.errors.push('password field cannot be empty')
    if (!validator.isEmail(this.data.email)) this.errors.push('You must provide a valid email address')
}


User.prototype.cleanTeachersForm = function() {

    if (typeof(this.data.firstName) != 'string') this.data.firstName = ''
    if (typeof(this.data.lastName) != 'string') this.data.lastName = ''
    if (typeof(this.data.email) != 'string') this.data.email = ''
    if (typeof(this.data.DoB) != 'string') this.data.DoB = ''
    if (typeof(this.data.class) != 'string') this.data.class = 'select a class'
    if (typeof(this.data.gender) != 'string') this.data.gender = 'select your gender'
    if (typeof(this.data.phone) != 'string') this.data.phone = ''
    if (typeof(this.data.password) != 'string') this.data.password = ''
    if (typeof(this.data.confirmPassword) != 'string') this.data.confirmPassword = ''

    // over write the form before submitting
    this.data = {
        firstName: this.data.firstName.toUpperCase().trim(),
        lastName: this.data.lastName.toUpperCase().trim(),
        email: this.data.email.toLowerCase().trim(),
        DoB: this.data.DoB.trim(),
        class: this.data.class.toUpperCase(),
        gender: this.data.gender,
        phone: this.data.phone,
        password: this.data.password,
        createdDate: new Date()
    }  
}


User.prototype.validateTeachersForm = function() {
    if (this.data.firstName == '') this.errors.push('First field name cannot be empty')
    if (this.data.lastName == '') this.errors.push('Last field name cannot be empty') 
    if (this.data.email == '') this.errors.push('Email field cannot be empty')
    if (this.data.DoB == '') this.errors.push('Date of Birth field cannot be empty')
    if (this.data.class == 'select a class') this.errors.push('You must select a class')
    if (this.data.gender == 'select your gender') this.errors.push('You must select your gender')
    if (this.data.phone == '') this.errors.push('You must provide your phone number')
    if (this.data.password == '') this.errors.push('Password field cannot be empty')
    if (this.data.confirmPassword == '') this.errors.push('Please confirm password')
}

User.teacherCount = function() {
    return new Promise(async (resolve, reject) => {
        let teacherCount = await teachersDataCollection.countDocuments()
        resolve(teacherCount)
    })
}


User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            // talk to a database

            teachersDataCollection.findOne({email: this.data.email}).then((attemptedUser) => {
                if (attemptedUser && attemptedUser.password == this.data.password) {
                    resolve(attemptedUser)
                } else {
                    reject('Invalid username / password')
                }
            }).catch(() => {
                reject('Please try again later')
            })
        } else (
            reject(this.errors)
        )
    })
}


// email checker and sisnup page rendering 
User.prototype.checkEmail = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        if (this.data.email == '') this.errors.push('email field cannot be empty')
        if (!this.errors.length) {
           if (!this.errors.length) {
               // check for an existing email in the database

               teachersCollection.findOne({email: this.data.email}).then((emailExist) => {
                    if (emailExist) {
                        console.log(emailExist)
                        resolve()
                    } else {
                        reject('That email dose not exits')
                    }
               }).catch(() => {
                   reject('Please try again later')
               })
            
           }
        }
    })
}


User.prototype.submit = function() {
    return new Promise((resolve, reject) => {
        this.cleanTeachersForm()
        this.validateTeachersForm()
        if (!this.errors.length) {
            
            // check if teacher exist
            teachersCollection.findOne({email: this.data.email}).then((teacherExist) => {
                if (teacherExist) {
                    reject('You are already a teacher')
                } else {
                    teachersDataCollection.insertOne(this.data).then(() => {
                        resolve()
                    }).catch((error) => {
                        reject('Please try again later')
                    })
                }
            }).catch(() => {
                reject('Please try again later')
            })
        } else {
            reject(this.errors)
        }
    })
}

User.prototype.adminLogin = function () {
    return new Promise((resolve, reject) => {
        this.validate()
        this.cleanUp()
        if (!this.errors.length) {
            adminCollection.findOne({email: this.data.email}).then((admin) => {
                if (admin && admin.password == this.data.password) {
                    resolve(admin)
                } else {
                    reject('Invalid username or password')
                }
            }).catch(() => {
                reject('Please try again later')
            })
        } else {
            reject(this.errors)
        }
    })
}

User.ifTeacherExist = function(teachersId) {
    return new Promise(async (resolve, reject) => {
        if (typeof(teachersId) != 'string' || !ObjectID.isValid(teachersId)) {
            reject()
            return
        } else {
            teachersDataCollection.findOne({_id: new ObjectID(teachersId)}).then((teacher) => {
                if (teacher) {
                    resolve(teacher)
                } else {
                    reject('We cannot find that Teacher')
                }
            }).catch((err) => {
                reject('Please try again later')
            })
        }
    })
}

User.all = function() {
    return new Promise((resolve, reject) => {
        teachersDataCollection.find({}).toArray(function(err, teachers) {
            if (teachers) {
                resolve(teachers)
            } else {
                reject('We cannont find any Teacher')
            }
        })
    })
}

User.reset = function(email) {
    return new Promise(async (resolve, reject) => {
        if (email == '') reject('Email field cannot be empty')

        if (!validator.isEmail(email) || typeof(email) != 'string') {
            reject()
            return
        }

        let adminexits = await adminCollection.findOne({email: email})

        if (adminexits) {
            adminexits = {
                email: adminexits.email
            }
            resolve(adminexits)
        } else {
            reject('Your email did not match any record')
        }
        
    })
}

module.exports = User