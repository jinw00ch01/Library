import React from 'react';
import { Button, Space } from 'antd';
import { 
  BankOutlined, 
  BookOutlined, 
  EnvironmentOutlined,
  ShopOutlined,
  FileTextOutlined,
  VideoCameraOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';

const InfoRegistrationSelection = ({ onSelect }) => {
  return (
    <SelectionContainer>
      <h3>등록할 정보 유형을 선택해주세요</h3>
      <Space direction="vertical" size="large">
        <SelectionButton 
          icon={<BankOutlined />}
          onClick={() => onSelect('department')}
          size="large"
        >
          신규 부서 등록
        </SelectionButton>
        <SelectionButton 
          icon={<BookOutlined />}
          onClick={() => onSelect('book')}
          size="large"
        >
          신규 도서 등록
        </SelectionButton>
        <SelectionButton 
          icon={<EnvironmentOutlined />}
          onClick={() => onSelect('returnLo')}
          size="large"
        >
          신규 반납 장소 등록
        </SelectionButton>
        <SelectionButton 
          icon={<ShopOutlined />}
          onClick={() => onSelect('supply')}
          size="large"
        >
          신규 공급업체 등록
        </SelectionButton>
        <SelectionButton 
          icon={<FileTextOutlined />}
          onClick={() => onSelect('contents')}
          size="large"
        >
          신규 콘텐츠 등록
        </SelectionButton>
        <SelectionButton 
          icon={<VideoCameraOutlined />}
          onClick={() => onSelect('media')}
          size="large"
        >
          신규 영상 자료 등록
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

export default InfoRegistrationSelection; 