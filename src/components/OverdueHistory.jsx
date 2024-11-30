import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { overdueService } from '../services/api';
import dayjs from 'dayjs';

const OverdueHistory = ({ customerId }) => {
  const [overdueHistory, setOverdueHistory] = useState([]);

  useEffect(() => {
    fetchOverdueHistory();
  }, [customerId]);

  const fetchOverdueHistory = async () => {
    try {
      const response = await overdueService.getOverdueHistory(customerId);
      console.log('연체 내역:', response);
      if (response.success) {
        setOverdueHistory(response.overdues);
      } else {
        console.error('연체 내역 조회 실패:', response);
        message.error('연체 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('연체 내역 조회 에러:', error);
      message.error('연체 내역을 불러오는데 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '대출연체현황ID',
      dataIndex: 'Current_Status_ID',
      key: 'Current_Status_ID',
      width: 150,
    },
    {
      title: '도서 ID',
      dataIndex: 'Book_ID',
      key: 'Book_ID',
      width: 100,
    },
    {
      title: '도서명',
      dataIndex: 'Book_name',
      key: 'Book_name',
      width: 200,
    },
    {
      title: '연체 시작일시',
      dataIndex: 'Overdue_starttime',
      key: 'Overdue_starttime',
      width: 180,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '연체 종료일시',
      dataIndex: 'Overdue_endtime',
      key: 'Overdue_endtime',
      width: 180,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>연체 내역 조회</h2>
      <Table 
        columns={columns} 
        dataSource={overdueHistory} 
        rowKey="Current_Status_ID"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default OverdueHistory; 