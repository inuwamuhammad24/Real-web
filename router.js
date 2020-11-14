const express = require('express')
const { route } = require('./app')
const router = express.Router()
const studentController = require('./controllers/studentController')
const templateController = require('./controllers/templateController')
const emailController = require('./controllers/emailController')
const applicationController = require('./controllers/applicationController')


router.get('/', templateController.home)
router.get('/about', templateController.about)
router.get('/contact', templateController.contact)
router.get('/login', templateController.loginGet)
router.get('/viewAll', studentController.viewAll)
router.get('/view/:id', studentController.ifStudentExist)
router.get('/admin', templateController.adminGet)
router.get('/application', templateController.apply)
router.get('/students', studentController.allStudent)
router.get('/teachers', templateController.allTeachers)
router.get('/teacher/:id', templateController.ifTeacherExist)
router.get('/all_emails', emailController.allEmails)
router.get('/email/delete/:id', emailController.delete)
router.get('/logout', templateController.logout)
router.get('/delete/:id', studentController.delete)
router.get('/email/:id', emailController.view)
router.get('/reset', templateController.Passwordreset)
router.get('/application/view', applicationController.allApplications)
router.get('/app/:id', applicationController.viewSingleAdd)


router.post('/admin/reset', templateController.reset)
router.post('/edit/:id', studentController.edit)
router.post('/login', templateController.login)
router.post('/checkEmail', templateController.checkEmail)
router.post('/signup', templateController.signup)
router.post('/createStudent', studentController.create)
router.post('/admin', templateController.admin)
router.post('/email', emailController.send)
router.post('/submit_application', applicationController.submit)


module.exports = router

