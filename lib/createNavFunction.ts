import { NavContext, type BoundNavFunctionT } from './NavContext';

export function createNavFunction<BoundNavFn extends BoundNavFunctionT>(
  fnName: string,
  boundNavFnStub: BoundNavFn
) {
  return (navContext: NavContext) =>
    getBoundNavFunction(navContext, fnName) as BoundNavFn;
}

export const getBoundNavFunction = (
  navContext: NavContext,
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
