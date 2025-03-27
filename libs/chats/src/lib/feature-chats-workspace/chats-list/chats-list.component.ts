import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { AsyncPipe } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { map, startWith, switchMap } from 'rxjs'
import { ChatService } from 'libs/data-access/src/lib/chats'

@Component({
	selector: 'app-chats-list',
	standalone: true,
	imports: [
		ChatsBtnComponent,
		ReactiveFormsModule,
		AsyncPipe,
		RouterLink,
		RouterLinkActive
	],
	templateUrl: './chats-list.component.html',
	styleUrl: './chats-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent {
	chatService = inject(ChatService)

	filterChatsControl = new FormControl('')

	chats$ = this.chatService.getMyChats().pipe(
		switchMap((chats) => {
			return this.filterChatsControl.valueChanges.pipe(
				startWith(''),
				map((inputValue) => {
					return chats.filter((chat) => {
						return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
							.toLowerCase()
							.includes(inputValue?.toLowerCase() ?? '')
					})
				})
			)
		})
	)
}
