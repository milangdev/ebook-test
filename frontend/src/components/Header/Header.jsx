import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { StyledHeader, StyledTitle } from "./elements";
import { avatar, getUserFromCookies } from "../../services/utils";

export const Header = () => {
  const navigate = useNavigate();
  const user = getUserFromCookies();

  const logoutHandler = () => {
    Cookies.remove("user");
    navigate("/login");
  };

  return (
    <StyledHeader>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <StyledTitle to={"/"}>Ebook Platform</StyledTitle>
        <div style={{ display: "flex" }}>
          <Avatar
            size={38}
            icon={
              user ? <UserLoginIcon name={user?.username} /> : <UserOutlined />
            }
            style={{
              color: "white",
              backgroundColor: "rgb(255 255 255 / 53%)",
              marginRight: "18px",
            }}
          />
          <LogoutOutlined
            style={{ color: "white" }}
            onClick={() => logoutHandler()}
          />
        </div>
      </div>
    </StyledHeader>
  );
};

const UserLoginIcon = ({ name }) => {
  return <div className="user-login-icon">{avatar(name)}</div>;
};
