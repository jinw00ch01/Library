import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import { BookOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import CustomerSignupForm from './components/CustomerSignupForm';
import StaffSignupForm from './components/StaffSignupForm';
import SignupTypeSelection from './components/SignupTypeSelection';
import CustomerLoginForm from './components/CustomerLoginForm';
import StaffLoginForm from './components/StaffLoginForm';
import LoginTypeSelection from './components/LoginTypeSelection';
import { authService } from './services/api';
import UserInfoModal from './components/UserInfoModal';

const { Header, Content, Footer } = Layout;

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
  color: #1890ff;
  margin-right: 40px;
`;

const StyledMenu = styled(Menu)`
  flex: 1;
`;

const SignupButton = styled(Button)`
  margin-left: auto;
`;

const StyledContent = styled(Content)`
  padding: 50px;
  background: #fff;
`;

const WelcomeSection = styled.div`
  text-align: center;
  padding: 48px 0;
  
  h1 {
    font-size: 32px;
    margin-bottom: 16px;
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

const App = () => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [signupType, setSignupType] = useState(null);
  const [loginType, setLoginType] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
  }, []);

  const handleSignupClick = () => {
    setIsSignupVisible(true);
    setSignupType(null);
  };

  const handleLoginClick = () => {
    setIsLoginVisible(true);
    setLoginType(null);
  };

  const handleClose = () => {
    setIsSignupVisible(false);
    setIsLoginVisible(false);
    setSignupType(null);
    setLoginType(null);
  };

  const handleLoginSuccess = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
    setIsLoginVisible(false);
    setLoginType(null);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserType(null);
  };

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: '홈'
    },
    {
      key: '2',
      icon: <BookOutlined />,
      label: '도서 목록'
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: '회원 관리'
    }
  ];

  return (
    <StyledLayout>
      <StyledHeader>
        <Logo>도서관 관리 시스템</Logo>
        <StyledMenu mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
        <ButtonGroup>
          {user ? (
            <>
              <WelcomeText>
                {user.infoId}{userType === 'staff' ? '직원' : '고객'}님, 환영합니다!
              </WelcomeText>
              <Button onClick={() => setShowUserInfo(true)}>
                개인정보 조회
              </Button>
              <Button onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <LoginButton onClick={handleLoginClick}>
                로그인
              </LoginButton>
              <SignupButton onClick={handleSignupClick}>
                회원가입
              </SignupButton>
            </>
          )}
        </ButtonGroup>
      </StyledHeader>
      
      <StyledContent>
        <WelcomeSection>
          <h1>도서관에 오신 것을 환영합니다</h1>
          <p>다양한 도서를 검색하고 관리할 수 있습니다.</p>
        </WelcomeSection>
      </StyledContent>

      <Modal
        title="회원가입"
        open={isSignupVisible}
        onCancel={handleClose}
        footer={null}
        width={500}
      >
        {!signupType ? (
          <SignupTypeSelection onSelect={setSignupType} />
        ) : signupType === 'customer' ? (
          <CustomerSignupForm onClose={handleClose} />
        ) : (
          <StaffSignupForm onClose={handleClose} />
        )}
      </Modal>

      <Modal
        title="로그인"
        open={isLoginVisible}
        onCancel={handleClose}
        footer={null}
        width={500}
      >
        {!loginType ? (
          <LoginTypeSelection onSelect={setLoginType} />
        ) : loginType === 'customer' ? (
          <CustomerLoginForm onClose={handleClose} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <StaffLoginForm onClose={handleClose} onLoginSuccess={handleLoginSuccess} />
        )}
      </Modal>

      <UserInfoModal
        visible={showUserInfo}
        onClose={() => setShowUserInfo(false)}
        userType={userType}
        userId={user?.id}
      />

      <StyledFooter>
        도서관 관리 시스템 ©{new Date().getFullYear()} Created by TEAM1
      </StyledFooter>
    </StyledLayout>
  );
};

const WelcomeText = styled.span`
  margin-right: 16px;
  color: #1890ff;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const LoginButton = styled(Button)``;

export default App;
