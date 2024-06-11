import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "./lib/api";
import {
  authenticatedApiRequest,
  googleAuthProvider,
  signIn,
  useCurrentUser,
} from "./lib/firebase";
import React from "react";
import { Button, Checkbox, Form, Input, InputNumber, message } from "antd";
import { useNavigate } from "react-router-dom";

type CurrentUser = {
  email: string;
  name?: string;
  grade?: string;
  graduationYear?: number;
  isIb?: boolean;
};
function Profile() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const loggedInUser = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      return;
    } else {
      (async function () {
        const response = await authenticatedApiRequest(
          "GET",
          "/user/currentUser",
        );
        setCurrentUser(response.data);
      })();
    }
  }, [loggedInUser]);

  const handleSubmit = async (values: any) => {
    try {
      await authenticatedApiRequest("PUT", "/user", values.user);
      message.success("Success! Profile updated");
      navigate("/");
      // Optionally, you can update the state to reflect the changes
      // setCurrentUser(values.user);
    } catch (error) {
      console.error("Failed to submit form:", error);
      message.error("Failed to update profile. Please try again later");
    }
  };

  return !currentUser ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <p>You're not signed in! To view your profile, please sign in first. </p>
      <Button
        type="primary"
        size="large"
        style={{
          paddingLeft: "50px",
          paddingRight: "50px",
          margin: "15px",
        }}
        onClick={() => signIn(googleAuthProvider, navigate)}
      >
        Login/Register with Google{" "}
      </Button>
    </div>
  ) : (
    <div style={{}}>
      <h1>Edit Profile Info</h1>
      <Form
        style={{ marginTop: "20px" }}
        layout="vertical"
        name="nest-messages"
        onFinish={handleSubmit}
        initialValues={{
          user: {
            name: currentUser.name,
            email: currentUser.email,
            grade: currentUser.grade,
            graduationYear: currentUser.graduationYear,
            isIb: currentUser.isIb,
          },
        }}
      >
        <Form.Item
          name={["user", "name"]}
          label="Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["user", "email"]}
          label="Email"
          rules={[{ type: "email", required: true }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={["user", "grade"]}
          label="Grade"
          rules={[{ type: "number", min: 9, max: 12, required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["user", "graduationYear"]}
          label="Graduation Year"
          rules={[{ type: "number", min: 1976, required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["user", "isIb"]}
          label="Enrolled in IB?"
          valuePropName="checked"
          rules={[{ required: true }]}
        >
          <Checkbox />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </div>
  );
}

export { Profile };

// make a new form
//   course_code String
//   title       String?
//   content     String?
//   difficulty  Int
//   interesting Int
//   liked       Boolean
// submit        button
// testing criteria
// 1. if the course code is wrong, it shouldn't let you submit, add an error in somewhere
// 2. make sure that if the user already has a review, update the review with the new review with the updated time
// 3. when you hit submit, make sure that the time is fetched, check table plus that the userid, courseid and stuff is correct
