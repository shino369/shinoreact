import { lazyLoad } from 'app/routes';

export const LazyAbout = lazyLoad(
  () => import('./index'),
  module => module.AboutPage,
);
