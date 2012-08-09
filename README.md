Presents Advice
===========


This project is the backend for a social application aimed to provide advice for the gifts you
may want to give to your relatives. The advice will come from two sources: the personal human
advice of your friends in the network, and the system-suggested gifts, calculated estatistically
from past suggestions for people with a similar profile.

The backend offers a Web Interface as well as a RESTful API, aimed to be consumed by the mobile
clients.

Installation
-------
Prerequisites:

* Node JS and the Node Package Manager (npm).
* A running instance of MongoDB. Currently, the application always connect to localhost in the
default port, with root without password.

In order to install the application follow these steps:

1. Download the code from github.
2. Install the dependencies with npm.

    npm install

3. Execute the app.js script with Node.

    node app.js

This should start the server in your localhost.
