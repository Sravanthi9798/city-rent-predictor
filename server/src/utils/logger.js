const fs = require("fs");
const path = require("path");

// Create logs folder path
const logDir = path.join(__dirname, "../logs");

// Create logs folder if not exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, "error.log");

const logger = (req, err) => {
  const logMessage = `
${new Date().toISOString()}
URL: ${req.originalUrl}
METHOD: ${req.method}
MESSAGE: ${err.message}
STACK: ${err.stack}
--------------------------------------------------
`;

  fs.appendFile(logFilePath, logMessage, (error) => {
    if (error) {
      console.error("Failed to write log:", error);
    }
  });
};

module.exports = logger;