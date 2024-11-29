import React, { useState, useEffect } from 'react';
import { Table, Button, Collapse, Modal, message } from 'antd';
import { bookService, reviewService } from '../services/api';
import BookDetailModal from './BookDetailModal';
import ReviewList from './ReviewList';
import MediaModal from './MediaModal';
import styled from 'styled-components';

const { Panel } = Collapse;

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getBooks();
      console.log('Fetched books:', response);
      setBooks(response.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      message.error('도서 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetailClick = (book) => {
    setSelectedBook(book);
    setIsDetailModalVisible(true);
  };

  const handleExpandReviews = (expanded, record) => {
    const keys = expanded ? [record.Book_ID] : [];
    setExpandedRowKeys(keys);
  };

  const handleMediaClick = (bookId) => {
    setSelectedBookId(bookId);
    setIsMediaModalVisible(true);
  };

  const columns = [
    {
      title: '도서명',
      dataIndex: 'Book_name',
      key: 'Book_name',
    },
    {
      title: '장르',
      dataIndex: 'Book_genre',
      key: 'Book_genre',
    },
    {
      title: '상태',
      dataIndex: 'Book_state',
      key: 'Book_state',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <ButtonGroup>
          <Button onClick={() => handleDetailClick(record)}>상세정보</Button>
          <Button onClick={() => handleExpandReviews(true, record)}>리뷰 및 평점 보기</Button>
          <Button onClick={() => handleMediaClick(record.Book_ID)}>관련 영상 자료</Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Container>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="Book_ID"
        expandedRowRender={(record) => (
          <ReviewSection>
            <ReviewList bookId={record.Book_ID} />
          </ReviewSection>
        )}
        expandedRowKeys={expandedRowKeys}
        onExpand={handleExpandReviews}
      />
      {selectedBook && (
        <BookDetailModal
          visible={isDetailModalVisible}
          onClose={() => setIsDetailModalVisible(false)}
          book={selectedBook}
        />
      )}
      {isMediaModalVisible && (
        <MediaModal
          visible={isMediaModalVisible}
          onClose={() => setIsMediaModalVisible(false)}
          bookId={selectedBookId}
        />
      )}
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

const ReviewSection = styled.div`
  padding: 16px;
  background-color: #f6f6f6;
`;

export default BookSearch; 