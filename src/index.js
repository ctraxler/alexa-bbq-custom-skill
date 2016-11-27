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




        var iotData = new AWS.IotData({endpoint: "a3riiqm5a27d7f.iot.us-east-1.amazonaws.com"});


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


        var params = {

            "thingName" : "First-BBQ-Contoller"

        };

        var responseString;

        var payload = {};

        var objState = {};


        switch(str.toUpperCase()) {
            case 'BARBECUE':
            case 'BBQ':

                iotData.getThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            payload = data.payload;
                            log("Payload", payload);
                            objState = JSON.parse(payload);

                            if (objState.state.reported.bbq === undefined) {
                                responseString = "Could not find the temperature for the bbq"; 
                            } else {
                                responseString = "The temperature of the " + str + " is " + objState.state.reported.bbq + " degrees";
                            }
                            
                        }
                        response.tellWithCard(responseString, "Get a temperature", responseString);
                    }
                );

                break;

            case 'LOWER LEVEL':

               iotData.getThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload);
                            if (objState.state.reported.lower_level === undefined) {
                                responseString = "Could not find the temperature for the lower level"; 
                            } else {
                                responseString = "The temperature of the " + str + " is " + objState.state.reported.lower_level + " degrees";
                            }
                            
                        }
                        response.tellWithCard(responseString, "Get a temperature", responseString);
                    }
                );
                break;
            case 'UPPER LEVEL':

               iotData.getThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload); 
                            if (objState.state.reported.upper_level === undefined) {
                                responseString = "Could not find the temperature for the upper level"; 
                            } else {
                                responseString = "The temperature of the " + str + " is " + objState.state.reported.upper_level + " degrees";
                            }
                        }
                        response.tellWithCard(responseString, "Get a temperature", responseString);
                    }
                );
                break;

            case 'LOWER ALARM':

                          iotData.getThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload);
                            if (objState.state.reported.lower_alarm === undefined) {
                                responseString = "Could not find the temperature for the lower alarm setting"; 
                            } else {
                                responseString = "The temperature of the " + str + " is " + objState.state.reported.lower_alarm + " degrees";
                            }
                            
                        }
                        response.tellWithCard(responseString, "Get a temperature", responseString);
                    }
                );
                break;

            case 'UPPER ALARM':
               iotData.getThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload);  
                            if (objState.state.reported.upper_alarm === undefined) {
                                responseString = "Could not find the temperature for the upper alarm setting"; 
                            } else {
                                responseString = "The temperature of the " + str + " is " + objState.state.reported.upper_alarm + " degrees";
                            }                        
                        }
                        response.tellWithCard(responseString, "Get a temperature", responseString);
                    }
                );
                break;

            default:
                response.tellWithCard("I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!", "Get a temperature", "I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!");
                
        }
    },
    "setTemperatureIntent": function (intent, session, response) {


        /* validate that we know what component we are getting the temperature for
        * should be one of...
        *   Timer
        *   Lower Alarm Temperature
        *   Upper Alarm Temperature
        *   Fan
        */

        var str = '';
        var setValue; 

        if (intent.slots.Component.value === undefined) {

            // should update to ask further questions and the component and value to set
            response.tellWithCard("I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!", "Get a temperature", "I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!");

        } else {

            str = intent.slots.Component.value;
            log('Component', str);

        }

        if (intent.slots.Value.value === undefined) {
            response.tellWithCard("I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!", "Get a temperature", "I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!");

        } else {

            log("typeof value in the intent obj " + typeof(intent.slots.Value.value));

            setValue = Number(intent.slots.Value.value);

            log("typeof setValue " + typeof(setValue));

        }

        var params = {
            "thingName" : "First-BBQ-Contoller"
        };

        var payload;
        
        var iotData = new AWS.IotData({endpoint: "a3riiqm5a27d7f.iot.us-east-1.amazonaws.com"});
        

        switch(str.toUpperCase()) {

            case 'LOWER ALARM':
                
                params.payload = buildObjectState('desired', 'lower_alarm', setValue, 'string');

                log("params ", params);

 
                iotData.updateThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload);
                            responseString = "The " + str + " was set to  " + setValue + " degrees";
                            
                        }
                        response.tellWithCard(responseString, "Set a temperature", responseString);
                    }
                );
                break;
            case 'UPPER ALARM':


                params.payload = buildObjectState('desired', 'upper_alarm', setValue, 'string');

                log("payload", params.payload);

                log("params", params);

                iotData.updateThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload); 
                            log("Data post parse", objState);
                            responseString = "The " + str + " food temperature is " + setValue + " degrees";
                            
                        }
                        response.tellWithCard(responseString, "Set a temperature", responseString);
                    }
                );
                break;

            case 'TIMER':


                params.payload = buildObjectState('desired', 'timer', setValue, 'string');

                iotData.updateThingShadow(params, function(err, data) {
                        if (err){
                       //Handle the error here
                            console.log(err, err.stack);
                            responseString = "I had trouble getting the information for you from the controller";
                        }
                        else {
                            log("Data back from shadow", data);
                            objState = JSON.parse(data.payload);
                            responseString = "The " + str + " is set for " + setValue + "degrees";
                            
                        }
                        response.tellWithCard(responseString, "Get a temperature", responseString);
                    }
                );
                break;


            default:
                response.tellWithCard("I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!", "Get a temperature", "I did not understand that! You can get the bbq, lower level, upper level, lower alarm, and upper alarm temperatures!");
                
        }  
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


/**
*   Helper function to build the state object for the shadow document
**/

function buildObjectState (section, key, value, format) {

    var objState =  {state: {}};

    objState.state[section] = {};
    objState.state[section][key] = value;


    if (format === 'object') {
        return objState;
    } else if (format === 'string') {
        return JSON.stringify(objState);
    } else return; 

}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var bbqSkill = new BBQSkill();
    bbqSkill.execute(event, context);
};


