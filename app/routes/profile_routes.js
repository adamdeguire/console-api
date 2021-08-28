const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Post = require('../models/post')
const User = require('../models/user')

router.get('/profile/:username', requireToken, (req, res, next) => {
  User.find({ 'username': req.params.username })
    .then(user => Post
      .find({ 'owner': user })
      .populate('owner'))
    .then(posts => {
      console.log(posts)
      return posts
    })
		.then(posts => posts.map(post => post.toObject()))
		.then(posts => res.status(200).json({ posts: posts }))
		.catch(next)
})

module.exports = router
