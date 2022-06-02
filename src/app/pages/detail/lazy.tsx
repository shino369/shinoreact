import { lazyLoad } from 'app/routes';

export const LazyDetail = lazyLoad(
  () => import('./index'),
  module => module.DetailPage,
);
