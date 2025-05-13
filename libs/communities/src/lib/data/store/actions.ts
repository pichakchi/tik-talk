import { createActionGroup, props } from '@ngrx/store'
import { Community } from '@tt/data-access'

export const communitiesActions = createActionGroup({
	source: 'communities',
	events: {
		'filter communities': props<{ filters: Record<string, any> }>(),
		'set page': props<{ page?: number }>(),
		'communities loaded': props<{ communities: Community[] }>()
	}
})
