const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const { handle404, requireOwnership } = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')
const Log = require('../models/log')

router.get('/home', requireToken, (req, res, next) => {
  Log.find()
    .populate('owner')
		.then(logs => logs.map((log) => log.toObject()))
		.then(logs => res.status(200).json({ logs: logs }))
		.catch(next)
})

router.get('/logs/:id', requireToken, (req, res, next) => {
  Log.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    .then(log => res.status(200).json({ log: log.toObject() }))
    .catch(next)
})

router.post('/logs', requireToken, (req, res, next) => {
  req.body.log.owner = req.user.id

  Log.create(req.body.log)
    .then(log => res.status(201).json({ log: log.toObject() }))
    .catch(next)
})

router.patch('/logs/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.log.owner

  Log.findById(req.params.id)
    .then(handle404)
    .then(log => {
      requireOwnership(req, log)
      return log.updateOne(req.body.log)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/logs/:id', requireToken, (req, res, next) => {
  Log.findById(req.params.id)
    .then(handle404)
    .then(log => {
      requireOwnership(req, log)
      log.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
