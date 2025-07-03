import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly logLevel: LogLevel = environment.logLevel as LogLevel;
  private readonly production: Boolean = environment.production as Boolean;

  private levels = ['debug', 'info', 'warn', 'error'];

  private shouldLog(level: LogLevel): boolean {
    if (this.production) {
      return false;
    }
    const envIndex = this.levels.indexOf(this.logLevel);
    const msgIndex = this.levels.indexOf(level);
    return msgIndex >= envIndex;
  }

  private getTimestamp(): string {
    const now = new Date();
    const pad = (n: number, z = 2) => n.toString().padStart(z, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}.${pad(now.getMilliseconds(), 3)}`;
  }

  debug(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog('debug')) {
      console.info(
        `[DEBUG] - ${this.getTimestamp()} - ${message}`,
        ...optionalParams
      );
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog('info')) {
      console.info(
        `[INFO] - ${this.getTimestamp()} - ${message}`,
        ...optionalParams
      );
    }
  }

  warn(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(
        `[WARN] - ${this.getTimestamp()} - ${message}`,
        ...optionalParams
      );
    }
  }

  error(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog('error')) {
      console.error(
        `[ERROR] - ${this.getTimestamp()} - ${message}`,
        ...optionalParams
      );
    }
  }
}
