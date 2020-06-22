var Discord = require("discord.io");
var logger = require("winston");
// var auth = require('./auth.json'); // for offline access
let price = require("crypto-price");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

// Functional variables
const defaultTimerInterval = 3600 * 1000; // One hour
var timerInterval;
var intervalId;
var boundDiaryChannel;
var timerPaused;

// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.BOT_TOKEN,
  autorun: true,
});

bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
  timerPaused = false;
});

var currChannelID = null; // this changes as soon as it is called from another channel

bot.on("message", function (user, userID, channelID, message, evt) {
  currChannelID = channelID;
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == "!") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];

    // console.log(args);
    args = args.splice(1);

    switch (cmd) {
      // !ping
      case "play":
        messageFunction("reevaluating purpose in life");
        break;

      case "help":
        if (args.length < 1) {
          bot.sendMessage({
            to: channelID,
            message:
              "Roses are red, violets are blue\nI'm dysfunctional, and so are you",
          });
        } else {
          if (args[0] === "diary") {
            bot.sendMessage({
              to: channelID,
              message:
                "Possible commands:\nbinddiary\nchangeinterval\ntogglediary",
            });
          } else {
            bot.sendMessage({
              to: channelID,
              message: "Unknown help parameter",
            });
          }
        }
        args = args.splice(1);
        break;
      // Just add any case commands if you want to..
      case "testInput": // start splicing members until you run out, where you send error
        if (args.length < 2)
          messageFunction("You must tag exactly two users to start game...");
        else
          messageFunction(
            "New game between " + args[0] + " and " + args[1] + " started!"
          );
        args = args.splice(2);
        // shed spaces from both sides
        // check if both @s are valid and instantiate game
        break;

      case "crypto": // start splicing members until you run out, where you send error
        if (args.length < 2) messageFunction("Format: !crypto base crypto");
        else cryptoPrice(args[0], args[1]);
        args = args.splice(2);
        break;

      case "changeinterval":
        if (args.length < 1)
          messageFunction("Switching to default time (1 hr)");
        timerInterval = defaultTimerInterval;
        if (!isNaN(args[0])) {
          timerInterval = parseFloat(args[0]) * 1000;
          messageFunction("Switching to " + args[0] + " seconds");
        }
        clearInterval(intervalId);
        startInterval(timerInterval);
        args = args.splice(1);
        break;

      case "togglediary":
        timerPaused = !timerPaused;
        if (timerPaused) {
          messageFunction("Diary is now paused");
          clearInterval(intervalId);
        } else {
          messageFunction("Diary is now unpaused");
          startInterval(timerInterval);
        }
        break;

      case "binddiary":
        boundDiaryChannel = channelID;
        messageFunction("Diary assigned to this channel");
        break;

      ////////////////
      default:
        bot.sendMessage({
          to: channelID,
          message: "Command not found! Type !help for more info",
        });
        break;
    }
  }
});

function messageFunction(messageString) {
  bot.sendMessage({
    to: currChannelID,
    message: messageString,
  });
}

// delete this, only added for fun --> potential betting feature?
function cryptoPrice(base, crypto) {
  price
    .getCryptoPrice(base, crypto)
    .then((obj) => {
      // Base for ex - USD, Crypto for ex - ETH
      messageFunction("Current price is: " + obj.price);
    })
    .catch((err) => {
      console.log(err);
    });
}

function startInterval(_interval) {
  // Store the id of the interval so we can clear it later
  try {
    if (timerPaused) {
      bot.sendMessage({
        to: currChannelID,
        message: "Bot currently paused.",
      });
    } else if (boundDiaryChannel && _interval) {
      var currentTime = new Date();
      var timeStamp =
        currentTime.getHours() +
        ":" +
        currentTime.getMinutes() +
        " of " +
        currentTime.getDate() +
        "/" +
        currentTime.getMonth() +
        "/" +
        currentTime.getFullYear();

      intervalId = setInterval(function () {
        bot.sendMessage({
          to: boundDiaryChannel,
          message: "What have you achieved in the past hour as of " + timeStamp,
        });
      }, _interval);
    } else {
      bot.sendMessage({
        to: currChannelID,
        message: "No bound channel for diary",
      });
    }
  } catch (err) {
    console.log(
      "either diary channel doesn't exist, or somehting else went wrong"
    );
  }
}
