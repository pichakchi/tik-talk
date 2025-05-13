import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	inject,
	Renderer2
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommunitiesFiltersPageComponent } from '../communites-filters/communities-filters.component'
import { Store } from '@ngrx/store'
import { communitiesActions, selectFilteredCommunities } from '../../data'
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs'
import { CommunitiesCardComponent } from '../../ui'

@Component({
	selector: 'tt-communities',
	imports: [
		CommonModule,
		CommunitiesFiltersPageComponent,
		CommunitiesCardComponent
	],
	templateUrl: './communities-page.component.html',
	styleUrl: './communities-page.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesPageComponent {
	store = inject(Store)
	community = this.store.selectSignal(selectFilteredCommunities)
	destroy$ = new Subject<void>()

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	constructor() {}

	timeToFetchCommunities() {
		this.store.dispatch(communitiesActions.setPage({}))
	}

	onScrollCommunities() {
		this.timeToFetchCommunities()
	}

	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed()
	}

	ngAfterViewInit() {
		this.resizeFeed()

		fromEvent(window, 'resize')
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe(() => {})
	}

	ngOnDestroy() {
		this.destroy$.next()
		this.destroy$.complete()
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()

		const height = window.innerHeight - top - 24 - 24

		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}
