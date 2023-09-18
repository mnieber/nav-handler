import * as React from 'react';

export type NavContextT = any[];

export const NavContext = React.createContext<NavContextT>([]);

export const useNavContext = () => {
  return React.useContext(NavContext);
};

export const NavContextProvider = (
  props: React.PropsWithChildren<{ value: NavContextT; extend?: boolean }>
) => {
  const parentValue = useNavContext();

  return (
    <NavContext.Provider
      value={props.extend ? [...parentValue, ...props.value] : [...props.value]}
    >
      {props.children}
    </NavContext.Provider>
  );
};
