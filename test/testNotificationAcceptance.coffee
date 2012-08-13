assert = require 'assert'
request = require 'request'
async = require 'async'
test = require '../testUtils'

testNotificationParams =
  type:     'MESSAGE',
  title:    'Hi there!',
  text:     'I said "Hi there", you fool!'

alternateNotificationParams =
  type:     'UPDATE',
  title:    'Your request has been updated',
  text:     'I said "Your request has been updated", you fool!'


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

    it 'should add the information of the sender and receiver for the message', (done) ->
      optionsGet =
        method: "GET",
        json:   {}

      optionsGet.url = "http://localhost:3000/users/godzilla/notifications/" + createdNotificationGUID
      request optionsGet, (error, response, body) ->
        assert.equal body.notification.receiver, "godzilla"
        assert.equal body.notification.sender, "dmoranj"
        done()

  describe 'List', ->
    options =
      url:    "http://localhost:3000/users/godzilla/notifications?last=2"
      method: "GET",
      json: {}

    before (done) ->
      optionsCreate =
        url:    "http://localhost:3000/users/godzilla/notifications"
        method: "POST"

      optionsCreate.json = testNotificationParams
      request optionsCreate, (error, response, body) ->
        assert.equal body.status, "OK"
        optionsCreate.json = alternateNotificationParams
        request optionsCreate, (error, response, body) ->
          assert.equal body.status, "OK"
          done()

    it 'should list the last 2 notifications of a user', (done) ->
      request options, (error, response, body) ->
        assert.equal body.notifications.length, 2
        assert.equal body.notifications[0].type, "UPDATE"
        assert.equal body.notifications[1].type, "MESSAGE"
        done()

  describe 'Find', ->

    options =
      method: "GET",
      json: {}

    it 'should retrieve the notification from the db', (done) ->
      options.url = "http://localhost:3000/users/godzilla/notifications/" + createdNotificationGUID
      request options, (error, response, body) ->
        assert.equal body.status, "OK"
        assert.equal body.notification.type, "MESSAGE"
        assert.equal body.notification.guid, createdNotificationGUID
        done()

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

