
// import { Redirect } from 'react-router-dom';

import { LazyDetail, LazyHome } from "app/pages";

interface Route {
  path: string;
  component: any;
  exact?: boolean;
}
const userRoutes: Route[] = [
  { path: '/home', component: <LazyHome /> },
  { path: '/home/detail', component: <LazyDetail/> },
];

const authRoutes: Route[] = [
//   { path: '/logout', component: LogoutPage },
//   { path: '/login', component: LoginPage },
//   { path: '/notFound', component: NotFoundPage },
];

export { userRoutes, authRoutes };
