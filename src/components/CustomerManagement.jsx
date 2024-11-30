import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';
import LoanHistory from './LoanHistory';
import OverdueHistory from './OverdueHistory';
import CustContParticipationList from './CustContParticipationList';
import CustomerReviewHistory from './CustomerReviewHistory';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCustomers();
      setCustomers(response.customers);
    } catch (error) {
      message.error('고객 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (type, customerId) => {
    setExpandedRows(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [type]: !prev[customerId]?.[type]
      }
    }));
  };

  const columns = [
    {
      title: '고객 ID',
      dataIndex: 'Customer_ID',
      key: 'Customer_ID',
    },
    {
      title: '이름',
      dataIndex: 'Customer_name',
      key: 'Customer_name',
    },
    {
      title: '구분',
      dataIndex: 'Customer_Classification',
      key: 'Customer_Classification',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <ButtonGroup>
          <Button onClick={() => handleExpand('loan', record.Customer_ID)}>
            대출 조회
          </Button>
          <Button onClick={() => handleExpand('overdue', record.Customer_ID)}>
            연체 조회
          </Button>
          <Button onClick={() => handleExpand('contents', record.Customer_ID)}>
            콘텐츠 참여 조회
          </Button>
          <Button onClick={() => handleExpand('review', record.Customer_ID)}>
            리뷰 조회
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const customerId = record.Customer_ID;
    const expandState = expandedRows[customerId] || {};

    return (
      <ExpandedSection>
        {expandState.loan && (
          <Section>
            <h3>대출 내역</h3>
            <LoanHistory customerId={customerId} />
          </Section>
        )}
        {expandState.overdue && (
          <Section>
            <h3>연체 내역</h3>
            <OverdueHistory customerId={customerId} />
          </Section>
        )}
        {expandState.contents && (
          <Section>
            <h3>콘텐츠 참여 내역</h3>
            <CustContParticipationList customerId={customerId} />
          </Section>
        )}
        {expandState.review && (
          <Section>
            <h3>리뷰 내역</h3>
            <CustomerReviewHistory customerId={customerId} />
          </Section>
        )}
      </ExpandedSection>
    );
  };

  return (
    <Container>
      <h2>고객 데이터 관리</h2>
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="Customer_ID"
        loading={loading}
        expandable={{
          expandedRowRender,
          expandRowByClick: false,
          expandedRowKeys: Object.keys(expandedRows).filter(key => 
            Object.values(expandedRows[key]).some(value => value)
          ).map(key => parseInt(key)),
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ExpandedSection = styled.div`
  padding: 16px;
  background-color: #f8f8f8;
`;

const Section = styled.div`
  margin-bottom: 24px;

  h3 {
    margin-bottom: 16px;
    color: #1890ff;
  }
`;

export default CustomerManagement; 