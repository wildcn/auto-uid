const chalk = require("chalk");

const ERROR = chalk.bold.red;
const SUCCESS = chalk.greenBright;
const INFO = chalk.bold.blue;
const WARNING = chalk.keyword("orange");

module.exports = {
  logSuc: (...args) => console.log(SUCCESS("[auto-uid]"), args.join(" ")),
  logErr: (...args) => console.log(ERROR("[auto-uid]"), args.join(" ")),
  logWar: (...args) => console.log(WARNING("[auto-uid]"), args.join(" ")),
  logInfo: (...args) => console.log(INFO("[auto-uid]"), args.join(" "))
};
