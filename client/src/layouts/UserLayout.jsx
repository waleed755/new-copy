import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider, Grid, Menu, Dropdown } from "antd";
import {
  AiFillPlusSquare,
  AiFillProfile,
  AiOutlineGlobal,
  AiOutlineLock,
  AiOutlineLogout,
} from "react-icons/ai";
import Logo from "../assets/color-logo-black-text.png";
import { useAuth0 } from "@auth0/auth0-react";
import { FiActivity } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { FaRegUser, FaRegBuilding, FaAnchor, FaCompass, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaUsers, FaPlus, FaRegPaperPlane, FaDashcube } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

export const UserLayout = () => {
  const { logout } = useAuth0();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentRole = localStorage.getItem("role");

  const [currentPath, setCurrentPath] = useState(location?.pathname);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Define the items array based on the user's role
  let items = [];

  // Common items accessible to all roles
  const commonItems = [];

  // Add role-specific items
  switch (currentRole) {
    case "Controller":
    case "Admin":
      items = [
        {
          key: "/user-dashboard/dashboard",
          icon: <FaDashcube />,
          label: "Dashboard",
          onClick: () => navigate("/user-dashboard/dashboard"),
        },
        {
          key: "/user-dashboard/customer",
          icon: <FaRegUser />,
          label: "Customers",
          onClick: () => navigate("/user-dashboard/customer"),
        },
        {
          key: "/user-dashboard/branch",
          icon: <FaRegBuilding />,
          label: "Branches",
          onClick: () => navigate("/user-dashboard/branch"),
        },
        {
          key: "/user-dashboard/property",
          icon: <AiOutlineGlobal />,
          label: "Properties",
          onClick: () => navigate("/user-dashboard/property"),
        },
        {
          key: "activities",
          icon: <FiActivity />,
          label: "Activities",
          children: [
            {
              key: "/user-dashboard/add-activities",
              label: "Add New",
              icon: <FaPlus />,
              onClick: () => navigate("/user-dashboard/add-activities"),
            },
            {
              icon: <FaTasks />,
              key: "/user-dashboard/all-activities",
              label: "Show All",
              onClick: () => navigate("/user-dashboard/all-activities"),
            },
          ],
        },
        {
          key: "/user-dashboard/users",
          icon: <BsFillPeopleFill />,
          label: "Users",
          onClick: () => navigate("/user-dashboard/users"),
        },
        {
          key: "/user-dashboard/contracter",
          icon: <FaUsers />,
          label: "Partners",
          onClick: () => navigate("/user-dashboard/contracter"),
        },
        {
          key: "/user-dashboard/reports",
          icon: <TbReportAnalytics />,
          label: "Reports",
          children: [
            {
              key: "/user-dashboard/property-report",
              label: "Property Report",
              icon: <FaRegPaperPlane />,
              onClick: () => navigate("/user-dashboard/property-report"),
            },
            {
              icon: <FaAnchor />,
              key: "/user-dashboard/activity-report",
              label: "Activity Report",
              onClick: () => navigate("/user-dashboard/activity-report"),
            },
          ],
        },
        ...commonItems,
      ];
      break;
    case "Mobile Driver":
      items = [
        {
          key: "/user-dashboard/dashboard",
          icon: <FaDashcube />,
          label: "Dashboard",
          onClick: () => navigate("/user-dashboard/dashboard"),
        },
        {
          key: "activities",
          icon: <FiActivity />,
          label: "Activities",
          children: [
            {
              icon: <FaTasks />,
              key: "/user-dashboard/all-activities",
              label: "Show All",
              onClick: () => navigate("/user-dashboard/all-activities"),
            },
          ],
        },
        ...commonItems,
      ];
      break;
    default:
      items = commonItems;
      break;
  }

  // Function to recursively render menu items
  const renderMenuItems = (menuItems) =>
    menuItems.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key}  title={item.label}>
          {renderMenuItems(item.children)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={() => navigate(item.key)}
        >
          {item.label}
        </Menu.Item>
      )
    );

  const menu = (
    <Menu>
      {screens.md ? (
        <>
          <Menu.Item
            key="/user-dashboard/change-password"
            icon={<AiOutlineLock />}
            onClick={() => navigate("/user-dashboard/change-password")}
          >
            Change Password
          </Menu.Item>
          <Menu.Item
            key="/user-dashboard/user-profile"
            icon={<FaUsers />}
            onClick={() => navigate("/user-dashboard/user-profile")}
          >
            User Profile
          </Menu.Item>
          {currentRole !== 'Mobile Driver' && (
            <Menu.Item
              key="/user-dashboard/company-profile"
              icon={<FaCompass />}
              onClick={() => navigate("/user-dashboard/company-profile")}
            >
              Company Profile
            </Menu.Item>
          )}
          <Menu.Item key="logout" icon={<AiOutlineLogout />} onClick={onLogout}>
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
          {renderMenuItems(items)}
          <Menu.Item
            key="/user-dashboard/change-password"
            icon={<AiOutlineLock />}
            onClick={() => navigate("/user-dashboard/change-password")}
          >
            Change Password
          </Menu.Item>
          <Menu.Item
            key="/user-dashboard/user-profile"
            icon={<FaUsers />}
            onClick={() => navigate("/user-dashboard/user-profile")}
          >
            User Profile
          </Menu.Item>
          {currentRole !== 'Mobile Driver' && (
            <Menu.Item
              key="/user-dashboard/company-profile"
              icon={<FaCompass />}
              onClick={() => navigate("/user-dashboard/company-profile")}
            >
              Company Profile
            </Menu.Item>
          )}
          <Menu.Item key="logout" icon={<AiOutlineLogout />} onClick={onLogout}>
            Logout
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  useEffect(() => {
    if (screens.md) {
      setCollapsed(false); // Open sidebar on medium and larger screens
    } else {
      setCollapsed(true); // Close sidebar on smaller screens
    }
  }, [screens]);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location?.pathname]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            controlHeight: 40,
          },
          Select: {
            controlHeight: 40,
          },
        },
      }}
    >
      <div className="flex flex-col ">
        <div className="bg-white flex items-center justify-between h-20 shadow-md px-5 z-20 fixed top-0 left-0 w-full">
          <img
            src={Logo}
            alt=""
            height={80}
            width={250}
            className="w-[150px] md:w-[250px] pl-2 my-5 md:block"
          />
          <Dropdown className="cursor-pointer" overlay={menu} trigger={["click"]}>
            <a className="ant-dropdown-link flex items-center gap-3" onClick={(e) => e.preventDefault()}>
              <FaUserCircle size={30} />
              <FaChevronDown />
            </a>
          </Dropdown>
        </div>

        {screens.md && (
          <div className="fixed overflow-y-auto no-scrollbar h-full shadow-lg mt-20 py-5">
            <Menu
              className="md:w-[210px] w-[50px] h-screen"
              defaultSelectedKeys={[currentPath]}
              selectedKeys={[currentPath]}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
              items={items}
            />
          </div>
        )}

        <div open={open} className="w-[80%] ml-[20px] md:ml-[250px] mt-20">
          <Outlet />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserLayout;
