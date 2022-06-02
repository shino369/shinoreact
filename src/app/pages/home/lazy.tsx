import { lazyLoad } from 'app/routes';

export const LazyHome = lazyLoad(
  () => import('./index'),
  module => module.HomePage,
);
