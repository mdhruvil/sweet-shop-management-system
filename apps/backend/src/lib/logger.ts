import winston from "winston";

export const logger = winston.createLogger({
  level: "verbose",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
        winston.format.colorize({ all: true }),
      ),
    }),
  ],
});
