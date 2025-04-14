import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy,
	OnInit
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	FormBuilder,
	FormControl,
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms'
import { Store } from '@ngrx/store'
import { debounceTime, startWith, Subscription } from 'rxjs'
import { communitiesActions } from '../../data'
import { StackInputComponent } from '@tt/common-ui'

enum Themes {
	PROGRAMMING = 'PROGRAMMING',
	TECHNOLOGY = 'TECHNOLOGY',
	EDUCATION = 'EDUCATION',
	SPORT = 'SPORT',
	OTHER = 'OTHER'
}

@Component({
	selector: 'app-communities-filters',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		StackInputComponent
	],
	templateUrl: './communities-filters.component.html',
	styleUrl: './communities-filters.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesFiltersPageComponent implements OnDestroy {
	fb = inject(FormBuilder)
	store = inject(Store)

	Themes = Themes

	searchForm = this.fb.group({
		name: [''],
		themes: new FormControl<Themes>(Themes.PROGRAMMING),
		tags: ['']
	})

	searchFormSub!: Subscription

	constructor() {
		this.searchFormSub = this.searchForm.valueChanges
			.pipe(startWith({}), debounceTime(500))
			.subscribe((formValue) => {
				this.store.dispatch(
					communitiesActions.filterEvents({ filters: formValue })
				)
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
