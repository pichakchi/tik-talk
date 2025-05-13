import { createActionGroup, props } from '@ngrx/store'
import { Communities } from '@tt/data-access'

export const communitiesActions = createActionGroup({
	source: 'communities',
	events: {
		'filter events': props<{ filters: Record<string, any> }>(),
		'set page': props<{ page?: number }>(),
		'communities loaded': props<{ communities: Communities[] }>()
	}
})
