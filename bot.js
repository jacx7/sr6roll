var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

// User input filtering
// -------
// todo

// BOT calculatioons 
// BOT roll number of dice
function rollDice(dice, edg=0) {
    rolls = []
    for (i=0;i<dice;i++){
        let roll = Math.floor(Math.random() * 6) + 1;
        rolls.push(roll);
    };
    return rolls.sort(function(a, b){return b-a});
};


// BOT check for number of successes
function checkSuccess(rolls) {
    var successCounter = 0;
    
    rolls.forEach(function(entry){
        if (entry >=5){
            successCounter = successCounter+1;
        }
    });
    return successCounter;
};
// BOT check for glitch
function checkGlitch(rolls) {
    var glitchCounter = 0;
    rolls.forEach(function(entry){
        if (entry < 2){
            glitchCounter = glitchCounter+1;
        }
    });
    return glitchCounter;
};



// generate Bot Calculation Message
function successAnswer(rolls){
    successCounter = checkSuccess(rolls);
    if (successCounter > 1) {
        return successCounter + " Hits";
    } else if (successCounter === 0){
        return successCounter + " Hits";
    } else {
        return successCounter + " Hit";
    };
}
function glitchAnswer(rolls){
    successCounter = checkSuccess(rolls);
    if (rolls.length/2 < checkGlitch(rolls)) {
        if (successCounter > 0){
            return "; GLITCH occured!";
        } else {
            return "; CRITICAL GLITCH occured!";
        }
    } 
    else { 
        return "";
    };
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `+`
    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
        args = args.splice(1);
        
        var case_check = 0;
        

        // filtering
        try{
            if (cmd === Number(cmd).toString()){
                var dice = Number(cmd);
                case_check = "normal";
            }
        }
        catch(err) {
            case_check = 0;
        }

        

        // roll dice, put result in an array
        var rolls = rollDice(dice);

        switch(case_check) {
            // !ping
            case 0:
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case "normal":
                var output = user + " rolls: " + successAnswer(rolls) + glitchAnswer(rolls) + " ("  + rolls.toString() + ") " ; 

                bot.sendMessage({
                    to: channelID,
                    message: output
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});