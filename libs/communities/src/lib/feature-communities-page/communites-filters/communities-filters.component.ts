import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy,
	TemplateRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Store } from '@ngrx/store'
import { debounceTime, startWith, Subscription } from 'rxjs'
import { communitiesActions } from '../../data'
import {
	ModalService,
	SelectInputComponent,
	StackInputComponent,
	SvgIconComponent,
	TtInputComponent
} from '@tt/common-ui'

@Component({
	selector: 'app-communities-filters',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		StackInputComponent,
		SvgIconComponent,
		TtInputComponent,
		SelectInputComponent,
	],
	templateUrl: './communities-filters.component.html',
	styleUrl: './communities-filters.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesFiltersPageComponent implements OnDestroy {
	fb = inject(FormBuilder)
	store = inject(Store)
	modalService = inject(ModalService)

	isModalVisible = false

	themes = ['PROGRAMMING', 'TECHNOLOGY', 'EDUCATION', 'SPORT', 'OTHER']

	searchForm = this.fb.group({
		name: [''],
		themes: [''],
		tags: ['']
	})

	searchFormSub!: Subscription

	constructor() {
		this.searchFormSub = this.searchForm.valueChanges
			.pipe(startWith({}), debounceTime(500))
			.subscribe((formValue) => {
				this.store.dispatch(
					communitiesActions.filterCommunities({ filters: formValue })
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

	@ViewChild('modalContainer', { read: ViewContainerRef })
	modalContainer!: ViewContainerRef
	@ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>

	openCreateCommunityModal() {
		this.isModalVisible = true
		this.modalService.show(this.modalContainer, this.contentTemplate)
	}
}
