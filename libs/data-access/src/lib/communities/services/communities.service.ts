import { inject, Injectable, input, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Community, Pageble } from '@tt/data-access'
import { firstValueFrom } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class CommunitiesService {
	http = inject(HttpClient)
	isSubscribed: boolean = false
	buttonText: string = 'Подписаться'

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	me = signal<Community | null>(null)

	getCommunities(id: string) {
		return this.http.get<Community>(`${this.baseApiUrl}community/${id}`)
	}

	filterCommunities(params: Record<string, any>) {
		return this.http.get<Pageble<Community>>(`${this.baseApiUrl}community/`, {
			params
		})
	}

	joinCommunity(community_id: number) {
		firstValueFrom(
			this.http.post(`${this.baseApiUrl}community/${community_id}/join`, {})
		).then(() => {
			this.isSubscribed = true
			this.buttonText = 'Отписаться'
		})
	}

	leaveCommunity(community_id: number) {
		firstValueFrom(
			this.http.post(`${this.baseApiUrl}community/${community_id}/join`, {})
		).then(() => {
			this.isSubscribed = false
			this.buttonText = 'Подписаться'
		})
	}
}
