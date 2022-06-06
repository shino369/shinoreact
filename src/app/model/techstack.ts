export const techstach: TechStack = {
  languages: ["typescript", "javascript", "java", "c++"],
  frameworks: [
    "react (hook)",
    "react native",
    "angular",
    "springboot",
    "J2EE(Servlet)",
    "mybatis plus",
  ],
  libraries: [
    "redux",
    "rxjs",
    "ajax",
    "react-router",
    "react-navigation",
    "react-hook-form",
  ],
  databases: ["ms sql server", "postgresql"],
};

export type Categories = "languages" | "frameworks" | "libraries" | "databases";

export type TechStack = {
  [key in Categories]: string[];
};

export interface Project {
  id: number;
  name: string;
  description: string;
  external: string;
  techStack: string[];
}

export const project: Project[] = [
  {
    name: "3Tech OwlEye",
    id: 1,
    description:
      "OwlEye Smart Control and Monitoring System.Designed to monitor equipment at telecom tower sites remotely, OwlEye modular system is capable of controlling all kinds of passive infrastructure devices, from diesel generator sets, rectifiers, solar panels, air-conditioning, batteries, access control, security CCTV and more. The high-performance system also supports data capturing and transmission, video and remote control functions.",
    external: "https://www.3tech.net/index.php?c=category&id=8",
    techStack: [
      "typescript",
      "javascript",
      "angular",
      "rxjs",
      "java",
      "springboot",
      "mybatis plus",
      "postgresql",
    ],
  },
  {
    id: 2,
    name: "The Hong Kong Club Library System (revamp)",
    description:
      "revamp the Hong Kong Club Library System by implementing online cms(admin) and online items borrowing(user).",
    external: "https://www.thehongkongclub.hk/public/library.html",
    techStack: ["typescript", "javascript", "angular", "rxjs"],
  },
  {
    id: 3,
    name: "賽馬會「照顧達人」計劃 (Jockey Club All Brilliant Carers Project) mobile app",
    description:
      "provide functions for newsfeed, elderly jobs finding and events registration.",
    external: "https://carer.org.hk/",
    techStack: [
      "typescript",
      "javascript",
      "react native",
      "redux",
      "react-navigation",
      "react-hook-form",
      "ajax",
    ],
  },
  {
    id: 4,
    name: "JDC Lab 創飾平台 mobile app",
    description:
      "provide functions for newsfeed, ordering and purchasing customized jewellery.",
    external: "https://jdclab.com/",
    techStack: [
      "typescript",
      "javascript",
      "react native",
      "redux",
      "react-navigation",
      "react-hook-form",
      "ajax",
    ],
  },
];
