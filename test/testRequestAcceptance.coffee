assert = require 'assert'
request = require 'request'
async = require 'async'
test = require '../testUtils'

testRequestParams =
  description     : "Example request for advice"
  advisors        : ["dmoranj"]
  hobbieTags      : ["cooking", "jogging", "stamps", "tubophonist"]
  age             : 56
  profession      : "Computer geek"

creationOptions =
  url:    "http://localhost:3000/users/godzilla/requests",
  method: "POST",
  json:   testRequestParams

optionsList =
  url:    "http://localhost:3000/users/godzilla/requests",
  method: "GET",
  json:   {}

baseUrlDelete = "http://localhost:3000/users/godzilla/requests/";
optionsDelete =
  method: "DELETE",
  json: {}

# Feature descriptions
#---------------------------------------------------------------------------------
describe 'Requests', ->
  receivedGUID = "ooo"

  before (done) ->
    if test.opts.launchApp
      app = require "../app.js"

    request test.loginOptions, (error, response, body) ->
      done()

  describe 'Creation', ->
    it 'should persist the request in the db', (done) ->
      request creationOptions, (error, response, body) ->
        assert.equal body.status,  "OK"
        done()

    it 'should create a unique GUID for the request (and return it)', (done) ->
      request creationOptions, (error, response, body) ->
        assert.equal (body.guid != undefined),  true
        receivedGUID = body.guid
        done()

  describe 'List', ->
    before (done) ->
      creationOptions.url = "http://localhost:3000/users/gamera/requests"
      request creationOptions, (error, response, body) ->
        assert.equal body.status,  "OK"
        done()

    it 'should retrieve the list of request of the given user (and only theirs)', (done) ->

      request optionsList, (error, response, body) ->
        assert.equal body.requests.length,  2
        assert.equal body.requests[0].age, 56
        done()

  describe 'Find', ->
    baseUrl = "http://localhost:3000/users/godzilla/requests/"
    options =
      method: "GET",
      json: {}

    it 'should recover fields from the db', (done) ->
      options.url = baseUrl + receivedGUID

      request options, (error, response, body) ->
        assert.equal body.description,  "Example request for advice"
        assert.equal body.profession, "Computer geek"
        assert.equal body.age, 56
        done()

    it 'should raise an error if the request is not found', (done) ->
      options.url = baseUrl + "OPQOPQOPQ"

      request options, (error, response, body) ->
        assert.equal body.status,  "ERROR"
        done()


  describe 'Delete', ->
    it 'should remove the request from the db', (done) ->
      optionsDelete.url = baseUrlDelete + receivedGUID

      request optionsDelete, (error, response, body) ->
        assert.equal body.status,  "OK"

        request optionsList, (error, response, body) ->
          assert.equal body.requests.length,  1
          done()

    it 'should only allow the requestor to remove its requests '


  after (done) ->
    deleteFn = (req, callback) ->
      optionsDelete.url = baseUrlDelete.replace("godzilla", req.requester) + req.guid
      request optionsDelete, (error, response, body) ->
        assert.equal body.status, "OK"
        callback(null, "OK")

    deleteListFn = (name, callback) ->
      optionsList.url = optionsList.url.replace("godzilla", name)
      request optionsList, (error, response, body) ->
        async.map body.requests, deleteFn, callback

    async.map ["godzilla", "gamera"], deleteListFn, (entity, callback) ->
      done()
