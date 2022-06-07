export interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  detail?: string;
  external: string;
  techStack: string[];
  icon: string;
  images: string[];
}

export const projectDetail: ProjectDetail[] = [
  {
    id: 1,
    name: "3Tech OwlEye",
    description:
      "OwlEye Smart Control and Monitoring System. Designed to monitor equipment at telecom tower sites remotely.",
    detail:
      "OwlEye Smart Control and Monitoring System. Designed to monitor equipment at telecom tower sites remotely, OwlEye modular system is capable of controlling all kinds of passive infrastructure devices, from diesel generator sets, rectifiers, solar panels, air-conditioning, batteries, access control, security CCTV and more. The high-performance system also supports data capturing and transmission, video and remote control functions.",
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
    icon: require("app/assets/images/3tech.jpg"),
    images: [
      require("app/assets/images/3tech/1.jpg"),
      require("app/assets/images/3tech/2.jpg"),
      require("app/assets/images/3tech/3.jpg"),
      require("app/assets/images/3tech/4.jpg"),
      require("app/assets/images/3tech/5.jpg"),  
    ],
  },
  // {
  //   id: 2,
  //   name: "The Hong Kong Club Library System (revamp)",
  //   description:
  //     "Revamping the Hong Kong Club Library System by implementing online cms(admin) and online items borrowing(user).",
  //   detail:"Revamping the Hong Kong Club Library System from machine based to a online accessible system. The system is designed to provide a more convenient and efficient way for users to borrow and return items through a online user interface and manage contents and rules through an admin panel.",
  //   external: "https://www.thehongkongclub.hk/public/library.html",
  //   techStack: ["typescript", "javascript", "angular", "rxjs"],
  //   icon: require("app/assets/images/hkcl.jpg"),
  //   images: [
  //     require("app/assets/images/hkc/1.jpg"),
  //     require("app/assets/images/hkc/2.jpg"),
  //     require("app/assets/images/hkc/3.jpg"),
  //     require("app/assets/images/hkc/4.jpg"),
  //   ],
  // },
  // {
  //   id: 3,
  //   name: "賽馬會「照顧達人」計劃 (Jockey Club All Brilliant Carers Project) mobile app",
  //   description:
  //     "Mobile application which provides functionality for newsfeeding, elderly jobs finding and events registration.",
  //   detail:"Mobile application which provides functionality for newsfeeding, elderly jobs finding and events registration.",
  //   external: "https://carer.org.hk/",
  //   techStack: [
  //     "typescript",
  //     "javascript",
  //     "react native",
  //     "redux",
  //     "react-navigation",
  //     "react-hook-form",
  //     "ajax",
  //   ],
  //   icon: require("app/assets/images/jcabc.jpg"),
  //   images: [],
  // },
  // {
  //   id: 4,
  //   name: "JDC Lab 創飾平台 mobile app",
  //   description:
  //     "Mobile application which provides functionality for newsfeeding, ordering and purchasing customized jewellery.",
  //   detail:"Mobile application which provides functionality for newsfeeding, ordering and purchasing customized jewellery.",
  //   external: "https://jdclab.com/",
  //   techStack: [
  //     "typescript",
  //     "javascript",
  //     "react native",
  //     "redux",
  //     "react-navigation",
  //     "react-hook-form",
  //     "ajax",
  //   ],
  //   icon: require("app/assets/images/jdclab.jpg"),
  //   images: [],
  // },
];
