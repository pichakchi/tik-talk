import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { authTokenInerceptor } from '@tt/auth'
import { provideEffects } from '@ngrx/effects'
import { provideStore } from '@ngrx/store'

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authTokenInerceptor])),
		provideStore(),
		provideEffects()
	]
}
