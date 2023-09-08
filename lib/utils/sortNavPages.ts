import { NavPageT } from '../NavHandler';
import { ObjT } from '../utils/types';
import { getOptions } from '../options';

export function sortNavPages(layers: NavPageT[], pathname: string): NavPageT[] {
  type ResultT = {
    layer: NavPageT;
    match: ObjT | undefined;
  };

  let result: ResultT[] = [];
  for (const layer of layers) {
    const match =
      getOptions().matchPath(pathname, {
        path: layer.route,
        strict: false,
      }) ?? undefined;
    result.push({ layer, match });
  }

  const nrMatchingParams = (match: ObjT | undefined) =>
    Object.keys(match?.params ?? {}).length;

  result = Array.prototype.slice.call(result, 0).sort(
    (lhs: ResultT, rhs: ResultT) => {
      const lhsScore = nrMatchingParams(lhs.match);
      const rhsScore = nrMatchingParams(rhs.match);
      return (
        lhsScore > rhsScore || (lhsScore === rhsScore && lhs.match?.isExact)
      );
    }
  );

  return result.map((result: ResultT) => result.layer);
}
