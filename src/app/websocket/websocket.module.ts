import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../service/websocket.service';
import { config } from '../service/websocket.config';
import { WebSocketConfig } from '../models/websocket';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        WebsocketService
    ]
})
export class WebsocketModule {
    public static config(wsConfig: WebSocketConfig): ModuleWithProviders<WebsocketModule> {
        return {
            ngModule: WebsocketModule,
            providers: [{ provide: config, useValue: wsConfig }]
        };
    }
}
