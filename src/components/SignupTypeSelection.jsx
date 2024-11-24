import React from 'react';
import { Button, Space } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const SignupTypeSelection = ({ onSelect }) => {
  return (
    <SelectionContainer>
      <h3>회원 유형을 선택해주세요</h3>
      <Space direction="vertical" size="large">
        <SelectionButton 
          icon={<UserOutlined />}
          onClick={() => onSelect('customer')}
          size="large"
        >
          고객 회원가입
        </SelectionButton>
        <SelectionButton 
          icon={<TeamOutlined />}
          onClick={() => onSelect('staff')}
          size="large"
        >
          직원 등록
        </SelectionButton>
      </Space>
    </SelectionContainer>
  );
};

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  
  h3 {
    margin-bottom: 24px;
    color: #1890ff;
  }
`;

const SelectionButton = styled(Button)`
  width: 200px;
`;

export default SignupTypeSelection; 