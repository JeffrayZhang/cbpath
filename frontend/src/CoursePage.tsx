import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Table,
  Pagination,
  TableProps,
  Drawer,
  CollapseProps,
  Collapse,
  Progress,
  Flex,
  Rate,
  Tag,
} from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { authenticatedApiRequest, useCurrentUser } from "./lib/firebase";
import { API_URL } from "./lib/api";
import { ErrorCourseNotFound } from "./components/error-course-not-found";
import { CourseReviewForm } from "./components/course-review-form";
import Search from "antd/lib/input/Search";

interface Review {
  id: number;
  course_code: string;
  title?: string;
  content?: string;
  difficulty: number;
  interesting: number;
  liked: boolean;
  lastUpdated: Date;
}

type CourseData = {
  code: string;
  title: string;
  description?: string;
  prerequesites: string;
  is_ib_course: boolean;
  elective: boolean;
};

type ColumnsType<T extends object> = TableProps<T>["columns"];
type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];

{
  /*TODO: Read docs to figure out how to have the table populate, sort default from most recent to least recent, allow sorting on all rating columns, and have search work at the top, and pagination
https://ant.design/components/table*/
}

export function CoursePage() {
  const { courseID } = useParams();
  const currentUser = useCurrentUser();
  const [courseData, setCourseData] = useState<CourseData>();
  const [myReviewData, setMyReviewData] = useState<Review>();
  const [top, setTop] = useState<TablePaginationPosition>("topLeft");
  const [bottom, setBottom] = useState<TablePaginationPosition>("bottomRight");

  const [openMyReview, setOpenMyReview] = useState(false);

  const showMyReview = () => {
    setOpenMyReview(true);
  };

  const onCloseMyReview = () => {
    setOpenMyReview(false);
  };

  let dataSourceAllReviews: any = []; //TODO: Fetch actual reviews
  let columnsAllReviews = [
    { title: "Title", dataIndex: "0", key: "title" },
    {
      title: "Content",
      dataIndex: "1",
      key: "content",
    },
    {
      title: "Easy",
      dataIndex: "2",
      key: "difficulty",
    },
    {
      title: "Interesting",
      dataIndex: "3",
      key: "interesting",
    },
    {
      title: "Liked",
      dataIndex: "4",
      key: "liked",
    },
    {
      title: "Last Updated",
      dataIndex: "4",
      key: "last-updated",
    },
  ];

  const items: CollapseProps["items"] = [
    //TODO: Fetch actual pre reqs & leads to
    {
      key: "1",
      label: "Prerequisites:",
      children: <p>"to replace"</p>,
    },
    {
      key: "2",
      label: "Leads to the below courses:",
      children: <p>"to replace"</p>,
    },
  ];

  useEffect(() => {
    if (!currentUser) return;
    // when component mounts, check if courseCode exists
    (async function () {
      try {
        const response = await axios.get(`${API_URL}/course/${courseID}`);
        const reviewResponse = await authenticatedApiRequest(
          "GET",
          `/review/${courseID}/myreview`,
        );
        setMyReviewData(reviewResponse.data);
        setCourseData(response.data);
      } catch (error) {
        setCourseData(undefined);
        setMyReviewData(undefined);
      }
    })();
  }, [setCourseData, setMyReviewData, currentUser]);

  if (!courseData) {
    return <ErrorCourseNotFound />;
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "0px 20px",
        }}
      >
        <h1 style={{ padding: "20px 0px" }}>
          <span>
            {courseData.code}:
            <span style={{ paddingLeft: "15px" }}>
              {courseData.is_ib_course ? (
                <Tag
                  color="blue"
                  style={{
                    fontSize: "20px",
                    verticalAlign: "middle",
                    height: "40px",
                    padding: "10px",
                    marginRight: "10px",
                  }}
                >
                  IB Course
                </Tag>
              ) : null}
              {courseData.elective ? (
                <Tag
                  color="green"
                  style={{
                    fontSize: "20px",
                    verticalAlign: "middle",
                    height: "40px",
                    padding: "10px",
                  }}
                >
                  Elective
                </Tag>
              ) : (
                <Tag
                  color="red"
                  style={{
                    fontSize: "20px",
                    verticalAlign: "middle",
                    height: "40px",
                    padding: "10px",
                  }}
                >
                  Required
                </Tag>
              )}
            </span>
          </span>
          {{ myReviewData } ? (
            <Button
              onClick={showMyReview}
              type="primary"
              style={{
                position: "absolute",
                right: 44,
                verticalAlign: "middle",
                height: "60px",
                fontWeight: "bold",
                fontSize: "20px",
                minWidth: "200px",
              }}
            >
              Update your Review?
            </Button>
          ) : (
            <Button
              type="primary"
              style={{
                verticalAlign: "middle",
                height: "60px",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Leave your Review!
            </Button>
          )}
        </h1>
        <h1>{courseData.title}</h1>
        <p className="description">{courseData.description}</p>
        <Drawer
          title={
            { myReviewData } ? (
              <h2>Update your Review</h2>
            ) : (
              <h2>Leave your Review</h2>
            )
          }
          onClose={onCloseMyReview}
          open={openMyReview}
        >
          <CourseReviewForm
            courseCode={courseData.code}
            myReviewData={myReviewData}
          />
        </Drawer>
        <Collapse
          items={items}
          defaultActiveKey={[]}
          style={{ fontSize: "20px", marginBottom: "20px" }}
        />
        <hr className="solid"></hr>
        <h2 style={{ marginBottom: "20px" }}>Average Course Reviews</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          {/* TODO: Fetch actual data*/}
          <Progress
            type="circle"
            percent={50}
            format={(percent) => `${percent}% liked`}
            size={[150, 150]}
          />
          <div style={{ padding: "25px 50px" }}>
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "20px" }}>Difficulty: "Manageable"</h2>
              <Rate />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Interesting: "Neutral"</h2>
              <Rate />
            </div>
          </div>
        </div>

        <h2>All Reviews</h2>
        {/* TODO: Make search bar work */}
        <Search
          placeholder="Search for reviews by keyword"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={() => {}}
          style={{ paddingTop: "20px" }}
        />
        <Table
          dataSource={dataSourceAllReviews}
          columns={columnsAllReviews}
          style={{ padding: "20px 0px" }}
          pagination={{ position: [top, bottom] }}
        />
      </div>
    );
  }
}
