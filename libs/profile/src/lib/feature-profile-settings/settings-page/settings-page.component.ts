import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	ViewChild
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { firstValueFrom } from 'rxjs'
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui'
import { StackInputComponent } from 'libs/common-ui/src/lib/components/stack-input/stack-input.component'
import { ProfileService } from 'libs/data-access/src/lib/profile/services/profile.service'

@Component({
	selector: 'app-settings-page',
	standalone: true,
	imports: [
		ProfileHeaderComponent,
		ReactiveFormsModule,
		AvatarUploadComponent,
		StackInputComponent
	],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
	fb = inject(FormBuilder)
	profileService = inject(ProfileService)

	@ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

	form = this.fb.group({
		firstName: ['', [Validators.required]],
		lastName: ['', [Validators.required]],
		username: [{ value: '', disabled: true }, [Validators.required]],
		description: [''],
		// stack: [{ value: '', disabled: true }]
		stack: [''],
		city: [null]
	})

	constructor() {
		effect(() => {
			//@ts-ignore
			this.form.patchValue({
				...this.profileService.me()
				// //@ts-ignore
				// stack: this.mergeStack(this.profileService.me()?.stack)
			})
		})
	}

	ngAfterViewInit() {}

	onSave() {
		this.form.markAllAsTouched()
		this.form.updateValueAndValidity()

		if (this.form.invalid) return

		if (this.avatarUploader.avatar) {
			firstValueFrom(
				this.profileService.uploadAvatar(this.avatarUploader.avatar)
			)
		}

		firstValueFrom(
			//@ts-ignore
			this.profileService.patchProfile({
				...this.form.value
				// stack: this.splitStack(this.form.value.stack)
			})
		)
	}

	// splitStack(stack: string | null | string[] | undefined): string[] {
	// 	if (!stack) return []
	// 	if (Array.isArray(stack)) return stack
	//
	// 	return stack.split(',')
	// }
	//
	// mergeStack(stack: string | null | string[] | undefined) {
	// 	if (!stack) return ''
	// 	if (Array.isArray(stack)) return stack.join(',')
	//
	// 	return stack
	// }
}
