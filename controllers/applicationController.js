const Application = require("../models/Application")

exports.allApplications = function(req, res) {
    if (req.session.admin) {
        Application.view().then((app) => {
            res.render('view_all_applications', {
                admin: req.session.admin,
                errors: req.flash('errrors'),
                success: req.flash('success'),
                app: app
            })
        }).catch((err) => {
            console.log(err)
        })
    } else {
        req.flash('errors', 'You are not allowed to view that page')
        req.session.save(() => res.redirect('/'))
    }
}

exports.viewSingleAdd = function(req, res) {
    if (req.session.admin) {
        Application.ifappExist(req.params.id).then((appDetail) => {
            res.render('view_single_application', {appDetail: appDetail})
        }).catch((err) => {
            req.flash('errors', err)
            req.session.save(() => res.redirect('/'))
        })
    } else {
        req.flash('errors', 'You are not authorize to view that page')
        req.session.save(() => res.redirect('/'))
    }
}
exports.submit = function(req, res) {
    let application = new Application(req.body)
    application.submit().then(() => {
        console.log()
        res.send('application send')
    }).catch((err) => {
        res.send(err)
    })
}