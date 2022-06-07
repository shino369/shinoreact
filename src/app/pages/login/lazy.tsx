import { lazyLoad } from 'app/routes';

export const LazyLogin = lazyLoad(
  () => import('./index'),
  module => module.LoginPage,
);
