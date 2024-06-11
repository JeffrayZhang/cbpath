import { Form, Input, Button, message, Checkbox, Rate, Segmented } from "antd";
import { authenticatedApiRequest, useCurrentUser } from "../lib/firebase";
import { useState } from "react";
import { time } from "console";

interface Review {
  course_code: string;
  title?: string;
  content?: string;
  difficulty: number;
  interesting: number;
  liked: boolean;
  lastUpdated: Date;
}

function convertToLocalTime(utcTime: string) {
  return new Date(utcTime).toLocaleString();
}

export const CourseReviewForm = ({
  courseCode,
  myReviewData,
}: {
  courseCode: string;
  myReviewData: any;
}) => {
  const [form] = Form.useForm();
  const loggedInUser = useCurrentUser();

  const onFinish = async (values: any) => {
    try {
      if (!loggedInUser || !loggedInUser) {
        throw new Error("User not logged in or token not available");
      } else {
        let response = null;
        if (!myReviewData) {
          response = await authenticatedApiRequest("POST", "/review", {
            ...values.review,
            lastUpdated: new Date(),
          });
        } else {
          response = await authenticatedApiRequest(
            "PUT",
            "/review/update/" + courseCode,
            { ...values.review, lastUpdated: new Date() },
          );
        }
        console.log("Review submitted successfully:", response.data);
        message.success(
          "Review submitted successfully! Reloading page data now!",
        );
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error("Error submitting review:", error || error);
      message.error("Failed to submit review. Please try again later.");
    }
  };

  console.log("Review Data:", myReviewData);
  const difficultyTooltips = [
    //TODO: Should these be in a utils folder or something global so you don't have to update across pages/components?
    "Very Hard",
    "Hard",
    "Manageable",
    "Easy",
    "Very Easy",
  ];
  const interestingTooltips = [
    "Very Boring",
    "Boring",
    "Neutral",
    "Interesting",
    "Very Interesting",
  ];
  return (
    <div>
      {myReviewData ? (
        <p>
          <i>Last Updated: {convertToLocalTime(myReviewData.lastUpdated)}</i>
        </p>
      ) : null}
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          review: {
            course_code: courseCode,
            title: myReviewData?.title,
            content: myReviewData?.content,
            difficulty: myReviewData?.difficulty,
            interesting: myReviewData?.interesting,
            liked: myReviewData ? myReviewData.liked : true,
            lastUpdated: myReviewData?.lastUpdated,
          },
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <Form.Item name={["review", "course_code"]} label="Course Code">
          <Input disabled value={courseCode} />{" "}
        </Form.Item>
        <Form.Item
          name={["review", "title"]}
          label="Title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["review", "content"]}
          label="Content"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={["review", "difficulty"]}
          label="Easy"
          rules={[{ required: true }]}
        >
          <Rate style={{ color: "#F9A602" }} tooltips={difficultyTooltips} />
        </Form.Item>
        <Form.Item
          name={["review", "interesting"]}
          label="Interesting"
          rules={[{ required: true }]}
        >
          <Rate style={{ color: "#F9A602" }} tooltips={interestingTooltips} />
        </Form.Item>
        <Form.Item
          name={["review", "liked"]}
          label="Liked?"
          rules={[{ required: true }]}
        >
          <Segmented<Boolean>
            options={[
              { label: "👍", value: true },
              { label: "👎", value: false },
            ]}
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "right",
            justifyContent: "right",
          }}
        >
          <Button
            type="dashed"
            style={{ marginRight: "10px" }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
