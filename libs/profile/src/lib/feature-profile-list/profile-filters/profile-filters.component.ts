import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, startWith, Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { ProfileService } from '@tt/data-access'
import { profileActions } from '../../data'

@Component({
	selector: 'app-profile-filters',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './profile-filters.component.html',
	styleUrl: './profile-filters.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnDestroy {
	fb = inject(FormBuilder)
	store = inject(Store)
	profile = inject(ProfileService)

	searchForm = this.fb.group({
		firstName: [''],
		lastName: [''],
		stack: ['']
	})

	searchFormSub!: Subscription

	constructor() {
		this.searchFormSub = this.searchForm.valueChanges
			.pipe(startWith({}), debounceTime(300))
			.subscribe((formValue) => {
				this.store.dispatch(profileActions.filterEvents({ filters: formValue }))
			})
	}

	ngOnDestroy() {
		this.searchFormSub.unsubscribe()
	}

	autoSave(value: any) {
		localStorage.setItem('formData', JSON.stringify(value))
	}

	ngOnInit() {
		const savedData = localStorage.getItem('formData')
		if (savedData) {
			this.searchForm.patchValue(JSON.parse(savedData))
		}

		this.searchForm.valueChanges.subscribe((value) => {
			this.autoSave(value)
		})
	}
}
