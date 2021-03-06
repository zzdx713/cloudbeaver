/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { MainMenuService, ConnectionDialogsService } from '@cloudbeaver/core-app';
import { injectable } from '@cloudbeaver/core-di';
import { CommonDialogService } from '@cloudbeaver/core-dialogs';
import { NotificationService } from '@cloudbeaver/core-events';
import { PermissionsService, EPermission, SessionService } from '@cloudbeaver/core-root';

import { BasicConnectionService } from './BasicConnectionService';
import { ConnectionDialog } from './ConnectionDialog/ConnectionDialog';

@injectable()
export class BasicConnectionPluginBootstrap {

  constructor(
    private connectionDialogsService: ConnectionDialogsService,
    private mainMenuService: MainMenuService,
    private basicConnectionService: BasicConnectionService,
    private commonDialogService: CommonDialogService,
    private notificationService: NotificationService,
    private permissionsService: PermissionsService,
    private sessionService: SessionService
  ) {
  }

  bootstrap() {
    this.loadDbSources();
    this.sessionService.onUpdate.subscribe(this.loadDbSources.bind(this));
    this.mainMenuService.registerMenuItem(
      this.connectionDialogsService.newConnectionMenuToken,
      {
        id: 'mainMenuConnect',
        order: 2,
        title: 'basicConnection_main_menu_item',
        onClick: () => this.openConnectionsDialog(),
        isHidden: () => !this.permissionsService.has(EPermission.public),
        isDisabled: () => !this.basicConnectionService.dbSources.data.length,
      }
    );
  }

  private async openConnectionsDialog() {
    await this.commonDialogService.open(ConnectionDialog, null);
  }

  private async loadDbSources() {
    try {
      await this.basicConnectionService.dbSources.refresh(true);
    } catch (error) {
      this.notificationService.logException(error, 'DBSources loading failed');
    }
  }
}
