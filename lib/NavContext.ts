import { type NavTargetT } from './NavTargetT';

export type BoundNavFunctionT = (...args: any[]) => NavTargetT;
export type NavFunctionT = (navContext: NavContext) => BoundNavFunctionT;
export type UndefinedNavFunctionT = (navContext: NavContext) => undefined;

export type NavFunctionTableT = {
  [key: string]: NavFunctionT | UndefinedNavFunctionT;
};
export type NavHandlerT = { id: string; navFunctionTable: NavFunctionTableT };

export class NavContext {
  requesterId: string;
  handlers: NavHandlerT[];

  navTarget = <NavFn extends NavFunctionT>(
    navFn: NavFn
  ): ((...args: Parameters<ReturnType<NavFn>>) => NavTargetT) => {
    return (...args: Parameters<ReturnType<NavFn>>) => {
      const boundNavFn = navFn(this);
      const navTarget = boundNavFn(...args);
      return navTarget;
    };
  };

  nav = <NavFn extends NavFunctionT>(
    navFn: NavFn
  ): ((...args: Parameters<ReturnType<NavFn>>) => void) => {
    return (...args: Parameters<ReturnType<NavFn>>) => {
      const boundNavFn = navFn(this);
      const navTarget = boundNavFn(...args);
      navTarget.nav();
    };
  };

  url = <NavFn extends NavFunctionT>(
    navFn: NavFn
  ): ((...args: Parameters<ReturnType<NavFn>>) => string) => {
    return (...args: Parameters<ReturnType<NavFn>>) => {
      const boundNavFn = navFn(this);
      const navTarget = boundNavFn(...args);
      return navTarget.url;
    };
  };

  constructor(requesterId: string, handlers: NavHandlerT[]) {
    this.requesterId = requesterId;
    this.handlers = handlers;
  }
}
