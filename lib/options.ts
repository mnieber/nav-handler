export type OptionsT = {
  matchPath: Function;
  useRouteMatch: Function;
};

export const options: OptionsT = {
  matchPath: () => undefined,
  useRouteMatch: () => undefined,
};

export const getOptions = () => options;

export const setOptions = (moreOptions: OptionsT) => {
  Object.assign(options, moreOptions);
};
