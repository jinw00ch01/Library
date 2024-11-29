import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Form, Input, Rate, message } from 'antd';
import { reviewService } from '../services/api';
import styled from 'styled-components';

const { TextArea } = Input;

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [isWriteModalVisible, setIsWriteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getReviewsByBook(bookId);
      setReviews(response.reviews);
      setUserUpvotes(response.upvotes);
      setUserReports(response.reports);
    } catch (error) {
      message.error('리뷰를 불러오는데 실패했습니다.');
    }
  };

  const handleUpvote = async (reviewId) => {
    try {
      await reviewService.upvoteReview(reviewId);
      fetchReviews();
    } catch (error) {
      message.error(error.response?.data?.error || '추천에 실패했습니다.');
    }
  };

  const handleReport = async (reviewId) => {
    try {
      await reviewService.reportReview(reviewId);
      fetchReviews();
    } catch (error) {
      message.error(error.response?.data?.error || '신고에 실패했습니다.');
    }
  };

  const handleWriteReview = () => {
    setIsWriteModalVisible(true);
  };

  const handleSubmitReview = async (values) => {
    try {
      await reviewService.writeReview(bookId, values);
      message.success('리뷰가 등록되었습니다.');
      setIsWriteModalVisible(false);
      fetchReviews();
    } catch (error) {
      message.error('리뷰 등록에 실패했습니다.');
    }
  };

  const handleEditReview = (review) => {
    setCurrentReview(review);
    setIsEditModalVisible(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteOwnReview(reviewId);
      message.success('리뷰가 삭제되었습니다.');
      fetchReviews();
    } catch (error) {
      message.error('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleSubmitEdit = async (values) => {
    try {
      await reviewService.updateReview(currentReview.Review_ID, values);
      message.success('리뷰가 수정되었습니다.');
      setIsEditModalVisible(false);
      fetchReviews();
    } catch (error) {
      message.error('리뷰 수정에 실패했습니다.');
    }
  };

  return (
    <div>
      <List
        header={<div>리뷰 목록</div>}
        dataSource={reviews}
        renderItem={(item) => (
          <List.Item
            actions={[
              item.isOwn && (
                <>
                  <Button onClick={() => handleEditReview(item)}>수정</Button>
                  <Button onClick={() => handleDeleteReview(item.Review_ID)} danger>
                    삭제
                  </Button>
                </>
              ),
              <Button
                onClick={() => handleUpvote(item.Review_ID)}
                disabled={item.isOwn || userUpvotes.includes(item.Review_ID) || item.isBlinded}
              >
                추천 ({item.Review_upvotes})
              </Button>,
              <Button
                onClick={() => handleReport(item.Review_ID)}
                disabled={item.isOwn || userReports.includes(item.Review_ID) || item.isBlinded}
              >
                신고 ({item.Review_issues})
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.Review_title}
              description={
                <div>
                  <Rate disabled value={item.Review_rating} />
                  <p>{item.Review_text}</p>
                  <small>
                    {item.Review_date} 작성 | {item.Customer_name}
                  </small>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <WriteButton>
        <Button type="primary" onClick={handleWriteReview}>
          리뷰 쓰기
        </Button>
      </WriteButton>
      <Modal
        open={isWriteModalVisible}
        onCancel={() => setIsWriteModalVisible(false)}
        footer={null}
        title="리뷰 쓰기"
      >
        <Form onFinish={handleSubmitReview} layout="vertical">
          <Form.Item
            name="Review_title"
            label="제목"
            rules={[{ required: true, message: '제목을 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Review_rating"
            label="평점"
            rules={[{ required: true, message: '평점을 선택해주세요.' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="Review_text"
            label="리뷰 내용"
            rules={[{ required: true, message: '리뷰 내용을 입력해주세요.' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            등록하기
          </Button>
        </Form>
      </Modal>
      <Modal
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        title="리뷰 수정"
      >
        <Form
          onFinish={handleSubmitEdit}
          layout="vertical"
          initialValues={{
            Review_title: currentReview?.Review_title,
            Review_rating: currentReview?.Review_rating,
            Review_text: currentReview?.Review_text,
          }}
        >
          <Form.Item
            name="Review_title"
            label="제목"
            rules={[{ required: true, message: '제목을 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Review_rating"
            label="평점"
            rules={[{ required: true, message: '평점을 선택해주세요.' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="Review_text"
            label="리뷰 내용"
            rules={[{ required: true, message: '리뷰 내용을 입력해주세요.' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            수정하기
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

const WriteButton = styled.div`
  margin-top: 16px;
  text-align: right;
`;

export default ReviewList; 