import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal
} from '@angular/core'
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '@tt/data-access'

@Component({
	selector: 'app-login-page',
	imports: [ReactiveFormsModule],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
	authService = inject(AuthService)
	router = inject(Router)

	isPasswordVisible = signal<boolean>(false)

	form = new FormGroup({
		username: new FormControl(null, Validators.required),
		password: new FormControl(null, Validators.required)
	})

	onSubmit(event: Event) {
		if (this.form.valid) {
			//@ts-ignore
			this.authService.login(this.form.value).subscribe((res) => {
				this.router.navigate([''])
				console.log(res)
			})
		}
	}
}
