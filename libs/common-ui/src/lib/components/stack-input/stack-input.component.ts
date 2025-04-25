import {
	Component,
	forwardRef,
	HostBinding,
	HostListener,
	input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR
} from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { SvgIconComponent } from '../svg-icon/svg-icon.component'

@Component({
	selector: 'tt-stack-input',
	standalone: true,
	imports: [CommonModule, SvgIconComponent, FormsModule],
	templateUrl: './stack-input.component.html',
	styleUrl: './stack-input.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => StackInputComponent)
		}
	]
})
export class StackInputComponent implements ControlValueAccessor {
	value$ = new BehaviorSubject<string[]>([])
	placeholder = input<string>()
	type = input<'text' | 'password'>('text')

	#disabled = false

	@HostBinding('class.disabled')
	get disabled(): boolean {
		return this.#disabled
	}

	innerInput = ''

	@HostListener('keydown.enter', ['$event'])
	onEnter(event: KeyboardEvent) {
		event.stopPropagation()
		event.preventDefault()

		if (!this.innerInput) return

		const currentValues = this.value$.value

		if (currentValues.includes(this.innerInput)) {
			this.innerInput = ''
			return
		}

		this.value$.next([...currentValues, this.innerInput])
		this.innerInput = ''
		this.onChange(this.value$.value)
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	setDisabledState(isDisabled: boolean): void {
		this.#disabled = isDisabled
	}

	writeValue(stack: string[] | null): void {
		if (!stack) {
			this.value$.next([])
			return
		}

		this.value$.next(stack)
	}

	onChange(value: string[] | null) {}

	onTouched() {}

	onTagDelete(i: number) {
		const tags = [...this.value$.value]
		tags.splice(i, 1)
		this.value$.next(tags)
		this.onChange(this.value$.value)
	}
}
