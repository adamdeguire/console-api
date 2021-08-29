const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const { handle404, requireOwnership } = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')
const Post = require('../models/post')

router.get('/home', requireToken, (req, res, next) => {
  Post.find()
    .populate('owner')
		.then(posts => posts.map((post) => post.toObject()))
		.then(posts => res.status(200).json({ posts: posts }))
		.catch(next)
})

router.get('/posts/:id', requireToken, (req, res, next) => {
  Post.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    .then(post => res.status(200).json({ post: post.toObject() }))
    .catch(next)
})

router.post('/posts', requireToken, (req, res, next) => {
  req.body.post.owner = req.user.id

  Post.create(req.body.post)
    .then(post => res.status(201).json({ post: post.toObject() }))
    .catch(next)
})

router.patch('/posts/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.post.owner

  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      requireOwnership(req, post)
      return post.updateOne(req.body.post)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/posts/:id', requireToken, (req, res, next) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      requireOwnership(req, post)
      post.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
