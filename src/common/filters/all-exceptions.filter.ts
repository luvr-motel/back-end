import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorBody = isHttp
      ? (exception as HttpException).getResponse()
      : { message: 'Internal server error' };

    // Basic structured log to stdout
    // Avoid leaking sensitive data; do not log bodies by default
    // Include method, url, status, and stack when available
    const payload: Record<string, any> = {
      method: request.method,
      url: request.originalUrl || request.url,
      status,
    };

    if (exception && typeof exception === 'object' && 'stack' in exception) {
      payload.stack = (exception as any).stack;
      payload.name = (exception as any).name;
      payload.message = (exception as any).message;
    }

    // eslint-disable-next-line no-console
    console.error('[Exception]', JSON.stringify(payload));

    response.status(status).json(
      typeof errorBody === 'object'
        ? errorBody
        : { statusCode: status, message: String(errorBody) },
    );
  }
}

