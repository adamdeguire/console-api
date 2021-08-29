'use strict'

// creating a base name for the mongodb
const mongooseBaseName = 'socialcluster'

// create the mongodb uri for development and test
const database = {
  development: `mongodb+srv://admin:hyaudCDKzCFJvF4d@console.nwpp4.mongodb.net/${mongooseBaseName}-development?retryWrites=true&w=majority`,
  test: `mongodb+srv://admin:hyaudCDKzCFJvF4d@console.nwpp4.mongodb.net/${mongooseBaseName}?retryWrites=true&w=majority`
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable DB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.DB_URI || localDb

module.exports = currentDb
