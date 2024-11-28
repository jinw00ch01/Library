import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { loanService } from '../services/api';

const LoanHistory = ({ customerId }) => {
  const [loanHistory, setLoanHistory] = useState([]);

  useEffect(() => {
    fetchLoanHistory();
  }, []);

  const fetchLoanHistory = async () => {
    try {
      const response = await loanService.getLoanHistory(customerId);
      setLoanHistory(response.loans);
    } catch (error) {
      console.error('대출 내역을 불러오는데 실패했습니다:', error);
    }
  };

  const columns = [
    {
      title: '대출 기록 ID',
      dataIndex: 'Borrow_log_ID',
      key: 'Borrow_log_ID',
    },
    {
      title: '도서 ID',
      dataIndex: 'Book_ID',
      key: 'Book_ID',
    },
    {
      title: '반납 여부',
      dataIndex: 'Return_Status',
      key: 'Return_Status',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>대출 내역 조회</h2>
      <Table columns={columns} dataSource={loanHistory} rowKey="Borrow_log_ID" />
    </div>
  );
};

export default LoanHistory; 