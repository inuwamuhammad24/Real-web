const Email = require('../models/Email')
const User = require('../models/User')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRIDAPIKEY)

exports.send = function(req, res) {
    let email = new Email(req.body)
    email.send().then(() => {
        // sending a notification email to a user when successfully login using sendgrid
       sgMail.send({
        to: `${req.body.email.trim()}`, 
        from: 'inuwamuhammad24@gmail.com', // Change to your verified sender
        subject: 'Mail received',
        text: 'Thank you for sending us a mail',
        html:  `
            <h2>Thank you for sending us a mail</h2>
            <p>This is an automated email generated to let you Know that we have received you
               your mail. We would review your message and reverts to you if necessary. 
            </p>

            <p>Thank's for your patronage!</p>`
      }).then(() => console.log('Email send')).catch((err) => console.log(err)) 
        req.flash('success', 'Email send Successfully, we will revert to you as soon as possible, Thank You')
        req.session.save(() => res.redirect('/contact'))
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(() => res.redirect('/contact'))
    })
}

exports.allEmails = function(req, res) {
    if (req.session.admin) {
        Email.all().then((emails) => {
            res.render('allEmails', {
                emails: emails, 
                admin: req.session.admin,
                errors: req.flash('errros'),
                success: req.flash('success')
            })
        }).catch((err) => {
            req.flash('errors', err)
            req.session.save(() => res.redirect('/'))
        })
    } else {
        req.flash('errors', 'You do not have permission to view that page')
        req.session.save(() => res.redirect('/'))
    }
}

exports.delete = function(req, res) {
    if (req.session.admin || req.session.user) {
        Email.delete(req.params.id).then(() => {
            req.flash('success', 'Email deleted successfully ')
            req.session.save(() => res.redirect('/all_emails'))
        }).catch(() => {
            req.flash('errors', err)
            req.session.save(() => res.redirect('/all_emails'))
        })
    } else {
        req.flash('errors', 'You do not have permission to perform that action')
        req.session.save(() => res.redirect('/'))
    }
}