import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { PostComment } from '../../data'
import { AvatarCircleComponent, TimeAgoPipe } from '@tt/common-ui'

@Component({
	selector: 'app-comment',
	standalone: true,
	imports: [AvatarCircleComponent, TimeAgoPipe],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
	comment = input<PostComment>()
}
