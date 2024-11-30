import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { loanService } from '../services/api';
import dayjs from 'dayjs';

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
      title: '도서 이름',
      dataIndex: 'Book_name',
      key: 'Book_name',
    },
    {
      title: '반납 여부',
      dataIndex: 'Return_Status',
      key: 'Return_Status',
    },
    {
      title: '대출일',
      dataIndex: 'borrow_Date',
      key: 'borrow_Date',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '대출 만기일',
      dataIndex: 'loan_due_date',
      key: 'loan_due_date',
      render: (_, record) => {
        const borrowDate = record.borrow_Date ? dayjs(record.borrow_Date) : null;
        const dueDate = borrowDate ? borrowDate.add(10, 'minute') : null;
        return dueDate ? dueDate.format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '반납일',
      dataIndex: 'Return_date',
      key: 'Return_date',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
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