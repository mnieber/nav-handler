import * as React from 'react';

export type ObjT = { [key: string]: any };
export type NavHandlerT = { id: string; navFunctionTable: ObjT };

export const NavHandlersContext = React.createContext<NavHandlerT[]>([]);

export const NavHandlersProvider = (
  props: React.PropsWithChildren<{ value: NavHandlerT[]; extend?: boolean }>
) => {
  const parentHandlers = React.useContext(NavHandlersContext);
  const value: NavHandlerT[] = props.extend
    ? [...parentHandlers, ...props.value]
    : [...props.value];

  return (
    <NavHandlersContext.Provider value={value}>
      {props.children}
    </NavHandlersContext.Provider>
  );
};
