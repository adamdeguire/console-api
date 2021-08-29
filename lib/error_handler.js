module.exports = function (err, req, res, next) {
  if (!process.env.TESTENV) {
    console.log('\n', new Date().toTimeString() + ':')
    console.error(err)
  }

  switch (err.name) {
    case 'DocumentNotFoundError': err.status = 404
    case 'CastError': err.status = 422 
    case 'BadParamsError' : err.status = 422
    case 'BadCredentialsError' : err.status = 401
    default: {
      if (err.name.match(/Valid/) || err.name === 'MongoError') {
        const message = 'The received params failed a Mongoose validation'
        err = { status: 422, message }
      }
    }
  }

  res.status(err.status || 500).json(err)
}
