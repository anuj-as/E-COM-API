import fs from 'fs';
import winston from 'winston';

const fsPromise = fs.promises;

// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()} - ${logData}`;
//     await fsPromise.appendFile('log.txt', logData);

//   } catch (err) {
//     console.log(err);
//   }
// }

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'request-logging' },
  transports: [
    new winston.transports.File({ filename: "log.txt" })
  ]
})

const loggerMiddlware =  (req, res, next) => {//make asyn while using with await
  //Log request body;
  if (!req.url.includes('signin')) {
    const logData = `\n${req.url} - ${JSON.stringify(req.body)}`
    // await log(logData);
    logger.info(logData);
  }
  next();
}
export default loggerMiddlware;