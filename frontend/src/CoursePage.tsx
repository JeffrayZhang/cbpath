import React, { useState } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // 1. Import useParams

const CustomForm: React.FC = () => {
  const [form] = Form.useForm();
  const { courseCode } = useParams(); // 2. Use useParams to extract course code

  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    difficulty: 0,
    interesting: 0,
    liked: false,
  });

  const handleRatingChange = (value: number) => {
    setFormValues({ ...formValues, interesting: value });
  };

  const handleLikedChange = (liked: boolean) => {
    setFormValues({ ...formValues, liked });
  };

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post("/review", {
        ...values,
        course_code: courseCode,
      }); // Include course code in the request
      console.log("Review submitted:", response.data);
      message.success("Review submitted successfully");
      form.resetFields();
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review. Please try again later.");
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={formValues}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
    >
      {/* Remove course_code field from the form */}
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="Content" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="difficulty"
        label="Difficulty"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>
      <Form.Item label="Interesting" wrapperCol={{ span: 16, offset: 8 }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            onClick={() => handleRatingChange(value)}
            style={{ cursor: "pointer" }}
          >
            ⭐
          </span>
        ))}
      </Form.Item>
      <Form.Item label="Liked" wrapperCol={{ span: 16, offset: 8 }}>
        <Button type="default" onClick={() => handleLikedChange(true)}>
          👍
        </Button>
        <Button type="default" onClick={() => handleLikedChange(false)}>
          👎
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ ...{ span: 16, offset: 8 } }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
