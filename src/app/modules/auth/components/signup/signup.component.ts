import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './../../../../helpers/errorStateMatcher';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { UserInfo } from '../../interfaces/UserInfo';
import { OnSignupAnswer } from './../../interfaces/OnSignupAnswer';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public genderList = [ 'male', 'female' ];

  public signupForm: FormGroup;
  public matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * Инициализация формы и ее полей, добавление валидации полей формы
   */
  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.minLength(8),
        Validators.required
      ]),
      nickname: new FormControl('', [
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.required
      ]),
      first_name: new FormControl('', [
        Validators.pattern('^[a-zA-Z\'-]+$'),
        Validators.required
      ]),
      last_name: new FormControl('', [
        Validators.pattern('^[a-zA-Z\'-]+$'),
        Validators.required,
      ]),
      phone: new FormControl('', [
        Validators.pattern('^[0-9]{1,14}$'),
        Validators.required
      ]),
      gender_orientation: new FormControl('', [
        Validators.required
      ]),
      city: new FormControl('', [
        Validators.pattern('^[a-zA-Z\'-]+$'),
        Validators.required
      ]),
      country: new FormControl('', [
        Validators.pattern('^[a-zA-Z\'-]+$'),
        Validators.required
      ]),
      date_of_birth_day: new FormControl('', [
        Validators.pattern('^([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])$'),
        Validators.required
      ]),
      date_of_birth_month: new FormControl('', [
        Validators.pattern('^([1-9]|0[1-9]|[1-9]|1[0-2])$'),
        Validators.required
      ]),
      date_of_birth_year: new FormControl('', [
        Validators.pattern('^(19[0-9][0-9]|200[0-9]|201[0-8])$'),
        Validators.required
      ])
    });
  }

  /**
   * onSignup:
   *    1. Создает объект на основе полей формы;
   *    2. Вызывает метод сервиса для запроса на регистрацию пользователя;
   *    3. Обрабатывает полученный ответ, если ошибок нет - возвращает сообщение о успешном запросе
   *       и редиректит пользователя на страницу login;
   *    4. Если произошла ошибка - выводит о ней сообщение.
   */
  onSignup(): void {
    const userInfo: UserInfo = {
      city: this.signupForm.get('city').value,
      country: this.signupForm.get('country').value,
      date_of_birth_day: this.signupForm.get('date_of_birth_day').value,
      date_of_birth_month: this.signupForm.get('date_of_birth_month').value,
      date_of_birth_year: this.signupForm.get('date_of_birth_year').value,
      email: this.signupForm.get('email').value,
      first_name: this.signupForm.get('first_name').value,
      gender_orientation: this.signupForm.get('gender_orientation').value,
      last_name: this.signupForm.get('last_name').value,
      nickname: this.signupForm.get('nickname').value,
      password: this.signupForm.get('password').value,
      phone: this.signupForm.get('phone').value
    };

    this.authService.signup(userInfo).subscribe((answer: OnSignupAnswer | HttpErrorResponse): void => {
      if (!answer.error) {
        this.messageService.add({
          severity: 'success',
          summary: answer.message,
          life: 3000
        });

        this.router.navigate(['../login'], { relativeTo: this.route } );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: answer.error.message,
          life: 3000
        });
      }
    });
  }
}
