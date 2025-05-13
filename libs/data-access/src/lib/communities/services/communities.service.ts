import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Communities, Pageble } from '@tt/data-access'

@Injectable({
	providedIn: 'root'
})
export class CommunitiesService {
	http = inject(HttpClient)

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	me = signal<Communities | null>(null)

	getCommunities(id: string) {
		return this.http.get<Communities>(`${this.baseApiUrl}community/${id}`)
	}

	filterCommunities(params: Record<string, any>) {
		return this.http.get<Pageble<Communities>>(`${this.baseApiUrl}community/`, {
			params
		})
	}
}
