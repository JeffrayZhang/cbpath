import React, { Fragment, useEffect, useState } from 'react';
import { Button, Checkbox, Form, type FormProps, Input, notification, Typography, Table, Spin } from 'antd';
import { AxiosError } from 'axios';
import { authenticatedApiRequest } from '../lib/firebase';

const { Title } = Typography;
const { TextArea } = Input;

type FieldType = {
    code?: string;
    title?: string;
    description?: string;
    is_ib_course?: boolean;
};

export const CourseForm: React.FC = () => {
    const [isLoading, setLoading] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            setLoading(true)
            await authenticatedApiRequest('POST', '/course', values)
            api.success({
                message: 'Created course!',
                duration: 1000,
            })
        } catch (error) {
            api.error({
                message: 'Error creating course',
                description: (error as AxiosError).message,
                duration: 5000,
            });
        } finally {
            setLoading(false)
        }
    };

    return (
        <Fragment>
            {contextHolder}
            <Title level={3}>Create a new Course</Title>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >

                <Form.Item<FieldType>
                    label="Course Code"
                    name="code"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Course Title"
                    name="title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Course Description"
                    name="description"
                    rules={[{ required: true }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item<FieldType>
                    name="is_ib_course"
                    valuePropName="is_ib_course"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>IB Course?</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Fragment>
    )
};

type Course = {
    code: string;
    title: string;
    description: string;
    is_ib_course: boolean;
    is_enrolled: boolean;
    enrollment_count: number;
}

export const CourseTable = () => {
    const [courses, setCourses] = useState()
    const [isLoading, setLoading] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        (async function () {
            try {
                setLoading(true)
                const response = await authenticatedApiRequest('GET', `/course`);
                setCourses(response.data)
            } catch (error) {
                api.error({
                    message: 'Error creating course',
                    description: (error as AxiosError).message,
                    duration: 5000,
                })
            } finally {
                setLoading(false)
            }

        })();
    }, [api])

    if (isLoading) {
        return (
            <Fragment>
                {contextHolder}
                <Spin size='large' />
            </Fragment>
        )
    }
    return (
        <Fragment>
            {contextHolder}
            <Table<Course> dataSource={courses} columns={[
                {
                    title: 'Course Code',
                    dataIndex: 'code',
                    key: 'code',
                },
                {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                },
                {
                    title: 'IB?',
                    dataIndex: 'is_ib_course',
                    key: 'is_ib_course',
                    render: (b) => b ? 'True' : 'False',
                },
                {
                    title: 'Enrolled?',
                    dataIndex: 'is_enrolled',
                    key: 'is_enrolled',
                    render: (b) => b ? 'True' : 'False',
                },
                {
                    title: 'Count',
                    dataIndex: 'enrollment_count',
                    key: 'enrollment_count',
                },
                {
                    title: 'Actions',
                    key: 'action',
                    render: (_, course) => (!course.is_enrolled) ? (
                        <a onClick={async () => {
                            await authenticatedApiRequest('PATCH', `/course/${course.code}/enroll`)
                            api.success({
                                message: 'Enrolled!',
                                duration: 1000,
                            })
                        }}>Enroll</a>
                    ) : null
                }
            ]} />
        </Fragment>
    )
}
