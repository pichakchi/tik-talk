import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	viewContainerRef!: ViewContainerRef
	componentRefs: ComponentRef<any>[] = []

	setContainer(viewContainerRef: ViewContainerRef) {
		this.viewContainerRef = viewContainerRef
	}

	show(CommunityModalComponent: any) {
		const componentRef = this.viewContainerRef.createComponent(
			CommunityModalComponent
		)
		this.componentRefs.push(componentRef)
	}

	close(): void {
		const componentRef = this.componentRefs.pop()
		if (componentRef) {
			componentRef.destroy()
		}
	}
}
