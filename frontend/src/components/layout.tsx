import { FC, ReactNode, useEffect, useMemo, useState } from "react"
import { Button, Layout, Menu, theme, Image, Input, Drawer } from "antd"
import {
  googleAuthProvider,
  signIn,
  useCurrentUser,
  signOut,
  deleteUser,
  authenticatedApiRequest,
} from "../lib/firebase"
import { LeftOutlined } from "@ant-design/icons"
import { RouterProvider, useLocation, type createBrowserRouter } from "react-router-dom"
import ConfirmModal from "./confirm-modal"

const { Header, Content, Footer } = Layout

type Router = ReturnType<typeof createBrowserRouter>

export const PageLayout = ({ children, router }: { children: ReactNode; router: Router }) => {
  const currentUser = useCurrentUser()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const onSearch = (value: string, _e: any) => window.location.replace(`/course/${value}`)
  console.log(window.location.pathname)
  const { Search } = Input

  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

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
            <LeftOutlined style={{ color: "white", fontSize: "24px" }} onClick={showDrawer} />
            <Drawer placement="right" onClose={onClose} open={open}>
              <Menu theme="light" mode="inline">
                <Menu.Item
                  key="profile"
                  onClick={() => window.location.replace("/profile")}
                  style={{ fontWeight: "bold", fontSize: "24px" }}
                >
                  Profile
                </Menu.Item>
              </Menu>
              <div style={{ position: "absolute", bottom: "24px", width: "87%" }}>
                <Menu theme="light" mode="inline" style={{ textAlign: "center" }}>
                  <Menu.Item
                    style={{ fontWeight: "bold", fontSize: "20px" }}
                    key="sign-out"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Menu.Item>
                  <Menu.Item
                    key="delete"
                    style={{ color: "red", fontSize: "16px" }}
                    onClick={() =>
                      ConfirmModal(
                        "Are you sure?",
                        "By deleting your account under " +
                          currentUser.email +
                          ", all data, including your course reviews, will be deleted as well. \n \n This action cannot be undone.",
                        () => {
                          authenticatedApiRequest("DELETE", "/user/delete")
                          deleteUser()
                        }
                      )
                    }
                  >
                    Delete Account
                  </Menu.Item>
                </Menu>
              </div>
            </Drawer>
          </div>
        )}{" "}
      </Header>

      <Content>
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
        CB Path ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}
