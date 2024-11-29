import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { contentsService } from '../services/api';
import styled from 'styled-components';
import dayjs from 'dayjs';

const CustContParticipationList = ({ customerId }) => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      setLoading(true);
      const response = await contentsService.getParticipations(customerId);
      setParticipations(response.participations);
    } catch (error) {
      message.error('콘텐츠 참여 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (contentsId) => {
    try {
      await contentsService.cancelParticipation(customerId, contentsId);
      message.success('참여가 취소되었습니다.');
      fetchParticipations();
    } catch (error) {
      message.error('참여 취소에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '콘텐츠 ID',
      dataIndex: 'Contents_ID',
      key: 'Contents_ID',
    },
    {
      title: '콘텐츠명',
      dataIndex: 'Contents_name',
      key: 'Contents_name',
    },
    {
      title: '도서 ID',
      dataIndex: 'Book_ID',
      key: 'Book_ID',
    },
    {
      title: '도서명',
      dataIndex: 'Book_name',
      key: 'Book_name',
    },
    {
      title: '참여일',
      dataIndex: 'Participation_date',
      key: 'Participation_date',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button type="danger" onClick={() => handleCancel(record.Contents_ID)}>
          취소
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <h2>콘텐츠 참여 내역 조회</h2>
      <Table
        columns={columns}
        dataSource={participations}
        rowKey="Contents_ID"
        loading={loading}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

export default CustContParticipationList; 