import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	inject
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'
import { TtInputComponent } from '../tt-input/tt-input.component'
import { debounceTime, switchMap } from 'rxjs'
import { DadataService } from '../../data'

@Component({
	selector: 'tt-address-input',
	standalone: true,
	imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
	templateUrl: './address-input.component.html',
	styleUrl: './address-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => AddressInputComponent)
		}
	]
})
export class AddressInputComponent implements ControlValueAccessor {
	innerSearchControl = new FormControl()
	#dadataService = inject(DadataService)
	cdr = inject(ChangeDetectorRef)

	suggestions$ = this.innerSearchControl.valueChanges.pipe(
		debounceTime(500),
		switchMap((val) => {
			return this.#dadataService.getSuggestion(val)
		})
	)

	writeValue(obj: any): void {}

	setDisabledState?(isDisabled: boolean): void {}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	onChange(value: any): void {}
	onTouched() {}
}
