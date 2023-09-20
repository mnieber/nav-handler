import * as React from 'react';
import { NavContext, type NavHandlerT } from '../NavContext';
import { NavHandlersContext } from '../components/NavHandlersProvider';

export const useNavContext = (requesterId: string) => {
  const handlers: NavHandlerT[] = React.useContext(NavHandlersContext);
  return new NavContext(requesterId, handlers);
};
