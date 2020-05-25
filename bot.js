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

var currChannelID = null; // this changes as soon as it is called from another channel

bot.on('message', function (user, userID, channelID, message, evt) {
    currChannelID = channelID;
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        // console.log(args);
        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'play':
                messageFunction('reevaluating purpose in life');
            break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Roses are red, violets are blue\n\I\'m dysfunctional, and so are you'
                });
            break;
            // Just add any case commands if you want to..
            case 'testInput': // start splicing members until you run out, where you send error
                if (args.length < 2) messageFunction('You must tag exactly two users to start game...');
                else messageFunction('New game between ' + args[0] + ' and ' + args[1] + ' started!');
                // shed spaces from both sides
                // check if both @s are valid and instantiate game
            break;

            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'Command not found! Type !help for more info'
                });
            break;
         }
     }
});

// Actual game stuff

var currentGames = []


function valid_player() {

}

function messageFunction(messageString) {
    bot.sendMessage({
        to: currChannelID,
        message: messageString
    });
}
