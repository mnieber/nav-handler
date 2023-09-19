import * as React from 'react';
import {
  NavHandlersContext,
  type NavHandlerT,
} from '../components/NavHandlersProvider';

export type NavContextT = {
  requesterId: string;
  handlers: NavHandlerT[];
};

export const useNavContext = (requesterId: string) => {
  const handlers: NavHandlerT[] = React.useContext(NavHandlersContext);
  return { requesterId, handlers };
};
