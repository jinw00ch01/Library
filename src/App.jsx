import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Modal, Space } from 'antd';
import { BookOutlined, UserOutlined, HomeOutlined, FormOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import CustomerSignupForm from './components/CustomerSignupForm';
import StaffSignupForm from './components/StaffSignupForm';
import SignupTypeSelection from './components/SignupTypeSelection';
import CustomerLoginForm from './components/CustomerLoginForm';
import StaffLoginForm from './components/StaffLoginForm';
import LoginTypeSelection from './components/LoginTypeSelection';
import { authService } from './services/api';
import UserInfoModal from './components/UserInfoModal';
import InfoRegistrationSelection from './components/InfoRegistrationSelection';
import DepartmentRegistrationForm from './components/DepartmentRegistrationForm';
import BookRegistrationForm from './components/BookRegistrationForm';
import ReturnLoRegistrationForm from './components/ReturnLoRegistrationForm';
import CooperationRegistrationForm from './components/CooperationRegistrationForm';
import ContentsRegistrationForm from './components/ContentsRegistrationForm';
import MediaRegistrationForm from './components/MediaRegistrationForm';
import BookManagement from './components/BookManagement';
import DepartmentManagement from './components/DepartmentManagement';
import ReturnLoManagement from './components/ReturnLoManagement';
import CooperationManagement from './components/CooperationManagement';
import SupplyRegistrationForm from './components/SupplyRegistrationForm';
import SupplyManagement from './components/SupplyManagement';
import ContentsManagement from './components/ContentsManagement';
import MediaManagement from './components/MediaManagement';
import LoanProcessing from './components/LoanProcessing';
import LoanHistory from './components/LoanHistory';
import ReturnProcessing from './components/ReturnProcessing';
import BookSearch from './components/BookSearch';
import ReviewReportManagement from './components/ReviewReportManagement';
import ContentsSearch from './components/ContentsSearch';
import CustContParticipationList from './components/CustContParticipationList';

const { Header, Content, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
  margin-right: 40px;
`;

const StyledMenu = styled(Menu)`
  flex-grow: 1;
  display: flex;
  
  .ant-menu-item {
    flex: none;
  }
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

const VerticalMenu = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: fixed;
  top: 64px;
  left: 0;
  width: 200px;
  height: calc(100% - 64px);
  background-color: #f0f2f5;
  padding: 16px;
`;

const ContentArea = styled.div`
  margin-left: 220px;
  padding: 50px;
  background: #fff;
`;

const App = () => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [signupType, setSignupType] = useState(null);
  const [loginType, setLoginType] = useState(null);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isInfoRegVisible, setIsInfoRegVisible] = useState(false);
  const [infoRegType, setInfoRegType] = useState(null);
  const [isBookManageVisible, setIsBookManageVisible] = useState(false);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState('home');

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '홈',
      onClick: () => setCurrentContent('home'),
    },
    ...(user && userType === 'customer'
      ? [
          {
            key: 'searchBooks',
            label: '도서 검색',
            onClick: () => setCurrentContent('searchBooks'),
          },
          {
            key: 'searchContents',
            label: '콘텐츠 검색',
            onClick: () => setCurrentContent('searchContents'),
          },
          {
            key: 'searchMedia',
            label: '영상 검색',
            onClick: () => setCurrentContent('searchMedia'),
          },
        ]
      : user && userType === 'staff'
      ? [
          {
            key: 'loanProcess',
            label: '대출 처리',
            onClick: () => setCurrentContent('loanProcess'),
          },
          {
            key: 'returnProcess',
            label: '반납 처리',
            onClick: () => setCurrentContent('returnProcess'),
          },
        ]
      : []),
  ];

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
    const userWithType = {
      ...userData,
      type: type,
    };
    setUser(userWithType);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userWithType));
    localStorage.setItem('userType', type);
    setIsLoginVisible(false);
    setLoginType(null);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserType(null);
    setCurrentContent('home');
  };

  const handleMenuClick = ({ key }) => {
    if (key === '2' && user && userType === 'staff') {
      setIsBookManageVisible(true);
    } else if (key === '3' && user && userType === 'staff') {
      setIsInfoRegVisible(true);
    }
  };

  const handleInfoRegClose = () => {
    setIsInfoRegVisible(false);
    setInfoRegType(null);
  };

  const handleInfoRegTypeSelect = (type) => {
    setInfoRegType(type);
  };

  const renderInfoRegForm = () => (
    <>
      <InfoRegistrationSelection onSelect={handleInfoRegTypeSelect} />
      {infoRegType && (
        <div style={{ marginTop: '24px' }}>
          {infoRegType === 'department' && <DepartmentRegistrationForm onClose={handleInfoRegClose} />}
          {infoRegType === 'book' && <BookRegistrationForm onClose={handleInfoRegClose} />}
          {infoRegType === 'returnLo' && <ReturnLoRegistrationForm onClose={handleInfoRegClose} />}
          {infoRegType === 'supply' && <CooperationRegistrationForm onClose={handleInfoRegClose} />}
          {infoRegType === 'contents' && <ContentsRegistrationForm onClose={handleInfoRegClose} staffId={user?.id} />}
          {infoRegType === 'media' && <MediaRegistrationForm onClose={handleInfoRegClose} staffId={user?.id} />}
        </div>
      )}
    </>
  );

  const renderUserSection = () => {
    if (user) {
      return (
        <>
          <WelcomeText>
            {user.name}{userType === 'customer' ? '고객' : '직원'}님, 환영합니다!
          </WelcomeText>
          <Button type="text" onClick={() => setIsUserInfoVisible(true)}>
            내 정보
          </Button>
          <Button onClick={handleLogout}>로그아웃</Button>
        </>
      );
    }
    return (
      <>
        <Button type="primary" onClick={handleLoginClick}>
          로그인
        </Button>
        <Button onClick={handleSignupClick}>
          회원가입
        </Button>
      </>
    );
  };

  const staffVerticalMenu = () => (
    <VerticalMenu>
      <Button type="text" onClick={() => setCurrentContent('registerBook')}>신규 도서 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageBook')}>도서 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('registerDepartment')}>신규 부서 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageDepartment')}>부서 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('registerReturnLocation')}>신규 반납장소 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageReturnLocation')}>반납장소 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('registerCooperation')}>신규 공급업체 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageCooperation')}>공급업체 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('registerSupply')}>신규 공급명세 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageSupply')}>공급명세 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('registerContents')}>신규 콘텐츠 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageContents')}>콘텐츠 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('registerMedia')}>신규 영상자료 등록</Button>
      <Button type="text" onClick={() => setCurrentContent('manageMedia')}>영상자료 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('manageCustomers')}>고객 데이터 관리</Button>
      <Button type="text" onClick={() => setCurrentContent('manageReviews')}>리뷰 신고 관리</Button>
    </VerticalMenu>
  );

  const customerVerticalMenu = () => (
    <VerticalMenu>
      <Button type="text" onClick={() => setCurrentContent('viewLoanHistory')}>대출 내역 조회</Button>
      <Button type="text" onClick={() => setCurrentContent('viewParticipations')}>콘텐츠 참여 내역 조회</Button>
      <Button type="text" onClick={() => setCurrentContent('viewOverdueHistory')}>연체 내역 조회</Button>
      <Button type="text" onClick={() => setCurrentContent('viewReservations')}>예약 조회</Button>
    </VerticalMenu>
  );

  return (
    <StyledLayout>
      <StyledHeader>
        <LeftSection>
          <Logo>도서 관리 시스템</Logo>
          <StyledMenu mode="horizontal" selectedKeys={[]} items={menuItems} />
        </LeftSection>
        <RightSection>
          {renderUserSection()}
        </RightSection>
      </StyledHeader>

      {user && userType === 'staff' && staffVerticalMenu()}
      {user && userType === 'customer' && customerVerticalMenu()}

      <ContentArea>
        {currentContent === 'home' && (
          <WelcomeSection>
            <h1>도서관에 오신 것을 환영합니다</h1>
            <p>다양한 도서를 검색하고 관리할 수 있습니다.</p>
          </WelcomeSection>
        )}
        {currentContent === 'registerBook' && <BookRegistrationForm />}
        {currentContent === 'manageBook' && <BookManagement />}
        {currentContent === 'infoRegistration' && renderInfoRegForm()}
        {currentContent === 'registerDepartment' && <DepartmentRegistrationForm />}
        {currentContent === 'manageDepartment' && <DepartmentManagement />}
        {currentContent === 'registerReturnLocation' && <ReturnLoRegistrationForm />}
        {currentContent === 'manageReturnLocation' && <ReturnLoManagement />}
        {currentContent === 'registerCooperation' && <CooperationRegistrationForm />}
        {currentContent === 'manageCooperation' && <CooperationManagement />}
        {currentContent === 'registerSupply' && <SupplyRegistrationForm staffId={user?.id} />}
        {currentContent === 'manageSupply' && <SupplyManagement />}
        {currentContent === 'registerContents' && <ContentsRegistrationForm staffId={user?.id} />}
        {currentContent === 'manageContents' && <ContentsManagement />}
        {currentContent === 'registerMedia' && <MediaRegistrationForm staffId={user?.id} />}
        {currentContent === 'manageMedia' && <MediaManagement />}
        {currentContent === 'loanProcess' && <LoanProcessing staffId={user?.id} />}
        {currentContent === 'returnProcess' && <ReturnProcessing staffId={user?.id} />}
        {currentContent === 'viewLoanHistory' && <LoanHistory customerId={user?.id} />}
        {currentContent === 'searchBooks' && <BookSearch />}
        {currentContent === 'searchContents' && <ContentsSearch />}
        {currentContent === 'viewParticipations' && <CustContParticipationList customerId={user?.id} />}
        {currentContent === 'manageReviews' && <ReviewReportManagement />}
      </ContentArea>

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
        visible={isUserInfoVisible}
        onClose={() => setIsUserInfoVisible(false)}
        userType={userType}
        userId={user?.id}
        onLogout={handleLogout}
      />

      <StyledFooter>
        도서관 관리 시스템 ©{new Date().getFullYear()} Created by TEAM1
      </StyledFooter>
    </StyledLayout>
  );
};

const WelcomeText = styled.span`
  color: #1890ff;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const LoginButton = styled(Button)``;

const getModalTitle = (type) => {
  const titles = {
    department: '신규 부서 등록',
    book: '신규 도서 등록',
    returnLo: '신규 반납 장소 등록',
    supply: '신규 공급업체 등록',
    contents: '신규 콘텐츠 등록',
    media: '신규 영상 자료 등록'
  };
  return titles[type] || '정보 등록';
};

export default App;
