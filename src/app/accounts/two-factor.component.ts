import {
    Component,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import {
    ActivatedRoute,
    Router,
} from '@angular/router';

//import { TwoFactorOptionsComponent } from './two-factor-options.component';

import { ModalComponent } from '../modal.component';

import { TwoFactorProviderType } from 'jslib/enums/twoFactorProviderType';

import { ApiService } from 'jslib/abstractions/api.service';
import { AuthService } from 'jslib/abstractions/auth.service';
import { EnvironmentService } from 'jslib/abstractions/environment.service';
import { I18nService } from 'jslib/abstractions/i18n.service';
import { PlatformUtilsService } from 'jslib/abstractions/platformUtils.service';
import { StateService } from 'jslib/abstractions/state.service';
import { StorageService } from 'jslib/abstractions/storage.service';

import { TwoFactorComponent as BaseTwoFactorComponent } from 'jslib/angular/components/two-factor.component';

@Component({
    selector: 'app-two-factor',
    templateUrl: 'two-factor.component.html',
})
export class TwoFactorComponent extends BaseTwoFactorComponent {
    @ViewChild('twoFactorOptions', { read: ViewContainerRef, static: true }) twoFactorOptionsModal: ViewContainerRef;

    constructor(authService: AuthService, router: Router,
        i18nService: I18nService, apiService: ApiService,
        platformUtilsService: PlatformUtilsService, stateService: StateService,
        environmentService: EnvironmentService, private componentFactoryResolver: ComponentFactoryResolver,
        storageService: StorageService, route: ActivatedRoute) {
        super(authService, router, i18nService, apiService, platformUtilsService, window, environmentService,
            stateService, storageService, route);
        this.onSuccessfulLoginNavigate = this.goAfterLogIn;
    }
    anotherMethod() {
    }
/*
    anotherMethod() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
        const modal = this.twoFactorOptionsModal.createComponent(factory).instance;
        const childComponent = modal.show<TwoFactorOptionsComponent>(TwoFactorOptionsComponent,
            this.twoFactorOptionsModal);

        childComponent.onProviderSelected.subscribe(async (provider: TwoFactorProviderType) => {
            modal.close();
            this.selectedProviderType = provider;
            await this.init();
        });
        childComponent.onRecoverSelected.subscribe(() => {
            modal.close();
        });
    }
*/
    async goAfterLogIn() {
        const orgInvite = await this.stateService.get<any>('orgInvitation');
        const emergencyInvite = await this.stateService.get<any>('emergencyInvitation');
        if (orgInvite != null) {
            this.router.navigate(['accept-organization'], { queryParams: orgInvite });
        } else if (emergencyInvite != null) {
            this.router.navigate(['accept-emergency'], { queryParams: emergencyInvite });
        } else {
            const loginRedirect = await this.stateService.get<any>('loginRedirect');
            if (loginRedirect != null) {
                this.router.navigate([loginRedirect.route], { queryParams: loginRedirect.qParams });
                await this.stateService.remove('loginRedirect');
            } else {
                this.router.navigate([this.successRoute], {
                    queryParams: {
                        identifier: this.identifier,
                    },
                });
            }
        }
    }
}
