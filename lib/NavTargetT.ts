export type NavTargetT = {
  url: string;
  nav: () => void;
};

export const stubNavTarget = undefined as unknown as NavTargetT;
