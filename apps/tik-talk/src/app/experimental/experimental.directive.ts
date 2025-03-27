import { Component, inject } from '@angular/core'
import {
	AbstractControl,
	FormArray,
	FormControl,
	FormGroup,
	FormRecord,
	FormsModule,
	ReactiveFormsModule,
	ValidatorFn,
	Validators
} from '@angular/forms'
import { KeyValuePipe } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Feature, MockService } from './mock.service'
import { NameValidator } from './name.validator'

enum MethodType {
	PSYCHOANALYSIS = 'PSYCHOANALYSIS',
	GESTALT = 'GESTALT',
	SUPERVISION = 'SUPERVISION'
}

enum CounsellingType {
	PERSONALLY = 'PERSONALLY',
	ONLINE = 'ONLINE',
	HOME = 'HOME'
}

enum DateType {
	WORKDAY = 'WORKDAY',
	WEEKEND = 'WEEKEND'
}

interface Session {
	counsellingTypes?: string | null
	time?: string | null
	dateTypes?: string | null
}

function getSessionForm(initialValue: Session = {}) {
	return new FormGroup(
		{
			counsellingTypes: new FormControl<CounsellingType>(
				CounsellingType.PERSONALLY
			),
			dateTypes: new FormControl<DateType>(DateType.WORKDAY)
		},
		validateTimeRange({ fromControlName: 'from', toControlName: 'to' })
	)
}
function validateStartWith(forbiddenLetter: string): ValidatorFn {
	return (control: AbstractControl) => {
		return control.value.startsWith(forbiddenLetter)
			? {
					startsWith: {
						message: `Не верю, что твое имя начинается с ${forbiddenLetter}!`
					}
				}
			: null
	}
}

function validateTimeRange({
	fromControlName,
	toControlName
}: {
	fromControlName: string
	toControlName: string
}) {
	return (control: AbstractControl) => {
		const fromControl = control.get(fromControlName)
		const toControl = control.get(toControlName)

		if (!fromControl || !toControl) return null

		const fromTime = new Date(fromControl.value)
		const toTime = new Date(toControl.value)

		return fromTime && toTime && fromTime > toTime
			? {
					timeRange: { message: 'Дата начала не может быть позднее даты конца' }
				}
			: null
	}
}

@Component({
	selector: '[appExperimental]',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, KeyValuePipe],
	templateUrl: './experimental.html',
	styleUrl: './experimental.scss'
})
export class ExperimentalDirective {
	CounsellingType = CounsellingType
	DateType = DateType
	MethodType = MethodType

	mockService = inject(MockService)
	nameValidator = inject(NameValidator)
	features: Feature[] = []

	form = new FormGroup({
		methodTypes: new FormControl<MethodType>(MethodType.PSYCHOANALYSIS),
		name: new FormControl<string>('', {
			validators: [Validators.required],
			asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
			updateOn: 'blur'
		}),
		lastName: new FormControl<string>(''),
		specialization: new FormControl<string>(''),
		sessionTypes: new FormArray([getSessionForm()]),
		feature: new FormRecord({}),
		timeRange: new FormGroup({
			from: new FormControl<string>(''),
			to: new FormControl<string>('')
		})
	})

	constructor() {
		this.mockService
			.getSession()
			.pipe(takeUntilDestroyed())
			.subscribe((sess) => {
				// while(this.form.controls.sessionTypes.controls.length > 0) {
				//   this.form.controls.sessionTypes.removeAt(0);
				// }

				this.form.controls.sessionTypes.clear()

				for (const ses of sess) {
					this.form.controls.sessionTypes.push(getSessionForm(ses))
				}
			})

		this.mockService
			.getFeatures()
			.pipe(takeUntilDestroyed())
			.subscribe((features) => {
				this.features = features

				for (const feature of features) {
					this.form.controls.feature.addControl(
						feature.code,
						new FormControl(feature.value)
					)
				}
			})

		this.form.controls.methodTypes.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe((val) => {
				this.form.controls.specialization.clearValidators()

				if (val === MethodType.SUPERVISION) {
					this.form.controls.specialization.setValidators([
						Validators.required,
						Validators.minLength(5)
					])
				}
			})
	}

	onSubmit(event: SubmitEvent) {
		this.form.markAllAsTouched()
		this.form.updateValueAndValidity()

		if (this.form.invalid) return

		console.log('this.form.valid', this.form.valid)
		console.log('this.form.getRawValue()', this.form.getRawValue())
	}

	addTypeSession() {
		this.form.controls.sessionTypes.insert(0, getSessionForm())
	}

	deleteTypeSession(index: number) {
		this.form.controls.sessionTypes.removeAt(index, { emitEvent: false })
	}

	sort = () => 0
}
