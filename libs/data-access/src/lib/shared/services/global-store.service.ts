import { Injectable, signal } from '@angular/core'
import { Profile } from '../../profile'
import { Community } from '@tt/data-access'

@Injectable({
	providedIn: 'root'
})
export class GlobalStoreService {
	meProfile = signal<Profile | null>(null)
	meCommunities = signal<Community | null>(null)
}
