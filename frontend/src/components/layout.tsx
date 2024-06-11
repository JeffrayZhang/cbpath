import { FC, ReactNode, useMemo } from "react";
import { Button, Layout, Menu, theme, Image } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { googleAuthProvider, signIn, useCurrentUser } from "../lib/firebase";
import { LeftOutlined } from "@ant-design/icons";
import logo from "../logo.svg";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

/**
 * layout component to be used in most (if not all) pages
 */
export const PageLayout = ({ children }: { children: ReactNode }) => {
  const currentUser = useCurrentUser();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{ position: "absolute", left: "2%", height: "inherit" }}
        />
        {!currentUser ? (
          <Button
            type="primary"
            size="large"
            style={{ position: "absolute", right: "2%" }}
            onClick={() => signIn(googleAuthProvider)}
          >
            Sign up{" "}
          </Button>
        ) : (
          <div
            style={{
              position: "absolute",
              right: 24,
              display: "flex",
              flexDirection: "row",
            }}
          >
            {" "}
            <p style={{ color: "white", margin: "15px" }}>Profile Pic</p>{" "}
            <LeftOutlined style={{ color: "white", fontSize: "24px" }} />{" "}
          </div>
        )}{" "}
        {/* //TODO: add profile pic icon and on click of the LeftOutlined icon, add
        a antd "Drawer" component with content menu items "Profile", "My
        Courses", "My Reviews", "Delete Account", "Sign Out" */}
      </Header>

      <Content style={{ padding: "0 48px" }}>
        <div
          className="content-container"
          style={{
            background: colorBgContainer,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        CB Path ©{new Date().getFullYear()} Created by Jeffray Zhang
      </Footer>
    </Layout>
  );
};
