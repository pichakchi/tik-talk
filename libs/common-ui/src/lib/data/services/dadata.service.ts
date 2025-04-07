import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'
import { DadataSuggestions } from '../interfaces/dadata.interfaces'
import { DADATA_TOKEN } from './token'

@Injectable({
	providedIn: 'root'
})
export class DadataService {
	#apiUrl =
		'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
	#http = inject(HttpClient)

	getSuggestion(query: string) {
		return this.#http
			.post<{ suggestions: DadataSuggestions }>(
				this.#apiUrl,
				{ query },
				{
					headers: {
						Authorization: `Token ${DADATA_TOKEN}`
					}
				}
			)
			.pipe(map((res) => res.suggestions))
	}
}
