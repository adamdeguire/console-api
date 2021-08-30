const router = require('express').Router()
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')
const Log = require('../models/log')

router.post('/logs/:logId/comments/', requireToken, (req, res, next) => {
  req.body.comment.owner = req.user.id
  Log.findById(req.params.logId)
    .then(log => {
      log.comments.push(req.body.comment)
      return log.save()
    })
    .then(() => res.json({ comment: req.body.comment }))
    .catch(next)
})

router.patch('/logs/:logId/comments', requireToken, removeBlanks, (req, res, next) => {
    req.body.comment.owner = req.user.id
    Log.findById(req.params.logId)
      .then(log => {
        const index = log.comments.findIndex(
          comment => comment._id === req.body.comment._id
        )
        log.comments.splice(index, 1, req.body.comment)
        return log.save()
      })
      .then(() => res.json({ comment: req.body.comment }))
      .catch(next)
  }
)

router.delete('/logs/:logId/comments', requireToken, removeBlanks, (req, res, next) => {
  Log.findById(req.params.logId)
    .then((log) => {
      const index = log.comments.findIndex(
        comment => comment._id === req.body.commentId
      )
      log.comments.splice(index, 1)
      return log.save()
    })
    .then(() => res.json({ comment: req.body.comment }))
    .catch(next)
}
)

module.exports = router
