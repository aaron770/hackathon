const functions = require('firebase-functions');
var request = require("request");
const admin = require('firebase-admin');
admin.initializeApp();

//  https://hooks.slack.com/services/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
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  var d = new Date();
  var currentTime = d.getMilliseconds();
  // try {
  var timeIn = req.body.time;
  // } catch {
  //   var timeIn
  // }
  var timeAsked = timeIn === undefined | timeIn === null ? currentTime - 86300000 : req.body.time;
  // var timeAsked = currentTime - 86300000;
  var points = 0;
  var addOnText = ''
  if(currentTime - timeAsked < 3600000 ) { // in an hour
    points = 10;
    addOnText = ' Amazing you answered with an hour keep it up.';
  } else if(currentTime - timeAsked < 86400000 ) { //in a day
    points = 5;
    addOnText = ' Great work you answered within a day.';
  } else {
    points = 2;
  }
  // const points = req.body.text | Math.floor((Math.random() * 10) + 1);;
  var names = ['Michael', 'Jen Brogan', 'Xu', 'Aaron', 'Taylor', 'Alaina'];
  var randName = names[Math.floor(Math.random() * names.length)];
  var name = req.body.user_name === undefined || req.body.user_name === null || req.body.user_name === '' ? randName : req.body.user_name; // this needs to be figured out

  // const sanitizedMessage = sanitizer.sanitizeText(text); // Sanitize the message.
  //collection('cities').doc('LA').set(data);


return admin.firestore().collection('stallion').doc().set({
  name: name,
  points: points,
  text: addOnText
}).then(() => {
  console.log('New Message written', req);
  // Returning the sanitized message to the client.
  //return { text: sanitizedMessage };
  return res.send( {text: addOnText,
                    name: name,
                    points: points});
})

  
});


/* exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.redirect(303, snapshot.ref.toString());
    });
  }); */


  exports.notifyNewRecord = functions.firestore
    .document('stallion/{documentId}')
    .onCreate((snap, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'points': 66}
      const newValue = snap.data();

      // access a particular field as you would any JS property
      const name = newValue.name;
      const points = newValue.points;
      const text = newValue.text;

      // "https://hooks.slack.com/services/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"
// Xu bot  https://hooks.slack.com/services/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
    return  request.post(
      "https://hooks.slack.com/services/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",
      {json:{text: `${name} received ${points} points for an excepted answer. ${text}`}} 
    )
    // return rp({
    //   method: 'POST',
    //   // TODO: Configure the `slack.webhook_url` Google Cloud environment variables.
    //   uri: 'https://hooks.slack.com/services/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',
    //   body: {
    //     text: `<${user} received point for an excepted answer>.`,
    //   },
    //   json: true,
    // });
  });

/*   exports.modifyUser = functions.firestore
    .document('users/{userID}')
    .onWrite((change, context) => {
      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      const document = change.after.exists ? change.after.data() : null;

      // Get an object with the previous document value (for update or delete)
      const oldDocument = change.before.data();

      // perform desired operations ...
    }); */

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

