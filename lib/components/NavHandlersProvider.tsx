import * as React from 'react';
import { type NavHandlerT } from '../NavContext';

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
