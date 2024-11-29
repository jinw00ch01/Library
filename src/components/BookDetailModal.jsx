import React from 'react';
import { Modal, Descriptions } from 'antd';
import dayjs from 'dayjs';

const BookDetailModal = ({ visible, onClose, book }) => {
  return (
    <Modal visible={visible} onCancel={onClose} footer={null} title="도서 상세 정보">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="도서명">{book.Book_name}</Descriptions.Item>
        <Descriptions.Item label="출판사">{book.Book_publisher}</Descriptions.Item>
        <Descriptions.Item label="저자">{book.Book_author}</Descriptions.Item>
        <Descriptions.Item label="장르">{book.Book_genre}</Descriptions.Item>
        <Descriptions.Item label="언어">{book.Book_language}</Descriptions.Item>
        <Descriptions.Item label="ISBN">{book.Book_ISBN}</Descriptions.Item>
        <Descriptions.Item label="페이지 수">{book.Book_pages}</Descriptions.Item>
        <Descriptions.Item label="출판일">
          {book.Book_published_date ? dayjs(book.Book_published_date).format('YYYY-MM-DD HH:mm:ss') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="도서 설명">{book.Book_description}</Descriptions.Item>
        <Descriptions.Item label="도서 상태">{book.Book_state}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BookDetailModal; 