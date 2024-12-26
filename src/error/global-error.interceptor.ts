import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import axios from 'axios';

@Injectable()
export class GlobalErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // const response = context.switchToHttp().getResponse();

        console.error('Erro completo:', error);

        if (axios.isAxiosError(error)) {
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  message: error.response?.data || 'Erro na requisição externa',
                  error: 'Axios Error',
                },
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }

        return throwError(
          () =>
            new HttpException(
              {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                message: error.message || 'Erro interno do servidor',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                error: error.name || 'InternalServerError',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
