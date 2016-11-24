/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.d3683cb6-6e79-4df5-8f21-d5e5d51e2d92"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

log("Marker 1", "Before declaration of AWS");
var AWS = require('aws-sdk');

/**
 * BBQSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var BBQSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BBQSkill.prototype = Object.create(AlexaSkill.prototype);
BBQSkill.prototype.constructor = BBQSkill;

BBQSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("BBQSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

BBQSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("BBQSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the BBQ. You can control temperature, alarms, and the fan. Ask for further help on these topics.";
    var repromptText = "You can control temperature, alarms and the fan.";
    response.ask(speechOutput, repromptText);
};

BBQSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("BBQSkill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

BBQSkill.prototype.intentHandlers = {
    // register custom intent handlers
    "getTemperatureIntent": function (intent, session, response) {



        log("Marker 2", "Before declaration of iodata");
        var iotData = new AWS.IotData({endpoint: "a3riiqm5a27d7f.iot.us-east-1.amazonaws.com"});
        log("Marker 3", "After declaration of AWS");

        log("Inbound getTemperatureIntent Intent", intent);
        log("Inbound getTemperatureIntent Session", session);

        /* validate that we know what component we are getting the temperature for
        * should be one of...
        *   Barbecue or BBQ
        *   Timer
        *   Lower Level
        *   Upper Level
        *   Lower Alarm Temperature
        *   Upper Alarm Temperature
        *   Fan
        */

        var str = intent.slots.Component.value;

        log('Component', str);

        switch(str.toUpperCase()) {
            case 'BARBECUE':
            case 'BBQ':

                //need to figure out how to send a message to the bbq and get the response back

                // some help https://forums.aws.amazon.com/message.jspa?messageID=699922
                // shows the response pattern... https://developer.amazon.com/public/community/post/Tx3828JHC7O9GZ9/Using-Alexa-Skills-Kit-and-AWS-IoT-to-Voice-Control-Connected-Devices

                // seems like we need to publish the message and if sucessful, listen for the response and put the 
                // response to alexa in the response callback. we may need a response function here. 

/*                {
                    "state": {
                        "desired": {
                            "attribute1": integer2,
                            "attribute2": "string2",
                            ...
                            "attributeN": boolean2
                        },
                        "reported": {
                            "attribute1": integer1,
                            "attribute2": "string1",
                            ...
                            "attributeN": boolean1
                        }
                    }
                    "clientToken": "token",
                    "version": version
                }

*/
                    //Update Device Shadow


                var params = {

                    "thingName" : "First-BBQ-Contoller"

                };

                iotData.getThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                        }
                        else {
                            log("Data back from shadow", data);
                            
                            log("payload", data.payload);
                            var objState = JSON.parse(data.payload);
                            log("objState", objState);
                            var responseStr = "The temperature of the " + str +  " is " + objState.state.reported.bbq + " degrees.";
                            response.tellWithCard(responseStr,"Get a temperature", responseStr); 
                        }
                    }
                );

                break;
            case 'LOWER LEVEL':

                response.tellWithCard("Getting the lower level temperature!", "Get a temperature", "Getting the lower level temperature!");
                
                break;
            case 'UPPER LEVEL':
                response.tellWithCard("Getting the lower level temperature!", "Get a temperature", "Getting the lower level temperature!");                
                break;

            case 'LOWER ALARM':
                response.tellWithCard("Getting the lower alarm temperature!", "Get a temperature", "Getting the lower alarm temperature!");
                break;

            case 'UPPER ALARM':
                response.tellWithCard("Getting the upper alarm temperature!", "Get a temperature", "Getting the upper alarm temperature!");
                break;


            default:
                response.tellWithCard("I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!", "Get a temperature", "I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!");
                
        }
    },
    "setTemperatureIntent": function (intent, session, response) {

        log("Inbound setTemperatureIntent Intent", intent);
        log("Inbound setTemperatureIntent Session", session);


        response.tellWithCard("Got set temperature!", "Got set temperature", "Got set temperature!");
    },


    "AMAZON.HelpIntent": function (intent, session, response) {
//        response.ask("You can control temperature, alarms, and the fan. For more help, ask for help on one of these topics.");
    
          response.ask("You can control temperature, alarms and the fan. For more help, ask for help on one of these topics.");  
    }
};

/**
 * Utility functions.
 */
function log(title, msg) {
    console.log('*************** ' + title + ' *************');
    console.log(msg);
    console.log('*************** ' + title + ' End*************');
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var bbqSkill = new BBQSkill();
    bbqSkill.execute(event, context);
};


