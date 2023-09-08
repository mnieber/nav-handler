import React from 'react';
import { navHandler } from '../NavHandler';
import { useBuilder } from '../utils/hooks/useBuilder';
import { ObjT } from '../utils/types';
import { getOptions } from '../options';

export function useInstallNavPage(name: string, navFns: ObjT) {
  const routeMatch = getOptions().useRouteMatch();

  const navPage = useBuilder(() => {
    const navPage = {
      name: name,
      route: routeMatch.path,
      fns: navFns,
    };
    navHandler.installNavPage(navPage);
    return navPage;
  });

  React.useEffect(() => {
    return () => {
      navHandler.uninstallNavPage(navPage.name);
    };
  }, [navHandler, navPage]);
}
