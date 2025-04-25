import { Component, HostListener, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'tt-select-input',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './select-input.component.html',
	styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
	placeholder = input<string>()
	type = input<'text' | 'password'>('text')
	options: string[] = [
		'PROGRAMMING',
		'TECHNOLOGY',
		'EDUCATION',
		'SPORT',
		'OTHER'
	]
	showOptions: boolean = false
	selectedOption = ''

	toggleOptions() {
		this.showOptions = !this.showOptions
	}

	hideOptions() {
		this.showOptions = false
	}

	selectOption(option: string, event: MouseEvent) {
		event.stopPropagation()
		this.selectedOption = option
		this.hideOptions()
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent) {
		const target = event.target as HTMLElement
		const clickedInside = target.closest('.tt-form-input')

		if (!clickedInside) {
			this.hideOptions()
		}
	}
}
