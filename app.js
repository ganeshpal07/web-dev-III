// const cities = require('./data/data.js');
// console.log(cities);

// const fs = require('fs');

// fs.writeFileSync("test.txt", "Hello World");
// const data = fs.readFileSync("test.txt", "utf-8");
// console.log(data);

// const path = require('path');
// const filePath = path.join(__dirname, 'data', 'data.js');
// console.log(filePath);

//why path? - 

// const os = require('os');
// const userInfo = os.userInfo();
// const freeMemory = os.freemem();
// const totalMemory = os.totalmem();
// const uptime = os.uptime();

// console.log("User Info:", userInfo);
// console.log("Free Memory:", freeMemory);
// console.log("Total Memory:", totalMemory);
// console.log("Uptime:", uptime);

// const chalk = require('chalk'); // not this, change type to module in package.json
// import chalk from 'chalk';
// console.log(chalk.blue('Hello world!'));
// console.log(chalk.red('This is an error message.'));
// console.log(chalk.green('This is a success message.'));
// console.log(chalk.yellow('This is a warning message.'));
// console.log(chalk.bold('This is bold text.'));

require("dotenv").config();
const process = require("process");
const name = process.argv[2];
console.log(process.argv[2]);

console.log(process.env.PORT)