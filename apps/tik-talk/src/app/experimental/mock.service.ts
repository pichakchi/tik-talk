import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

export interface Feature {
	code: string
	label: string
	value: boolean
}

@Injectable({ providedIn: 'root' })
export class MockService {
	getSession() {
		return of([
			{
				counsellingTypes: '',
				time: '15:00',
				dateTypes: ''
			},
			{
				counsellingTypes: '',
				time: '11:30',
				dateTypes: ''
			}
		])
	}

	getData(val: string) {
		return of(`Data from backend: ${val}`)
	}

	getFeatures(): Observable<Feature[]> {
		return of([
			{
				code: 'Сангвиник',
				label: 'Открытый',
				value: true
			},
			{
				code: 'Холерик',
				label: 'Задумчивый',
				value: true
			},
			{
				code: 'Флегматик',
				label: 'Спокойный',
				value: false
			},
			{
				code: 'Меланхолик',
				label: 'Интровертированный',
				value: false
			}
		])
	}
}
