import { sortNavPages } from './utils/sortNavPages';
import { ObjT } from './utils/types';

export type NavPageT = {
  route: string;
  name: string;
  fns: ObjT;
};

export type PropsT = {};

// This class returns the NavPage for a particular prop name:
//
// 1. it selects the NavPages that match the current route, and sorts them by the number
//    of matching url parameters.
// 2. it finds the NavPage that contains the event handler with the given prop name.
//
// The above means that the handling of url events depends on the current url
// The component that looks up the navigation function doesn't need to know anything about the url.

export class NavHandler {
  navPages: Array<NavPageT> = [];

  installNavPage(navPage: NavPageT) {
    const existingNavPage = this.navPages.find(
      (x: NavPageT) => x.name === navPage.name
    );
    if (!existingNavPage) {
      this.navPages.push(navPage);
    }
  }

  getNavPage(name: string) {
    return this.navPages.find((x: NavPageT) => x.name === name);
  }

  uninstallNavPage(name: string) {
    this.navPages = this.navPages.filter(
      (navPage: NavPageT) => navPage.name !== name
    );
  }

  _getNavPage(fnName: string): NavPageT | undefined {
    const sortedLayers = sortNavPages(
      this.navPages,
      document.location.pathname
    );
    for (let i = 0; i < sortedLayers.length; i++) {
      const layer = sortedLayers[i];
      const handler = layer.fns[fnName];
      if (handler) {
        return layer;
      }
    }
    return undefined;
  }

  getNavFn<T>(fnName: string, f: T): T {
    const navPage = this._getNavPage(fnName);
    if (!navPage) {
      console.error(`NavHandler: no navPage found for ${fnName}`);
    }
    return navPage?.fns[fnName] as T;
  }

  constructor(props: PropsT) {}
}

export const navHandler: NavHandler = new NavHandler({});
