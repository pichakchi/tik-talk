import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Community, Pageble } from '@tt/data-access'

@Injectable({
	providedIn: 'root'
})
export class CommunitiesService {
	http = inject(HttpClient)

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	me = signal<Community | null>(null)

	filterCommunities(params: Record<string, any>) {
		return this.http.get<Pageble<Community>>(`${this.baseApiUrl}community/`, {
			params
		})
	}

	joinCommunity(community_id: number) {
		return this.http.post(
			`${this.baseApiUrl}community/${community_id}/join`,
			{}
		)
	}

	leaveCommunity(community_id: number) {
		return this.http.post(
			`${this.baseApiUrl}community/${community_id}/join`,
			{}
		)
	}
}
