const Student = require('../models/Student')
const User = require('../models/User')

exports.create = function(req, res) {
    let student = new Student(req.body)
    student.create().then(() => {
        req.flash('success', 'New Student created successfully')
        req.session.save(function() {
            res.redirect('/login')
        })
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(() => res.redirect('/viewAll'))
    })
}

exports.viewAll = function(req, res) {
    if (req.session.user) {
        Student.viewAll(req.session.user).then((student) => {
            res.render('staff-login-view', {
                students: student,
                errors: req.flash('errors'),
                success: req.flash('success'), 
                teachersInfo: req.session.user
            })
        }).catch((err) => {
            res.send(err)
        })
    } else {
        req.flash('errors', 'Please login as a staff to view that page')
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.ifStudentExist = function(req, res) {
    Student.ifStudentExist(req.params.id).then((std) => {
        res.render('student', {std: std})
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(() => res.redirect('/viewAll'))
    })
}

exports.allStudent = function(req, res) {
    if (req.session.admin) {
        Student.all().then((students) => {
            res.render('allStudent', {students: students, admin: req.session.admin})
        }).catch((err) => {
            res.send(err)
        })
    }
}


exports.delete = function(req, res) {
    if (req.session.user) {
        Student.delete(req.params.id).then(() => {
            req.flash('success', 'Student removed successfully ')
            req.session.save(() => res.redirect('/viewAll'))
        }).catch(() => {
            req.flash('errors', err)
            req.session.save(() => res.redirect('/viewAll'))
        })
    } else {
        req.flash('errors', 'You do not have permission to perform that action')
        req.session.save(() => res.redirect('/'))
    }
}

exports.edit = function(req, res) {
    if (req.session.admin || req.session.user) {
        Student.edit(req.params.id).then((data) => {
            res.json(data)
            // req.flash('success', 'Edit successfull')
            // req.session.save(() => res.redirect('/viewAll'))
        }).catch((e) => {
            res.json(e)
            // req.flash('errors', err)
            // req.session.save(() => res.redirect('/viewAll'))
        })
    } else {
        res.json('You do not have permission to perform that action')
        // req.flash('errors', 'You do not have permission to perform that action')
        // req.session.save(() => res.redirect('/'))
    }
}
