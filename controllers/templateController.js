const Email = require('../models/Email')
const Student = require('../models/Student')
const { teacherCount } = require('../models/User')
const User = require('../models/User')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRIDAPIKEY)

// rendering the home page
exports.home = function (req, res) {
    res.render('home', {errors: req.flash('errors'), success: req.flash('success')}) 
}

// rendering the about page
exports.about = function(req, res) {
    res.render('about')
}

// rendering the contact page
exports.contact = function (req, res) {
    res.render('contact', {errors: req.flash('errors'), success: req.flash('success')})
}


// staff login function
exports.login = function(req, res) {
   // passing the user input to the User model for verification
   let user = new User(req.body)
   user.login().then(function(teachersInfo) {
    //    // sending a notification email to a user when successfully login using sendgrid
    //    sgMail.send({
    //     to: 'inuwamuhammad24@gmail.com', 
    //     from: 'inuwamuhammad24@gmail.com', // Change to your verified sender
    //     subject: 'Login Successful',
    //     text: 'You have just login to your account, thanks for login in',
    //     html:  `<h1>Hi, ${teachersInfo.firstName}</h1> <p>Your account has been logged in, Thanks</p>`,
    //   }).then(() => console.log('Email send')).catch((err) => console.log(err)) 
       req.session.user = {
           firstName: teachersInfo.firstName, 
           lastName: teachersInfo.lastName, 
           cls: teachersInfo.class,
           DoB: teachersInfo.DoB,
           phone: teachersInfo.phone,
           email: teachersInfo.email
        }
       req.session.save(function() {
           res.render('staff-login', {
               errors: req.flash('errors'), 
               success: req.flash('success'), 
               teachersInfo: req.session.user 
            })
       })
   }).catch(function(error) {
        req.flash('errors', error)
        req.session.save(function() {
            res.redirect('/')
        })
   })
}

exports.loginGet = function(req, res) {
    if (req.session.user) {
        res.render('staff-login', {
            errors: req.flash('errors'), 
            success: req.flash('success'), 
            teachersInfo: req.session.user
        })
    } else {
        req.flash('errors', 'You must login to view that page')
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

// rendering the sign up button for only teachers
exports.checkEmail = function (req, res) {
    let user = new User(req.body)
    user.checkEmail().then(() => {
        res.render('signupform')
    }).catch((error) => {
        req.flash('errors', error)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}


// submitting a teachers form
exports.signup = function(req, res) {
    let user = new User(req.body)
    user.submit().then(() => {
        req.flash('success', 'Account Created successfully, Please login to continue')
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch((error) => {
        req.flash('errors', error)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.admin = function (req, res) {
    let admin = new User(req.body)
    admin.adminLogin().then(async (admin) => {
        let teachersCount = User.teacherCount()
        let emailCount = Email.emailCount()
        let studentCount = Student.studentCount()

        let [tCount, eCount, sCount] = await Promise.all([teachersCount, emailCount, studentCount])
        console.log(tCount, eCount, sCount)
        req.session.admin = admin
        res.render('admin-login', {
            errors: req.flash('errors'), 
            success: req.flash('success'), 
            admin: req.session.admin,
            tCount: tCount,
            eCount: eCount,
            sCount: sCount
        })
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.adminGet = async function(req, res) {
    if (req.session.admin) {
        let teachersCount = User.teacherCount()
        let emailCount = Email.emailCount()
        let studentCount = Student.studentCount()

        let [tCount, eCount, sCount] = await Promise.all([teachersCount, emailCount, studentCount])
        res.render('admin-login', {
            errors: req.flash('errors'), 
            success: req.flash('success'), 
            admin: req.session.admin,
            tCount: tCount,
            eCount: eCount,
            sCount: sCount
        })
    } else {
        req.flash('errors', 'You must Login as an Administrator to view that page')
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.ifTeacherExist = function(req, res) {
    if (req.session.admin) {
        User.ifTeacherExist(req.params.id).then((teacher) => {
            res.render('teacher', {teacher: teacher})
        }).catch((err) => {
            req.flash('errors', err)
            req.session.save(() => res.redirect('/'))
        })
    } else {
        req.flash('errors', 'You are not allowed to perform that action')
        req.session.save(function() {
            res.redirect('/')
        })
    }
}


exports.allTeachers = function(req, res) {
    if (req.session.admin) {
        User.all().then((teachers) => {
            res.render('allTeachers', {teachers: teachers, admin: req.session.admin})
        }).catch((err) => {
            req.flash('errors', err)
            req.session.save(() => res.redirect('/'))
        })
    } else {
        req.flash('errors', 'You are not allowed to view that page!')
        req.session.save(() => res.redirect('/'))
    }
}

exports.logout = function(req, res) {
    if (req.session.user || req.session.admin) {
        req.session.destroy(() => {
            res.redirect('/')
        })
    } else {
        req.flash('errors', 'You must logged in before loging out')
        req.session.save(() => {
            res.redirect('/')
        })
    }
}

exports.apply = function(req, res) {
    res.render('app-form')
}




