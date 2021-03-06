/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import { PropsWithChildren } from 'react';
import styled, { css } from 'reshadow';

import { useDatabaseObjectInfo } from '@cloudbeaver/core-app';
import { Loader } from '@cloudbeaver/core-blocks';
import { useStyles } from '@cloudbeaver/core-theming';

import { ObjectProperty } from './ObjectProperty';

const tabStyles = css`
  properties {
    display: flex;
    flex: 1;
  }
  container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 8px;
  }
`;

type ObjectPropertiesProps = PropsWithChildren<{
  objectId: string;
}>

export const ObjectProperties = observer(function ObjectProperties({
  objectId,
}: ObjectPropertiesProps) {
  const object = useDatabaseObjectInfo(objectId);

  if (!object?.properties) {
    return <Loader />;
  }

  return styled(useStyles(tabStyles))(
    <properties as="div">
      <container as="div">
        {object.properties.map(v => (
          <ObjectProperty key={v.id} objectProperty={v} />
        ))}
      </container>
    </properties>
  );
});
