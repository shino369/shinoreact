// import { Redirect } from 'react-router-dom';

import { LazyAbout, LazyDetail, LazyHome, LazyProjectDetail } from "app/pages";
import { Navigate  } from 'react-router-dom';
interface Route {
  name: string;
  icon: string;
  group: string;
  path: string;
  component: any;
  exact?: boolean;
  children?: Route[];
}
const userRoutes: Route[] = [
  { name: "home", icon: "house-fill", group: "", path: "/", component: <LazyHome /> },
  {
    name: "about me",
    icon: "chat-fill",
    group: "",
    path: "/about",
    component: <LazyAbout />,
  },
  {
    name: "Project Detail",
    icon: "",
    group: "hidden",
    path: "/project/:id",
    component: <LazyProjectDetail />,
  },
  {
    name: "detail 3",
    icon: "",
    group: "Protected",
    path: "/detail3",
    component: <LazyDetail />,
  },
  {
    name: "detail 4",
    icon: "",
    group: "c",
    path: "/detail4",
    component: <LazyDetail />,
  },
  {
    name: "detail 5",
    icon: "",
    group: "c",
    path: "/detail5",
    component: <LazyDetail />,
  },

  // 404
  {
    name: "404",
    icon: "",
    group: "hidden",
    path: '*',
    component: <Navigate to="/" replace={true} />,
  },
];

interface GroupRoutes {
  [key: string]: Route[];
}

const getGroupRoutes = () => {
  const group: string[] = userRoutes
    .filter((f) => f.group.length > 0)
    .map((route) => route.group)
    .filter((v, i, a) => a.indexOf(v) === i);
  const _groupRoutes: GroupRoutes = {};
  group.forEach((g: string) => {
    _groupRoutes[g] = userRoutes.filter((f: any) => f.group === g);
  });

  return _groupRoutes;
};

const groupRoutes = getGroupRoutes();

const authRoutes: Route[] = [
  //   { path: '/logout', component: LogoutPage },
  //   { path: '/login', component: LoginPage },
  //   { path: '/notFound', component: NotFoundPage },
];

export { userRoutes, authRoutes, groupRoutes };
