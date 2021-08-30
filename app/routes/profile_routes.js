const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Log = require('../models/log')
const User = require('../models/user')

router.get('/profile/:username', requireToken, (req, res, next) => {
  User.find({ 'username': req.params.username })
    .then(user => Log
      .find({ 'owner': user })
      .populate('owner'))
    .then(logs => {
      console.log(logs)
      return logs
    })
		.then(logs => logs.map(log => log.toObject()))
		.then(logs => res.status(200).json({ logs: logs }))
		.catch(next)
})

module.exports = router
