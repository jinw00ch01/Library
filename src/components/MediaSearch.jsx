import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { mediaService } from '../services/api';
import styled from 'styled-components';
import dayjs from 'dayjs';

const MediaSearch = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await mediaService.getAllMedia();
      setMediaList(response.medias);
    } catch (error) {
      message.error('영상 자료를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
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
      title: '영상',
      dataIndex: 'media_link',
      key: 'media_link',
      render: (text) => (
        <iframe
          width="560"
          height="315"
          src={text}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ),
    },
    {
      title: '등록일',
      dataIndex: 'media_date',
      key: 'media_date',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
  ];

  return (
    <Container>
      <h2>영상 자료 검색</h2>
      <Table
        columns={columns}
        dataSource={mediaList}
        rowKey="media_ID"
        loading={loading}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

export default MediaSearch; 