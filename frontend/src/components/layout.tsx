import { FC, ReactNode, useMemo } from "react"
import { Layout, Menu, theme } from 'antd'
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";

const { Header, Content, Footer } = Layout;

const items: ItemType<MenuItemType>[] = [
    {
        key: '/',
        label: <a href='/'>Home</a>,
    },
    {
        key: '/profile',
        label: <a href='/profile'>Profile</a>,
    },
    {
        key: '/signin',
        label: <a href='/signin'>Sign In</a>, // TODO: this should probs be somewhere else
    },
]

/**
 * layout component to be used in most (if not all) pages
 */
export const PageLayout = ({ children }: { children: ReactNode }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Menu
                    theme='dark'
                    mode="horizontal"
                    defaultSelectedKeys={undefined}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
        <Content style={{ padding: '0 48px' }}>
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
        <Footer style={{ textAlign: 'center' }}>
            CB Path ©{new Date().getFullYear()} Created by Jeffray Zhang
        </Footer>
      </Layout>
    )
}
