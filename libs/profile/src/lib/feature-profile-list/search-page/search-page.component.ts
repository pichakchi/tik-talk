import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	inject,
	Renderer2
} from '@angular/core'
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs'
import { ProfileCardComponent } from '../../ui'
import { Store } from '@ngrx/store'
import { ProfileFiltersComponent } from '@tt/profile'
import { InfiniteScrollTriggerComponent } from '@tt/common-ui'
import { profileActions, selectFilteredProfiles } from '../../data'

@Component({
	selector: 'app-search-page',
	imports: [
		ProfileCardComponent,
		ProfileFiltersComponent,
		InfiniteScrollTriggerComponent
	],
	templateUrl: './search-page.component.html',
	standalone: true,
	styleUrl: './search-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
	store = inject(Store)
	profiles = this.store.selectSignal(selectFilteredProfiles)
	destroy$ = new Subject<void>()

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	constructor() {}

	timeToFetchProfile() {
		this.store.dispatch(profileActions.setPage({}))
	}

	onScrollProfile() {
		this.timeToFetchProfile()
	}

	// onIntersection(entries: IntersectionObserverEntry[]) {
	// 	if (!entries.length) return
	// 	if (entries[0].intersectionRatio > 0) {
	// 		this.timeToFetch()
	// 	}
	// }

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
