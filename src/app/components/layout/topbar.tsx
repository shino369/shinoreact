import Hamburger from "hamburger-react";

// style
import "./topbar.scss";
// import { useLocation } from "react-router-dom";
import React from "react";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../icon/icon";
import { async } from "rxjs";
import { getAuth } from "firebase/auth";
import { setAuthenticated, setUser } from "store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmDialog } from "..";

export interface Props {
  className?: string;
  styles?: any;
  isCollapsed: boolean;
  toggle: () => void;
}

const Topbar: React.FC<Props> = ({
  className,
  styles,
  isCollapsed,
  toggle,
}: Props) => {
  // let location = useLocation();
  // const [recent, setRecent] = React.useState<string>();
  const { activeRoute } = useSelector(
    (rootState: RootState) => rootState.activeRoute
  );
  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const navigation = useNavigate();

  const handleLogout = async () => {
    console.log("logout");
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        dispatch(setAuthenticated(false));
        dispatch(setUser(null));
        localStorage.clear();

        // redirect to home
        navigation("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });

    handleClose();
  };

  return (
    <div
      className={`d-flex w-100 topbar align-items-center transition ${
        isCollapsed ? "ps-5rem" : "ps-20rem"
      }`}
    >
      <div className={``}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
      <div className="current ms-2">{activeRoute.toUpperCase()}</div>

      <div className="d-flex justify-content-end align-items-center position-absolute end-0">
        {user && (
          <>
            <img style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              marginRight: "0.5rem",
            }} src={user.photoURL || ""} className="avatar" alt="" />
            <div>{user?.displayName}</div>
            <div className="mx-2">{"|"}</div>
            <div className="pointer me-2" onClick={handleClickOpen}>
              logout
            </div>
          </>
        )}
        {[
          { name: "github", url: "https://github.com/shino369" },
          { name: "linkedin", url: "https://www.linkedin.com/in/aw3939" },
          { name: "whatsapp", url: "https://wa.me/85252362806" },
          { name: "email", url: "mailto:anthonywong3939@gmail.com" },
        ].map((icon, index) => (
          <Icon
            button
            btnClassName="px-2 hover-opacity"
            onClick={() => {
              window.open(icon.url, "_blank");
            }}
            key={index}
            extname="png"
            name={icon.name}
            size={24}
            color={"white"}
          />
        ))}
      </div>
      <ConfirmDialog
        title={"Logout?"}
        message={"Are you sure yoou want to logout?"}
        onConfirm={() => {
          handleLogout();
        }}
        onCancel={() => {
          handleClose();
        }}
        open={open}
      />
    </div>
  );
};

export default Topbar;
