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


testRequestParams =
  description     : "Example advice"
  advisors        : ["dmoranj"]
  hobbieTags      : ["cooking", "jogging", "stamps", "tubophonist"]
  age             : 56
  profession      : "Computer geek"
  guid            : "1234EFD"

describe 'Requests', ->
  before (done) ->
    app = require "../app.js"

    request loginOptions, (error, response, body) ->
      authCookies = response.headers['set-cookie']
      done()

  describe 'Creation', ->
    options =
      url:    "http://localhost:3000/requests",
      method: "POST",
      json:   testRequestParams

    it 'should persist the request in the db', (done) ->
      request options, (error, response, body) ->
        assert.equal body.status,  "OK"
        done()

    it 'should create a unique GUID for the request (and return it)', (done) ->
      request options, (error, response, body) ->
        assert.equal (body.guid != undefined),  true
        done()


  describe 'List', ->
    it 'should retrieve the list of request for the given user'

    it 'should not retrieve the request of the other users'

  describe 'Find', ->
    it 'should recover all the fields from the db'

    it 'should raise an error if the request is not found'

  describe 'Delete', ->
    it 'shoul remove the request from the db'
