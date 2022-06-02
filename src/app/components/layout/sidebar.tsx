import "./sidebar.scss";

export interface Props {
 className: string;
 toggle: () => void;
}

const Sidebar:React.FC<Props> = ({className, toggle}) => {
  return (
    <div className={`${className} sidebar`}>
      <div className="sidebar-header d-flex justify-content-between">
        <div className="sidebar-header-logo"></div>
        <div>helllllllo</div>
        <button onClick={toggle}>click</button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-body-item"></div>
      </div>
    </div>
  );
};

export default Sidebar;