import { Injectable, ViewContainerRef } from '@angular/core'
import { ModalWindowComponent } from '@tt/common-ui'

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	private container!: ViewContainerRef

	setContainer(container: ViewContainerRef) {
		this.container = container
	}

	show(component: any) {
		const containerRef = this.container.createComponent(component)
		const modalInstance = containerRef.instance as ModalWindowComponent

		modalInstance.isVisible = true

		modalInstance.closeWindow = () => {
			this.container.remove(this.container.indexOf(containerRef.hostView))
		}
	}
}
