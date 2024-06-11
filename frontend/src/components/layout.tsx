import { FC, ReactNode, useEffect, useMemo } from "react";
import { Button, Layout, Menu, theme, Image, Input } from "antd";
import { googleAuthProvider, signIn, useCurrentUser } from "../lib/firebase";
import { LeftOutlined } from "@ant-design/icons";
import {
  RouterProvider,
  useLocation,
  type createBrowserRouter,
} from "react-router-dom";

const { Header, Content, Footer } = Layout;

type Router = ReturnType<typeof createBrowserRouter>;

/**
 * layout component to be used in most (if not all) pages
 */
export const PageLayout = ({
  children,
  router,
}: {
  children: ReactNode;
  router: Router;
}) => {
  const currentUser = useCurrentUser();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const onSearch = (value: string, _e: any) =>
    window.location.replace(`/course/${value}`);
  console.log(window.location.pathname);
  const { Search } = Input;

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="logo" onClick={() => window.location.replace("/")} />
        {window.location.pathname !== "/" ? (
          <Search
            placeholder="Course Code"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            style={{ padding: "10px" }}
          />
        ) : null}
        {!currentUser ? (
          <Button
            type="primary"
            size="large"
            style={{ position: "relative", marginLeft: "auto", right: 0 }}
            onClick={() => signIn(googleAuthProvider)}
          >
            Sign up{" "}
          </Button>
        ) : (
          <div
            style={{
              position: "relative",
              marginLeft: "auto",
              right: 0,
              display: "flex",
              flexDirection: "row",
            }}
          >
            {" "}
            <p style={{ color: "white", margin: "15px" }}>Profile</p>{" "}
            <LeftOutlined style={{ color: "white", fontSize: "24px" }} />{" "}
          </div>
        )}{" "}
        {/* //TODO: add profile pic icon and on click of the LeftOutlined icon, add
        a antd "Drawer" component with content menu items "Profile", "My
        Courses", "My Reviews", "Delete Account", "Sign Out" */}
      </Header>

      <Content>
        <div
          className="content-container"
          style={{
            background: colorBgContainer,
            padding: 24,
            borderRadius: borderRadiusLG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        CB Path ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
