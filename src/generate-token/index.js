var admin = require('firebase-admin');

var serviceAccount = require('./appointment-management-s-df6d3-firebase-adminsdk-t7vij-61913b1ec6.json')

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  });