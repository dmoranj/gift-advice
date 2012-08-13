assert = require 'assert'
request = require 'request'
async = require 'async'
test = require '../testUtils'

testRequestParams =
  description: "Example request for advice"
  advisors: ["dmoranj"]
  hobbieTags: ["cooking", "jogging", "stamps", "tubophonist"]
  age: 56
  profession: "Computer geek"

testRequestParams2 =
  description: "Another request for advice"
  advisors: ["gamera"]
  hobbieTags: ["destroying tokyo", "protecting tokyo from being destroyed"]
  age: 56
  profession: "B-Movie monster"

testAdviceParams =
  title: "Cookies"
  text: "You should always buy cookies",
  urls: ["www.google.com", "www.cookie.com"],
  usefulnes: 4

otherAdviceParams =
  title: "Ties"
  text: "Another boring tie is allways wellcome",
  urls: ["www.tie-shop.com"],
  usefulnes: 1

optionsList =
  url: "http://localhost:3000/users/godzilla/requests",
  method: "GET",
  json:
    {}

baseUrlDelete = "http://localhost:3000/users/godzilla/requests/"

optionsDelete =
  method: "DELETE",
  json:
    {}

# Feature descriptions
#---------------------------------------------------------------------------------
describe "Advices", ->
  mainRequestGUID = ""
  forbiddenRequestGUID = ""
  createdAdviceGUID = ""

  before (done) ->
    if test.opts.launchApp
      app = require "../app.js"

    test.createUsers ->
      request test.loginOptions, (error, response, body) ->
        optionsCreateRequest =
          url: "http://localhost:3000/users/godzilla/requests",
          method: "POST",
          json: testRequestParams

        request optionsCreateRequest, (error, response, body) ->
          mainRequestGUID = body.guid
          optionsCreateRequest.json = testRequestParams2
          request optionsCreateRequest, (error, response, body) ->
            forbiddenRequestGUID = body.guid
            done()

  describe "Creation", ->
    it 'should create advices related to a gift request', (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + mainRequestGUID + "/advices"
        method: "POST",
        json: testAdviceParams

      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        assert.equal (body.guid != undefined), true
        createdAdviceGUID = body.guid
        done()

    it 'should not allow non-advisors to create advice', (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + forbiddenRequestGUID + "/advices"
        method: "POST",
        json: testAdviceParams

      request options, (error, response, body) ->
        assert.equal body.status, "ERROR"
        done()

    it 'should notify the requester that he has a new advice'

  describe "List", ->
    alternateAdviceGUID = ""

    before (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + forbiddenRequestGUID + "/advices"
        method: "POST",
        json: otherAdviceParams

      request test.alternateLoginOptions, (error, response, body) ->
        request options, (error, response, body) ->
          assert.equal body.status, "OK"
          alternateAdviceGUID = body.guid
          request test.loginOptions, (error, response, body) ->
            done()

    it 'should list all the advices provided by a user', (done) ->
      options =
        url: "http://localhost:3000/users/dmoranj/advices/"
        method: "GET",
        json:
          {}

      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        assert.equal body.advices.length, 1
        done()

    it 'should list all the advices related to a request', (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + forbiddenRequestGUID + "/advices"
        method: "GET",
        json:
          {}

      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        assert.equal body.advices.length, 1
        done()

    after (done) ->
      options =
        url: "http://localhost:3000/users/gamera/requests/" + forbiddenRequestGUID + "/advices/" + alternateAdviceGUID
        method: "DELETE",
        json:
          {}

      request test.alternateLoginOptions, (error, response, body) ->
        request options, (error, response, body) ->
          assert.equal body.status, "OK"
          done()


  describe 'Find', ->
    it 'should retrieve the advice information from the db given the GUID', (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + mainRequestGUID + "/advices/" + createdAdviceGUID
        method: "GET",
        json:
          {}

      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        assert.equal body.advice.title, "Cookies"
        assert.equal body.advice.urls.length, 2
        done()

    it 'should raise an error if the advice is not found', (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + mainRequestGUID + "/advices/" + "FAKEDGUID"
        method: "GET",
        json:
          {}

      request options, (error, response, body) ->
        assert.equal body.status, "ERROR"
        done()

  describe 'Delete', ->
    it 'should remove the selected advice from de DB', (done) ->
      options =
        url: "http://localhost:3000/users/godzilla/requests/" + forbiddenRequestGUID + "/advices/" + createdAdviceGUID
        method: "DELETE",
        json:
          {}

      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        done()

    it 'should allow to remove advices only to its advisor'

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
      test.deleteUsers ->
        done()
