const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const { BadParamsError, BadCredentialsError } = require('../../lib/custom_errors')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10
const User = require('../models/user')

router.get('/users', (req, res, next) => {
  User.find()
    .then(users => {
      const query = req.query.users
      return users.filter(user => user.username.includes(query))
  })
  .then(results => {
    res.status(200).json({ results });
  })
  .catch(next)
})

router.post('/sign-up', (req, res, next) => {
  Promise.resolve(req.body.credentials)
    .then(credentials => {
      if (!credentials ||
          !credentials.password ||
          credentials.password !== credentials.password_confirmation) {
        throw new BadParamsError()
      }
    })
    .then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
    .then(hash => {
      return {
        username: req.body.credentials.username,
        email: req.body.credentials.email,
        hashedPassword: hash
      }
    })
    .then(user => User.create(user))
    .then(user => res.status(201).json({ user: user.toObject() }))
    .catch(next)
})

router.post('/sign-in', (req, res, next) => {
  const pw = req.body.credentials.password
  let user

  User.findOne({ email: req.body.credentials.email })
    .then(record => {
      if (!record) throw new BadCredentialsError()
      user = record
      return bcrypt.compare(pw, user.hashedPassword)
    })
    .then(correctPassword => {
      if (correctPassword) {
        const token = crypto.randomBytes(16).toString('hex')
        user.token = token
        return user.save()
      } else {
        throw new BadCredentialsError()
      }
    })
    .then(user => {
      res.status(201).json({ user: user.toObject() })
    })
    .catch(next)
})

router.patch('/change-password', requireToken, (req, res, next) => {
  let user
  User.findById(req.user.id)
    .then(record => { user = record })
    .then(() => bcrypt.compare(req.body.passwords.old, user.hashedPassword))
    .then(correctPassword => {
      if (!req.body.passwords.new || !correctPassword) throw new BadParamsError()
    })
    .then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
    .then(hash => {
      user.hashedPassword = hash
      return user.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/sign-out', requireToken, (req, res, next) => {
  req.user.token = null
  req.user.save()
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
