import { NavContextT } from './components/NavContextProvider';

export const getNavFn = <NavFn>(
  navContext: NavContextT,
  navFnName: string,
  navFn: NavFn
): NavFn => {
  for (const handler in navContext) {
    if (handler[navFnName]) {
      return handler[navFnName];
    }
  }
  throw Error(`${navFnName} not found in navContext ${navContext}`);
};
