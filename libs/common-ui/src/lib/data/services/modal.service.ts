import {
	ApplicationRef,
	inject,
	Injectable,
	TemplateRef,
	ViewContainerRef
} from '@angular/core'
import { ModalWindowComponent } from '@tt/common-ui'

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	appRef = inject(ApplicationRef)

	viewContainerRef!: ViewContainerRef

	setContainer(viewContainerRef: ViewContainerRef) {
		this.viewContainerRef = viewContainerRef
	}

	show(viewContainerRef: ViewContainerRef, content: TemplateRef<any>) {
		const componentRef = viewContainerRef.createComponent(ModalWindowComponent)
		componentRef.instance.closeWindow = () => this.close(componentRef)
		componentRef.instance.isVisible = true
		componentRef.instance.content = content

		const modalElem = componentRef.location.nativeElement

		modalElem.addEventListener('click', (event: MouseEvent) => {
			const target = event.target as HTMLElement

			if (!modalElem.contains(target)) {
				this.close(componentRef)
			}
		})
	}

	close(componentRef: any) {
		this.appRef.detachView(componentRef.hostView)
		componentRef.destroy()
	}
}
