import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { authenticatedApiRequest, useCurrentUser } from "./lib/firebase";
import { API_URL } from "./lib/api";
import { ErrorCourseNotFound } from "./components/error-course-not-found";

interface Review {
  course_code: string;
  title?: string;
  content?: string;
  difficulty: number;
  interesting: number;
  liked: boolean;
  lastUpdated: Date;
}

const ReviewForm: React.FC<{ existingReview?: Review }>= () => {
  const [form] = Form.useForm();
  const { courseID: courseCode } = useParams(); // 2. Use useParams to extract course code
// Include course code in form values
    const [formValues, setFormValues] = useState<Review>({
      course_code: "",
      title: "",
      content: "",
      difficulty: 0,
      interesting: 0,
      liked: false,
      lastUpdated: new Date(),
    });

    useEffect(() => {
      if (courseCode) {
        setFormValues((prevValues) => ({
          ...prevValues,
          course_code: courseCode, // Update course code in form values
        }));
    }
  }, [courseCode]);

  const handleRatingChange = (value: number) => {
    setFormValues({ ...formValues, interesting: value });
  };

  const handleLikedChange = (liked: boolean) => {
    setFormValues({ ...formValues, liked });
  };
  
  const loggedInUser = useCurrentUser(); 

  const onFinish = async (values: any) => {
    try {
      if (!loggedInUser || !loggedInUser) {
        throw new Error("User not logged in or token not available");
      } else {
        const response = await authenticatedApiRequest(
          "POST",
          "/review",
          formValues,
        );
        console.log("Review submitted successfully:", response.data);
        message.success("Review submitted successfully");
        form.resetFields();
      }
    } catch (error) {
      console.error("Error submitting review:", error || error);
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
      <Form.Item
        name="course_code"
        label="Course Code"
        rules={[{ required: false, message: "Please enter the course code!" }]}
      >
        <Input disabled value={formValues.course_code} />{" "}
        {/* Display course code as disabled input */}
      </Form.Item>
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

type CourseData = {
  code: string;
  title: string;
  description?: string;
  prerequesites: string;
  is_ib_course: boolean;
  elective: boolean;
};

export function CoursePage() {
  const { courseID } = useParams();
  const [courseData, setCourseData] = useState<CourseData>();
  useEffect(() => {
    // when component mounts, check if courseCode exists
    (async function () {
      try {
        const response = await axios.get(`${API_URL}/course/${courseID}`);
        setCourseData(response.data);
      } catch (error) {
        setCourseData(undefined);
      }
    })();
  }, [setCourseData]);
  if (!courseData) {
    return <ErrorCourseNotFound />;
  } else {
    return <ReviewForm />;
  }
}
