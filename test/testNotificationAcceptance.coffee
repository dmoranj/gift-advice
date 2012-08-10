assert = require 'assert'
request = require 'request'
async = require 'async'
test = require '../testUtils'

testNotificationParams =
  type:     'MESSAGE',
  title:    'Hi there!',
  text:     'I said "Hi there", you fool!'

# Feature descriptions
#---------------------------------------------------------------------------------
describe 'Notifications', ->

  createdNotificationGUID = ""

  before (done) ->
    if test.opts.launchApp
      app = require "../app.js"

    request test.loginOptions, (error, response, body) ->
      done()

  describe 'Creation', ->
    options =
      url:    "http://localhost:3000/users/godzilla/notifications"
      method: "POST",
      json:   testNotificationParams

    it 'should create the notification for a given user', (done) ->
      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        assert.ok (body.timestamp != undefined), "Timestamp not found"
        assert.ok (body.guid != undefined), "GUID not found"
        createdNotificationGUID = body.guid
        done()

  describe 'List', ->

    it 'should list the last n notifications of a user'

  describe 'Find', ->

    it 'should retrieve the notification from the db'

  describe 'Delete', ->

    options =
      method: "DELETE",
      json:   {}

    it 'should remove the notification from the db', (done) ->
      options.url = "http://localhost:3000/users/godzilla/notifications/" + createdNotificationGUID
      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        done()

    it 'should allow to remove the notification only to the receiver'

