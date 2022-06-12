import { lazyLoad } from 'app/routes';

export const LazyChat = lazyLoad(
  () => import('./index'),
  module => module.ChatPage,
);
