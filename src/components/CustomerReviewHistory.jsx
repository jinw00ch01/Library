import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Rate, message } from 'antd';
import styled from 'styled-components';
import { reviewService } from '../services/api';
import dayjs from 'dayjs';

const CustomerReviewHistory = ({ customerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (customerId) {
      fetchReviews();
    }
  }, [customerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getCustomerReviews(customerId);
      console.log('Fetched reviews:', response.reviews);
      setReviews(response.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('리뷰 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    form.setFieldsValue({
      Review_rating: review.Review_rating,
      Review_title: review.Review_title,
      Review_text: review.Review_text,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      message.success('리뷰가 삭제되었습니다.');
      fetchReviews();
    } catch (error) {
      message.error('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      console.log('Updating review:', selectedReview.Review_ID, values);
      await reviewService.updateReview(selectedReview.Review_ID, values);
      message.success('리뷰가 수정되었습니다.');
      setIsEditModalVisible(false);
      fetchReviews();
    } catch (error) {
      console.error('Review update error:', error);
      message.error('리뷰 수정에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '리뷰 ID',
      dataIndex: 'Review_ID',
      key: 'Review_ID',
    },
    {
      title: '도서명',
      dataIndex: 'Book_name',
      key: 'Book_name',
    },
    {
      title: '평점',
      dataIndex: 'Review_rating',
      key: 'Review_rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '제목',
      dataIndex: 'Review_title',
      key: 'Review_title',
    },
    {
      title: '내용',
      dataIndex: 'Review_text',
      key: 'Review_text',
    },
    {
      title: '게시일',
      dataIndex: 'Review_date',
      key: 'Review_date',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '추천수',
      dataIndex: 'Review_upvotes',
      key: 'Review_upvotes',
    },
    {
      title: '신고수',
      dataIndex: 'Review_issues',
      key: 'Review_issues',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <ButtonGroup>
          <Button onClick={() => handleEdit(record)}>수정</Button>
          <Button danger onClick={() => handleDelete(record.Review_ID)}>삭제</Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Container>
      <h2>리뷰 내역 조회</h2>
      <Table 
        columns={columns} 
        dataSource={reviews} 
        rowKey="Review_ID"
        loading={loading}
        locale={{ emptyText: '작성한 리뷰가 없습니다.' }}
      />

      <Modal
        title="리뷰 수정"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="Review_rating"
            label="평점"
            rules={[{ required: true, message: '평점을 입력해주세요' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="Review_title"
            label="제목"
            rules={[{ required: true, message: '제목을 입력해주세요' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Review_text"
            label="내용"
            rules={[{ required: true, message: '내용을 입력해주세요' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <ButtonGroup>
            <Button type="primary" htmlType="submit">
              수정
            </Button>
            <Button onClick={() => setIsEditModalVisible(false)}>
              취소
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
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

export default CustomerReviewHistory; 