import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './../../../../helpers/errorStateMatcher';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { OnLoginAnswer } from '../../interfaces/OnLoginAnswer';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  /**
   * Инициализация формы и ее полей, добавление валидации полей формы
   */
  ngOnInit() {
    // Init form
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  /**
   * onLogin:
   *    1. Сохраняет значения полей формы;
   *    2. Вызывает метод сервиса для запроса на вход пользователя;
   *    3. Обрабатывает полученный ответ, если есть ошибка - выводит о ней сообщение,
   *       если нет - выводит сообщение о успешном входе.
   */
  onLogin() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.authService.login(email, password)
      .subscribe((data: OnLoginAnswer | HttpErrorResponse) => {
          if (data.error) {
            this.messageService.add({severity: 'error', summary: 'Error!', detail: data.error.message, life: 3000});
          } else {
            this.messageService.add({severity: 'success', summary: 'Successful login!', life: 3000});
            // here will be redirect to main page
          }
        }, (err) => console.log(err)
      );
  }
}
