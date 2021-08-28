const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')
const Post = require('../models/post')

router.post('/posts/:postId/comments/', requireToken, (req, res, next) => {
  req.body.comment.owner = req.user.id
  Post.findById(req.params.postId)
    .then(post => {
      post.comments.push(req.body.comment)
      return post.save()
    })
    .then(() => res.json({ comment: req.body.comment }))
    .catch(next)
})

router.patch('/posts/:postId/comments', requireToken, removeBlanks, (req, res, next) => {
    req.body.comment.owner = req.user.id
    Post.findById(req.params.postId)
      .then(post => {
        const index = post.comments.findIndex(
          comment => comment._id === req.body.comment._id
        )
        post.comments.splice(index, 1, req.body.comment)
        return post.save()
      })
      .then(() => res.json({ comment: req.body.comment }))
      .catch(next)
  }
)

router.delete('/posts/:postId/comments', requireToken, removeBlanks, (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      const index = post.comments.findIndex(
        comment => comment._id === req.body.commentId
      )
      post.comments.splice(index, 1)
      return post.save()
    })
    .then(() => res.json({ comment: req.body.comment }))
    .catch(next)
}
)

module.exports = router
