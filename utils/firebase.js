var FCM = require('fcm-node')
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey)


function sendNotificationTemp(reqBody) {
 
  var collapseKey = 'new_message';
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)        
    to: reqBody.registrationToken,
    notification: {
      title: reqBody.title,
      body: reqBody.message,
      tag: collapseKey,
      sound: true,
    },
    data: {  //you can send only notification or only data(or include both)            
      my_key: 'my value',
      my_another_key: 'my another value'
    }
  }

  console.log(message);

  return new Promise((resolve, reject) => {

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!")
        reject(err);
      } else {
        console.log("Successfully sent with response: ", response)
        resolve(response);
      }
    })
  })

}

function sendNotification(firebaseToken, title, message, imageUrl) {

  var collapseKey = 'new_message';
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)        
    to: firebaseToken,
    notification: {
      title: title,
      body: message,
      tag: collapseKey,
      sound: true,
      image: imageUrl // "https://grows.s3.ap-south-1.amazonaws.com/logos/growspace.jpg"
    },
    data: {  //you can send only notification or only data(or include both)            
      my_key: 'my value',
      my_another_key: 'my another value'
    }
  }

  console.log(message);

  return new Promise((resolve, reject) => {

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!")
        //reject(err);
      } else {
        console.log("Successfully sent with response: ", response)
        resolve(response);
      }
    })
  })

}

module.exports = { sendNotification, sendNotificationTemp }