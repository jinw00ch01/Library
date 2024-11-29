import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { contentsService } from '../services/api';
import styled from 'styled-components';

const ContentsSearch = () => {
  const [contentsList, setContentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participatedContentsIds, setParticipatedContentsIds] = useState([]);
  const customerId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    fetchContents();
    fetchParticipations();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await contentsService.getAllContents();
      setContentsList(response.contents);
    } catch (error) {
      message.error('콘텐츠 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipations = async () => {
    try {
      const response = await contentsService.getParticipations(customerId);
      const participatedIds = response.participations.map(item => item.Contents_ID);
      setParticipatedContentsIds(participatedIds);
    } catch (error) {
      message.error('참여 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleParticipate = async (contentsId) => {
    try {
      await contentsService.participate(contentsId);
      message.success('콘텐츠에 참여하였습니다.');
      fetchParticipations();
    } catch (error) {
      message.error(error.response?.data?.error || '참여에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '콘텐츠명',
      dataIndex: 'Contents_name',
      key: 'Contents_name',
    },
    {
      title: '도서명',
      dataIndex: 'Book_name',
      key: 'Book_name',
    },
    {
      title: '유형',
      dataIndex: 'Contents_type',
      key: 'Contents_type',
    },
    {
      title: '주최자',
      dataIndex: 'Contents_author',
      key: 'Contents_author',
    },
    {
      title: '행사등록일',
      dataIndex: 'Contents_date',
      key: 'Contents_date',
    },
    {
      title: '상태',
      dataIndex: 'Contents_state',
      key: 'Contents_state',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => {
        const isParticipated = participatedContentsIds.includes(record.Contents_ID);
        return (
          isParticipated ? (
            <span>참여완료</span>
          ) : (
            <Button
              type="primary"
              onClick={() => handleParticipate(record.Contents_ID)}
              disabled={record.Contents_state !== '진행전'}
            >
              참여
            </Button>
          )
        );
      },
    },
  ];

  return (
    <Container>
      <h2>콘텐츠 검색</h2>
      <Table
        columns={columns}
        dataSource={contentsList}
        rowKey="Contents_ID"
        loading={loading}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

export default ContentsSearch; 