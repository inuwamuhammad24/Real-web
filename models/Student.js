const studentCollection = require('../db').db().collection('students')
const ObjectID = require('mongodb').ObjectID

function Student (data) {
    this.data = data
    this.errors = []
}

Student.prototype.validate = function() {
    if (this.data.firstName == '') this.errors.push('First name field cannot be empty')
    if (this.data.lastName == '') this.errors.push('last name field cannot be empty')
    if (this.data.DoB == '') this.errors.push('Date of Birth field cannot be empty')
    if (this.data.class == 'SELECT A CLASS') this.errors.push('You must select a class')
    if (this.data.record == '') this.errors.push('Students record cannot be empty')
    // if (this.data.class.toUpperCase() != req.session.user.class) this.errors.push('Student class mismatch')
}

Student.prototype.cleanUp = function() {
    if (typeof(this.data.firstName) != 'string') this.data.firstName = ''
    if (typeof(this.data.lastName) != 'string') this.data.lastName = ''
    if (typeof(this.data.DoB) != 'string') this.data.DoB = ''
    if (typeof(this.data.record) != 'string') this.data.record = ''
    if (typeof(this.data.class) != 'string') this.data.class = ''

    this.data = {
        firstName: this.data.firstName.trim().toUpperCase(),
        lastName: this.data.lastName.trim().toUpperCase(),
        DoB: this.data.DoB,
        record: this.data.record.trim(),
        class: this.data.class.toUpperCase()
    }
}

Student.studentCount = function() {
    return new Promise(async (resolve, reject) => {
        let studentcount = await studentCollection.countDocuments()
        resolve(studentcount)
    })
}

Student.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            console.log(this.data)
            studentCollection.insertOne(this.data).then(() => {
                resolve()
            }).catch(() => {
                reject('Please try again later')
            })
        } else {
            reject(this.errors)
        }
    })
}

Student.viewAll = function(teacherData) {
    return new Promise((resolve, reject) => {
        studentCollection.find({class: teacherData.cls}).toArray(function(err, student) {
            if (student) {
                resolve(student)
            } else {
                reject('Please try again later')
            }
        })
    })
}

Student.ifStudentExist = function(studentId) {
    return new Promise(async (resolve, reject) => {
        if (typeof(studentId) != 'string' || !ObjectID.isValid(studentId)) {
            reject()
            return
        } else {
            studentCollection.findOne({_id: new ObjectID(studentId)}).then((std) => {
                if (std) {
                    resolve(std)
                } else {
                    reject('We cannot find that student')
                }
            }).catch((err) => {
                reject('Please try again later')
            })
        }
    })
}

Student.all = function() {
    return new Promise((resolve, reject) => {
        studentCollection.find({}).toArray(function(err, students) {
            if (students) {
                resolve(students)
            } else {
                reject('We cannont find any student')
            }
        })
    })
}


Student.delete = function(studentId) {
    return new Promise((resolve, reject) => {
        if (typeof(studentId) != 'string' || !ObjectID.isValid(studentId)) {
            reject() 
            return
        }

        studentCollection.findOneAndDelete({_id: ObjectID(studentId)}).then(() => {
            resolve()
        }).catch(() => {
            reject('Please try again later')
        })
    })
}

Student.edit = function(studentId) {
    return new Promise(async (resolve, reject) => {
        if (typeof(studentId) != 'string' || !ObjectID.isValid(studentId)) {
            reject() 
            return
        }
            //await studentCollection.findOneAndUpdate({_id: ObjectID(studentId)}, {$set: {firstName: this.data.firstName, lastName: this.data.lastName, DoB: this.data.DoB, record: this.data.record}})
            resolve(studentId)
    })
}

module.exports = Student