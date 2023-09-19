export type OptionsT = {};

export const options: OptionsT = {};

export const getOptions = () => options;

export const setOptions = (moreOptions: OptionsT) => {
  Object.assign(options, moreOptions);
};
