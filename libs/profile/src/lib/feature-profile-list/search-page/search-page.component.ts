import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	inject,
	Renderer2
} from '@angular/core'
import { fromEvent } from 'rxjs'
import { ProfileCardComponent } from '../../ui'
import { Store } from '@ngrx/store'
import { profileActions, selectFilteredProfiles } from '../../data/store'
import { ProfileFiltersComponent } from '..'
import { InfiniteScrollTriggerComponent } from 'libs/common-ui/src/lib/components'
import { AsyncPipe } from '@angular/common'

@Component({
	selector: 'app-search-page',
	imports: [
		ProfileCardComponent,
		ProfileFiltersComponent,
		InfiniteScrollTriggerComponent,
		AsyncPipe
	],
	templateUrl: './search-page.component.html',
	standalone: true,
	styleUrl: './search-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
	store = inject(Store)
	profiles = this.store.selectSignal(selectFilteredProfiles)

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	constructor() {}

	timeToFetch() {
		this.store.dispatch(profileActions.setPage({}))
	}

	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed()
	}

	ngAfterViewInit() {
		this.resizeFeed()

		fromEvent(window, 'resize').subscribe(() => {
			console.log('Resize')
		})
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()

		const height = window.innerHeight - top - 24 - 24

		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}
