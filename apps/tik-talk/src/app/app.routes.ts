import { Routes } from '@angular/router'
import { ExperimentalDirective } from './experimental/experimental.directive'
import { canActivateAuth, LoginPageComponent } from '@tt/auth'
import {
	ProfilePageComponent,
	SearchPageComponent,
	SettingsPageComponent
} from '@tt/profile'
import { chatsRoutes } from '@tt/chats'
import { LayoutComponent } from '@tt/layout'
import { provideState } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { PostEffects, postFeature } from '@tt/posts'
import { profileFeature } from 'libs/profile/src/lib/data/store/reducer'
import { ProfileEffects } from 'libs/profile/src/lib/data/store/effects'

export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: '', redirectTo: 'profile/me', pathMatch: 'full' },
			{
				path: 'profile/:id',
				component: ProfilePageComponent,
				providers: [provideState(postFeature), provideEffects(PostEffects)]
			},
			{
				path: 'search',
				component: SearchPageComponent,
				providers: [
					provideState(profileFeature),
					provideEffects(ProfileEffects)
				]
			},
			{ path: 'settings', component: SettingsPageComponent },
			{ path: 'experimental', component: ExperimentalDirective },
			{
				path: 'chats',
				loadChildren: () => chatsRoutes
			}
		],
		canActivate: [canActivateAuth]
	},
	{ path: 'login', component: LoginPageComponent }
]
