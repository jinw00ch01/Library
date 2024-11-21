import { Layout, Menu } from 'antd';
import { BookOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <StyledLayout>
      <StyledHeader>
        <Logo>도서관 관리 시스템</Logo>
        <StyledMenu mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            홈
          </Menu.Item>
          <Menu.Item key="2" icon={<BookOutlined />}>
            도서 목록
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            회원 관리
          </Menu.Item>
        </StyledMenu>
      </StyledHeader>
      
      <StyledContent>
        <WelcomeSection>
          <h1>도서관에 오신 것을 환영합니다</h1>
          <p>다양한 도서를 검색하고 관리할 수 있습니다.</p>
        </WelcomeSection>
      </StyledContent>

      <StyledFooter>
        도서관 관리 시스템 ©{new Date().getFullYear()} Created by TEAM1
      </StyledFooter>
    </StyledLayout>
  );
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: #1890ff;
`;

const StyledMenu = styled(Menu)`
  flex: 1;
  border-bottom: none;
`;

const StyledContent = styled(Content)`
  padding: 50px;
  background: #f0f2f5;
`;

const WelcomeSection = styled.div`
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h1 {
    color: #1890ff;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    color: #666;
  }
`;

const StyledFooter = styled(Footer)`
  text-align: center;
  background: #f0f2f5;
`;

export default App;
