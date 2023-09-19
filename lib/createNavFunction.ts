import { NavContextT } from './hooks/useNavContext';

export type NavTargetT = {
  url: string;
  nav: () => void;
};

export type BoundNavFunctionT = (...args: any[]) => NavTargetT;
export type NavFunctionT = (navContext: NavContextT) => BoundNavFunctionT;
export type NavHandlerT = (navContext: NavContextT) => BoundNavFunctionT;

export const getBoundNavFunction = (
  navContext: NavContextT,
  navFnName: string
) => {
  for (const handler of navContext.handlers) {
    const navFunction = handler.navFunctionTable[navFnName];
    if (navFunction) {
      const boundNavFunction = navFunction(navContext);
      if (boundNavFunction) {
        return boundNavFunction;
      }
    }
  }
  const handlerNames = navContext.handlers.map((handler) => handler.id);
  const handlerNamesStr = handlerNames.length
    ? handlerNames.join(', ')
    : 'none';
  throw Error(
    `${navFnName} not found in navContext requested by ` +
      `${navContext.requesterId}. Handlers: ${handlerNamesStr}`
  );
};

export function createNavFunction<BoundNavFn extends BoundNavFunctionT>(
  fnName: string,
  boundNavFnStub: BoundNavFn
) {
  return (navContext: NavContextT) =>
    getBoundNavFunction(navContext, fnName) as BoundNavFn;
}

export const stub = undefined as unknown as NavTargetT;

export const createNavTarget = (url: string, ufn: Function): NavTargetT => {
  return { url, nav: () => ufn(url) };
};
