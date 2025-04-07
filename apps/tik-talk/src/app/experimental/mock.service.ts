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
				code: 'Cчастлив',
				label: 'Очень счастлив',
				value: true
			},
			{
				code: 'Хорошо',
				label: 'Доволен',
				value: true
			},
			{
				code: 'Стабильно',
				label: 'Нормально',
				value: false
			},
			{
				code: 'Депрессивно',
				label: 'Грустно',
				value: false
			}
		])
	}
}
