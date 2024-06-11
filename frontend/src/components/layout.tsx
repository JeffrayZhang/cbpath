import { FC, ReactNode, useMemo } from "react";
import { Button, Layout, Menu, theme, Image } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { googleAuthProvider, signIn, useCurrentUser } from "../lib/firebase";
import { LeftOutlined } from "@ant-design/icons";
import logo from "../logo.svg";

const { Header, Content, Footer } = Layout;

/**
 * layout component to be used in most (if not all) pages
 */
export const PageLayout = ({ children }: { children: ReactNode }) => {
  const currentUser = useCurrentUser();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // const items: ItemType<MenuItemType>[] = [
  //     {
  //         key: '/',
  //         label: <a href='/'>Home</a>,
  //     },
  //     // {
  //     //     key: '/signin',
  //     //     label: <a href='/signin'>Sign In</a>, // TODO: remove this
  //     // },
  // ]

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{ position: "absolute", left: 24, height: "inherit" }}
        />
        {/* <Menu
                    theme='dark'
                    mode="horizontal"
                    defaultSelectedKeys={undefined}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                /> */}
        {!currentUser ? (
          <Button
            type="primary"
            size="large"
            style={{ position: "absolute", right: 24 }}
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
          style={{
            background: colorBgContainer,
            minHeight: 280,
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
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        CB Path ©{new Date().getFullYear()} Created by Jeffray Zhang
      </Footer>
    </Layout>
  );
};
