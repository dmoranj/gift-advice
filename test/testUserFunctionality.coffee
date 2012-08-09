assert = require 'assert'
request = require 'request'

loginParams =
  login: "dmoranj"
  password: "pipopipopi"

authCookies = null

loginOptions =
  url:    "http://localhost:3000/users/login",
  method: "POST",
  json:   loginParams

testUserParams =
  name: "Daniel",
  surname: "Moran",
  nickname: "dmoranj",
  email: "dmoranj@gmail.com",
  password: "pipopipopi"

describe 'Users', ->
  before (done) ->
    app = require "../app.js"
    done()

  describe 'Creation', ->
    options =
      url:    "http://localhost:3000/users/register",
      method: "POST",
      json:   testUserParams

    it 'should persist user in DB correctly.', (done) ->
      request options, (error, response, body) ->
        assert.equal body.status,  "OK"
        done()

    it 'should raise an error if the same user is created twice', (done) ->
      request options, (error, response, body) ->
        assert.equal body.status,  "ERROR"
        done()

    it 'should raise an error if the user nickname or the password are empty', (done) ->
      testUserParams.nickname = ""
      request options, (error, response, body) ->
        assert.equal body.status,  "ERROR"
        done()

    after (done) ->
      request options, (error, response, body) ->
        authCookies = response.headers['set-cookie']

        deleteOptions =
          url:    "http://localhost:3000/users/dmoranj",
          method: "DELETE"
          json: {}
          headers:
            Cookie: authCookies

        request deleteOptions, (error, response, body) ->
          done()

  describe 'List', ->
    before (done) ->
      done()

    it 'should retrieve all the created users'

    after (done) ->
      done()

  describe 'Find', ->
    it 'should retrieve all the fields from the DB'

    it 'should return an error if user not found'

