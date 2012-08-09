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

describe 'Requests', ->
  receivedGUID = "ooo"

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
        console.log("GUID:" + body.guid)
        receivedGUID = body.guid
        done()


  describe 'List', ->
    it 'should retrieve the list of request for the given user'

    it 'should not retrieve the request of the other users'

  describe 'Find', ->
    options =
      url:    "http://localhost:3000/requests/",
      method: "GET",
      json: {}

    it 'should recover fields from the db', (done) ->
      options.url += receivedGUID

      request options, (error, response, body) ->
        assert.equal body.description,  "Example advice"
        assert.equal body.profession, "Computer geek"
        assert.equal body.age, 56
        done()

    it 'should raise an error if the request is not found'

  describe 'Delete', ->
    it 'should remove the request from the db'