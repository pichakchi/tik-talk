import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	HostListener,
	inject,
	input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR
} from '@angular/forms'
import { of } from 'rxjs'

@Component({
	selector: 'tt-select-input',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './select-input.component.html',
	styleUrl: './select-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => SelectInputComponent)
		}
	]
})
export class SelectInputComponent implements ControlValueAccessor {
	placeholder = input<string>()
	options = input<string[]>([])

	cdr = inject(ChangeDetectorRef)

	showOptions = false
	selectedOption: string | null = null

	onChange: any
	onTouched: any

	toggleOptions() {
		this.showOptions = !this.showOptions
	}

	hideOptions() {
		this.showOptions = false
	}

	selectOption(option: string, event: MouseEvent) {
		event.stopPropagation()
		this.hideOptions()
		this.selectedOption = option
		this.onChange(option)
		this.cdr.detectChanges()
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent) {
		const target = event.target as HTMLElement
		const clickedInside = target.closest('.tt-form-input')

		if (!clickedInside) {
			this.hideOptions()
		}
	}

	protected readonly of = of

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	setDisabledState(isDisabled: boolean): void {}

	writeValue(value: string | null): void {
		this.selectedOption = value
		this.cdr.detectChanges()
	}
}
