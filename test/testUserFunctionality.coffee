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

    request loginOptions, (error, response, body) ->
      authCookies = response.headers['set-cookie']
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

  describe 'List', ->
    options =
      url:    "http://localhost:3000/users",
      method: "GET"
      json: {}

    it 'should retrieve all the created users', (done) ->
      request options, (error, response, body) ->
        assert.equal body.status,  "OK"
        assert.equal body.users.length, 1
        assert.equal body.users[0].nickname, "dmoranj"
        done()

  describe 'Find', ->
    options =
      url:    "http://localhost:3000/users/dmoranj",
      method: "GET"
      headers:
        Accept: "application/json"

    it 'should retrieve all the fields from the DB'


    it 'should return an error if user not found'

    after (done) ->
      deleteOptions =
        url:    "http://localhost:3000/users/dmoranj",
        method: "DELETE"
        json: {}

      request deleteOptions, (error, response, body) ->
        done()
