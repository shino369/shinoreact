// import { Redirect } from 'react-router-dom';

import { LazyAbout, LazyDetail, LazyHome } from "app/pages";

interface Route {
  name: string;
  group: string;
  path: string;
  component: any;
  exact?: boolean;
}
const userRoutes: Route[] = [
  { name: "home", group: '', path: "/", component: <LazyHome /> },
  { name: "about me", group:'', path: "/about", component: <LazyAbout /> },
  { name: "detail 2", group:'b', path: "/detail2", component: <LazyDetail /> },
  { name: "detail 3", group:'b', path: "/detail3", component: <LazyDetail /> },
  { name: "detail 4", group:'c', path: "/detail4", component: <LazyDetail /> },
  { name: "detail 5", group:'c', path: "/detail5", component: <LazyDetail /> },
];

interface GroupRoutes {
  [key: string]: Route[];
}

const getGroupRoutes = () => {
  const group:string[] = userRoutes.filter(f=> f.group.length > 0).map((route) => (route.group)).filter((v, i, a) => a.indexOf(v) === i)
  const _groupRoutes:GroupRoutes = {}
  group.forEach((g:string) => {
    _groupRoutes[g] = userRoutes.filter((f:any)=> f.group===g)
  })

  return _groupRoutes
}

const groupRoutes = getGroupRoutes()

const authRoutes: Route[] = [
  //   { path: '/logout', component: LogoutPage },
  //   { path: '/login', component: LoginPage },
  //   { path: '/notFound', component: NotFoundPage },
];

export { userRoutes, authRoutes, groupRoutes };
