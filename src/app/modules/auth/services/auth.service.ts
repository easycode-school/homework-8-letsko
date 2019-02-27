import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { OnLoginAnswer } from './../interfaces/OnLoginAnswer';
import { UserInfo } from './../interfaces/UserInfo';
import { OnSignupAnswer } from '../interfaces/OnSignupAnswer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  /**
   * login:
   *    1. Создает объект заголовка запроса;
   *    2. Возвращает запрос к серверу на отправку полей e-mail и password для получения id и token;
   *    3. Обрабатывает ответ сервера, если ответ получен без ошибок - сохраняет в localstorage полученные token и id пользователя,
   *       возвращает ответ сервера;
   *    4. Если в ответе сервера содержит ошибку - преобразует ее в Observable и пробрасывает для дальнейшей обработки.
   * @param email - e-mail пользователя
   * @param password - password пользователя
   */
  login(email: string, password: string): Observable<OnLoginAnswer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.http.post<OnLoginAnswer | HttpErrorResponse>(`${this.apiUrl}/public/auth/login`, { email, password }, httpOptions).pipe(
      map((res: OnLoginAnswer): OnLoginAnswer => {
        if (!res.error) {
          localStorage.setItem('mlp_client_id', res.id);
          localStorage.setItem('mlp_client_token', res.token);

          return res;
        }
      }),
      catchError((err: HttpErrorResponse): Observable<HttpErrorResponse> => {
        return of(err);
      })
    );
  }

  /**
   * signup:
   *    1. Создает объект заголовка запроса;
   *    2. Возвращает запрос к серверу на отправку объекта нового пользователя;
   *    3. Если в ответе сервера содержит ошибку - преобразует ее в Observable и пробрасывает для дальнейшей обработки.
   * @param userInfo - объект нового пользователя, содержит поля информации о пользователе.
   */
  signup(userInfo: UserInfo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.http.post<OnSignupAnswer | HttpErrorResponse>(`${this.apiUrl}/public/auth/signup`, userInfo, httpOptions).pipe(
      catchError((err: Error): Observable<Error> => {
        return of(err);
      })
    );
  }
}
