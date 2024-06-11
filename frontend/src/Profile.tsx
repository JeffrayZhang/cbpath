import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "./lib/api";
import { authenticatedApiRequest, useCurrentUser } from "./lib/firebase";
import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';

type CurrentUser = {email:string, name?:string,grade?:string,graduationYear?:number,isIb?:boolean}
function Profile() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const loggedInUser = useCurrentUser();

  useEffect(() => {
    if(!loggedInUser) {
      return;
    }
    (async function () {
      const response = await authenticatedApiRequest("GET","/user/currentUser")
      setCurrentUser(response.data)
    })();
  }, [loggedInUser]);

  const handleSubmit = async (values: any) => {
    try {
      await authenticatedApiRequest("POST", "/user", values.user);
      // Optionally, you can update the state to reflect the changes
      // setCurrentUser(values.user);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Form
      layout="vertical"
      name="nest-messages"
      onFinish={handleSubmit}
    >
      <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email'}]}>
        <Input disabled defaultValue={currentUser.email}/>
      </Form.Item>
      <Form.Item name={['user', 'grade']} label="Grade" rules={[{ type: 'number', min: 9, max: 12 }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item name={['user', 'website']} label="Website">
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'introduction']} label="Introduction">
        <Input.TextArea />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export {Profile};
