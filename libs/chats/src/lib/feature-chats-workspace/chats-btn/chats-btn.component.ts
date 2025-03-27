import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { DatePipe } from '@angular/common'
import { AvatarCircleComponent } from '@tt/common-ui'
import { LastMessageRes } from 'libs/data-access/src/lib/chats'

@Component({
	selector: 'button[chats]',
	standalone: true,
	imports: [AvatarCircleComponent, DatePipe],
	templateUrl: './chats-btn.component.html',
	styleUrl: './chats-btn.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsBtnComponent {
	chat = input<LastMessageRes>()
}
