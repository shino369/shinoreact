import { lazyLoad } from 'app/routes';

export const LazyProjectDetail = lazyLoad(
  () => import('./index'),
  module => module.ProjectDetailPage,
);
