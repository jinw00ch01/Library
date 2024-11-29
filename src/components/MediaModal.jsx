import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { mediaService } from '../services/api';
import styled from 'styled-components';

// URL 변환 함수 추가
const convertToEmbedUrl = (url) => {
  const videoId = url.split('v=')[1];
  return `https://www.youtube.com/embed/${videoId}`;
};

const MediaModal = ({ visible, onClose, bookId }) => {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchMediaByBookId();
    }
  }, [visible]);

  const fetchMediaByBookId = async () => {
    try {
      const response = await mediaService.getMediaByBookId(bookId);
      // URL 변환 적용
      const mediasWithEmbedUrl = response.medias.map((media) => ({
        ...media,
        media_link: convertToEmbedUrl(media.media_link),
      }));
      setMediaList(mediasWithEmbedUrl);
    } catch (error) {
      message.error('영상 자료를 불러오는데 실패했습니다.');
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="관련 영상 자료"
      width={800}
    >
      {mediaList.length > 0 ? (
        mediaList.map((media) => (
          <VideoContainer key={media.media_ID}>
            <iframe
              width="560"
              height="315"
              src={media.media_link}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </VideoContainer>
        ))
      ) : (
        <p>관련 영상 자료가 없습니다.</p>
      )}
    </Modal>
  );
};

const VideoContainer = styled.div`
  margin-bottom: 24px;
`;

export default MediaModal; 