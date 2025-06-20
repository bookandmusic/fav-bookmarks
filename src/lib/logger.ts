// src/lib/logger.ts
import winston, { format, Logger, transports } from "winston";

export function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1";
}

function getCurrentTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", "");
}

const { combine, timestamp, printf } = format;
const { Console } = transports;

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

let loggerInstance: Logger | ConsoleLogger;

// 自定义简易 console logger 接口
interface ConsoleLogger {
  info(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  debug(message: string, metadata?: Record<string, unknown>): void;
}

// 封装 console 调用，避免 ESLint 报错
const safeConsole = {
  log: (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 禁止 ESLint 检查 console
    console.log(...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 禁止 ESLint 检查 console
    console.error(...args);
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 禁止 ESLint 检查 console
    console.warn(...args);
  },
  debug: (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 禁止 ESLint 检查 console
    console.debug(...args);
  },
};

// 根据环境创建 logger
if (isVercelEnvironment()) {
  // 在 Vercel 上仅使用控制台
  loggerInstance = {
    info: (message: string, metadata?: Record<string, unknown>) => {
      const time = getCurrentTimestamp();
      safeConsole.log(
        `%c${time} [INFO]: ${message}`,
        "color: #2196F3;",
        metadata || "",
      );
    },
    error: (message: string, metadata?: Record<string, unknown>) => {
      const time = getCurrentTimestamp();
      safeConsole.error(
        `%c${time} [ERROR]: ${message}`,
        "color: #f44336;",
        metadata || "",
      );
    },
    warn: (message: string, metadata?: Record<string, unknown>) => {
      const time = getCurrentTimestamp();
      safeConsole.warn(
        `%c${time} [WARN]: ${message}`,
        "color: #ff9800;",
        metadata || "",
      );
    },
    debug: (message: string, metadata?: Record<string, unknown>) => {
      const time = getCurrentTimestamp();
      safeConsole.debug(
        `%c${time} [DEBUG]: ${message}`,
        "color: #4CAF50;",
        metadata || "",
      );
    },
  };
} else {
  // 本地开发使用 winston 文件 + 控制台日志
  loggerInstance = winston.createLogger({
    level: "debug",
    format: combine(timestamp(), logFormat),
    transports: [
      new Console(),
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({ filename: "logs/combined.log" }),
    ],
  });
}

// 统一导出 logger
export const logger = loggerInstance as Logger & ConsoleLogger;
