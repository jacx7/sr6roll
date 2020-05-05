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

function checkInput(cmd){

    // standard = +123
    let re_standard = /\d+/;
    // pre_edge_roll = +123+7
    let re_preEdge = /\d+\+[0-7]/;

    try {
        var resolve_standard = re_standard.exec(cmd)[0];
        var resolve_preEdge = re_preEdge.test(cmd);
    } catch(err) {
        return case_check = 0;
    }

    if (resolve_standard === cmd){
        return case_check = "normal";
    } else if (resolve_preEdge === true) {
        try {
            resolve_preEdge = re_preEdge.exec(cmd)[0]
            return case_check = "pre";
        } catch(err) {
            return case_check = 0; 
        }
        
    } else {
        return case_check = 0;
    }
    
    /*try{
        if (cmd === Number(cmd).toString()){
            var dice = Number(cmd);
            return case_check = "normal";
        }
    }
    catch(err) {
        return case_check = 0;
    }*/
    
};


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



// generate Bot Success Message
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
// generate Bot Success Message
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


////////////////////////
// test for reactions insteal of message rolls
////////////////////////

const myDiscord = require('discord.js');
const client = new myDiscord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const cross = '❌';
/*module.exports.run = async (bot, message, args) => {*/
client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
        msg.react(cross);
}

/*client.on('messageReactionAdd', msg => {
    msg.react(cross);
})*/

    /*const reactions = msg.(reaction.emoji.name === cross);
    if (reactions.get(cross).count > 1) {
    msg.channel.send('Vote complete');
    }*/
  
});

module.exports.help = {
    name: "await"
}

client.login(auth.token);









bot.on('any', function (channelID, evt) {
    // body...
/*    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
        args = args.splice(1);
        
        var case_check = checkInput(cmd);
    var rolls = rollDice(cmd);
    var output = user + " rolls: " + successAnswer(rolls) + glitchAnswer(rolls) + " ("  + rolls.toString() + ") " ; 
*/
    bot.sendMessage({
        to: channelID,
        message: 'output'
    });
/*}*/

});


////////////////////////
// END TEST
////////////////////////


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `+`
    

    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        

        args = args.splice(1);
        
        var case_check = checkInput(cmd);
                
        switch(case_check) {
            case "normal":
                // roll dice, put result in an array
                var rolls = rollDice(cmd);
            break;
            case "pre":
                let re_preEdge = /\d+\+[0-7]/;
                let resolve_preEdge = re_preEdge.exec(cmd)[0]
                var subcmd = resolve_preEdge.split("+");
                
                let numOr0 = n => isNaN(n) ? 0 : n;
                subcmd = subcmd.reduce((a, b) => numOr0(Number(a)) + numOr0(Number(b)));

                logger.info(subcmd);
                var rolls = rollDice(subcmd);
            break;}


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
            case "pre":
                var output = user + " rolls pre EDGED: " + successAnswer(rolls) + glitchAnswer(rolls) + " ("  + rolls.toString() + ") " ; 

                bot.sendMessage({
                    to: channelID,
                    message: output
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});