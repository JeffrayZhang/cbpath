import React, { useState, useEffect, useRef } from "react";
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
  InputRef,
  TableColumnsType,
  TableColumnType,
  Space,
  ConfigProvider,
} from "antd";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  authenticatedApiRequest,
  signIn,
  useCurrentUser,
  googleAuthProvider,
} from "./lib/firebase";
import { API_URL } from "./lib/api";
import { ErrorCourseNotFound } from "./components/error-course-not-found";
import { CourseReviewForm } from "./components/course-review-form";
import Search from "antd/lib/input/Search";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import MobileDetect from "mobile-detect";

const difficultyTooltips = [
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

function convertToLocalTime(utcTime: string) {
  return new Date(utcTime).toLocaleString();
}
interface AllCourseReviews {
  reviews: Review[];
  avgReviews: { _avg: { difficulty: number; interesting: number } };
  numLiked: number;
}

type CourseData = {
  code: string;
  title: string;
  description?: string;
  prerequesites: string[];
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

type DataIndex = keyof Review;

const CourseList = (props: { courses?: string[] }) => {
  if (!props.courses || props.courses.length === 0) {
    return <ul>None 😊</ul>;
  } else {
    return (
      <ul>
        {props.courses.map((course) => (
          <li key={course}>
            <a href={`/course/${course}`}>{course}</a>
          </li>
        ))}
      </ul>
    );
  }
};

export function CoursePage() {
  const { courseID } = useParams();
  const currentUser = useCurrentUser();
  const [courseData, setCourseData] = useState<CourseData>();
  const [leadsToData, setLeadsToData] = useState<string[]>();
  const [myReviewData, setMyReviewData] = useState<Review>();
  const [allCourseReviews, setAllCourseReviews] = useState<AllCourseReviews>();
  const [bottom, setBottom] = useState<TablePaginationPosition>("bottomRight");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const navigate = useNavigate();

  const [openMyReview, setOpenMyReview] = useState(false);
  const md = new MobileDetect(window.navigator.userAgent);

  const showMyReview = () => {
    setOpenMyReview(true);
  };

  const onCloseMyReview = () => {
    setOpenMyReview(false);
  };

  useEffect(() => {
    // when component mounts, check if courseCode exists
    (async function () {
      try {
        if (currentUser) {
          const reviewResponse = await authenticatedApiRequest(
            "GET",
            `/review/${courseID}/myreview`,
          );
          setMyReviewData(reviewResponse.data);
        }
        const response = await axios.get(`${API_URL}/course/${courseID}`);
        setCourseData(response.data);
        const leadsToResponse = await axios.get(
          `${API_URL}/course/${courseID}/leadsTo`,
        );
        setLeadsToData(leadsToResponse.data);
        const allReviewsResponse = await axios.get(
          `${API_URL}/review/${courseID}`,
        );
        setAllCourseReviews(allReviewsResponse.data);
      } catch (error) {
        setCourseData(undefined);
        setMyReviewData(undefined);
        setLeadsToData(undefined);
        setAllCourseReviews(undefined);
      }
    })();
  }, [
    setCourseData,
    setMyReviewData,
    currentUser,
    setLeadsToData,
    setAllCourseReviews,
  ]);

  console.log(myReviewData);
  if (!courseData) {
    return <ErrorCourseNotFound />;
  } else {
    const items: CollapseProps["items"] = [
      {
        key: "1",
        label: "Prerequisites:",
        children: <CourseList courses={courseData.prerequesites} />,
      },
      {
        key: "2",
        label: "Leads to the below courses:",
        children: <CourseList courses={leadsToData} />,
      },
    ];
    let dataSourceAllReviews: any[] = [];
    let columnsAllReviews: any[] = [];

    const handleSearch = (
      selectedKeys: string[],
      confirm: FilterDropdownProps["confirm"],
      dataIndex: DataIndex,
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setSearchText("");
    };

    const getColumnSearchProps = (
      dataIndex: DataIndex,
    ): TableColumnType<Review> => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]!.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    });

    if (allCourseReviews) {
      dataSourceAllReviews = allCourseReviews.reviews.map((r) => ({
        ...r,
        key: r.id,
      }));
      columnsAllReviews = [
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
          ...getColumnSearchProps("title"),
        },
        {
          title: "Content",
          dataIndex: "content",
          key: "content",
          ...getColumnSearchProps("content"),
        },
        {
          title: "Easy",
          dataIndex: "difficulty",
          key: "difficulty",
          sorter: (a: Review, b: Review) => a.difficulty - b.difficulty,
          render: (difficulty: number) =>
            difficulty + ": " + difficultyTooltips[difficulty - 1],
        },
        {
          title: "Interesting",
          dataIndex: "interesting",
          key: "interesting",
          sorter: (a: Review, b: Review) => a.difficulty - b.difficulty,
          render: (interesting: number) =>
            interesting + ": " + interestingTooltips[interesting - 1],
        },
        {
          title: "Liked?",
          dataIndex: "liked",
          key: "liked",
          render: (liked: boolean) => (liked ? "Yes" : "No"),
          filters: [
            { text: "Yes", value: true },
            { text: "No", value: false },
          ],
          onFilter: (value: any, record: Review) => record.liked === value,
        },
        {
          title: "Last Updated",
          dataIndex: "lastUpdated",
          key: "lastUpdated",
          render: (lastUpdated: string) => convertToLocalTime(lastUpdated),
          defaultSortOrder: "descend",
          sorter: (a: Review, b: Review) =>
            new Date(a.lastUpdated).getDate() -
            new Date(b.lastUpdated).getDate(),
        },
      ];
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "0px 20px",
        }}
      >
        {!currentUser ? (
          <div>
            {md.mobile() ? (
              <Button
                onClick={() => signIn(googleAuthProvider, navigate)}
                type="primary"
                style={{
                  position: "absolute",
                  right: "5px",
                  verticalAlign: "middle",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  maxWidth: "200px",
                  padding: "10px",
                }}
              >
                Sign In to Leave a Review!
              </Button>
            ) : (
              <Button
                onClick={() => signIn(googleAuthProvider, navigate)}
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
                Sign In to Leave a Review!
              </Button>
            )}
          </div>
        ) : myReviewData ? (
          <div>
            {md.mobile() ? (
              <Button
                onClick={showMyReview}
                type="primary"
                style={{
                  position: "absolute",
                  right: "5px",
                  verticalAlign: "middle",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  maxWidth: "200px",
                  padding: "10px",
                }}
              >
                Update your Review?
              </Button>
            ) : (
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
            )}
          </div>
        ) : (
          <div>
            {md.mobile() ? (
              <Button
                onClick={showMyReview}
                type="primary"
                style={{
                  position: "absolute",
                  right: "5px",
                  verticalAlign: "middle",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  maxWidth: "200px",
                  padding: "10px",
                }}
              >
                Leave your Review!
              </Button>
            ) : (
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
                Leave your Review!
              </Button>
            )}
          </div>
        )}
        {md.mobile() ? (
          <h1
            style={{
              padding: "80px 0px 0px 0px",
              color: "gray",
              fontSize: "30px",
            }}
          >
            <span>
              {courseData.code}:
              <span style={{ paddingLeft: "5px" }}>
                {courseData.is_ib_course ? (
                  <Tag
                    color="blue"
                    style={{
                      fontSize: "14px",
                      verticalAlign: "middle",
                      height: "40px",
                      padding: "10px",
                      marginRight: "8px",
                    }}
                  >
                    IB Course
                  </Tag>
                ) : null}
                {courseData.elective ? (
                  <Tag
                    color="green"
                    style={{
                      fontSize: "14px",
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
                      fontSize: "14px",
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
            <h1 style={{ color: "black", fontSize: 40 }}>{courseData.title}</h1>
            <p className="description" style={{ fontSize: 20 }}>
              {courseData.description}
            </p>
          </h1>
        ) : (
          <h1 style={{ padding: "70px 0px 0px 0px", color: "gray" }}>
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
                      padding: "8px",
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
                      height: "42px",
                      padding: "8px",
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
                      padding: "8px",
                    }}
                  >
                    Required
                  </Tag>
                )}
              </span>
            </span>
            <h1 style={{ color: "black", fontSize: 60 }}>{courseData.title}</h1>
            <p className="description">{courseData.description}</p>
          </h1>
        )}
        <Drawer
          title={
            myReviewData ? (
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
        {!allCourseReviews || allCourseReviews.reviews.length === 0 ? (
          <h2 style={{ marginBottom: "20px" }}>
            {" "}
            No reviews yet! Be the first one!{" "}
          </h2>
        ) : (
          <div>
            <h2 style={{ marginBottom: "20px" }}>Average Course Reviews</h2>
            {md.mobile() ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                  alignItems: "left",
                }}
              >
                <Progress
                  type="circle"
                  percent={Math.round(
                    (allCourseReviews.numLiked /
                      allCourseReviews.reviews.length) *
                      100,
                  )}
                  format={(percent) => `${percent}% liked`}
                  size={170}
                />
                <div style={{ marginTop: "20px" }}>
                  <h2 style={{ fontSize: "20px" }}>
                    Difficulty? "
                    {
                      difficultyTooltips[
                        Math.round(
                          allCourseReviews.avgReviews._avg.difficulty,
                        ) - 1
                      ]
                    }
                    "
                  </h2>
                  <Rate
                    style={{ color: "#F9A602" }}
                    disabled
                    value={Math.round(
                      allCourseReviews.avgReviews._avg.difficulty,
                    )}
                  />
                </div>
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px" }}>
                      Interesting? "
                      {
                        interestingTooltips[
                          Math.round(
                            allCourseReviews.avgReviews._avg.interesting,
                          ) - 1
                        ]
                      }
                      "
                    </h2>
                    <Rate
                      style={{ color: "#F9A602" }}
                      disabled
                      value={Math.round(
                        allCourseReviews.avgReviews._avg.interesting,
                      )}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <Progress
                  type="circle"
                  percent={Math.round(
                    (allCourseReviews.numLiked /
                      allCourseReviews.reviews.length) *
                      100,
                  )}
                  format={(percent) => `${percent}% liked`}
                  size={170}
                />
                <div style={{ padding: "25px 20px" }}>
                  <div style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "20px" }}>
                      Difficulty? "
                      {
                        difficultyTooltips[
                          Math.round(
                            allCourseReviews.avgReviews._avg.difficulty,
                          ) - 1
                        ]
                      }
                      "
                    </h2>
                    <Rate
                      style={{ color: "#F9A602" }}
                      disabled
                      value={Math.round(
                        allCourseReviews.avgReviews._avg.difficulty,
                      )}
                    />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "20px" }}>
                      Interesting? "
                      {
                        interestingTooltips[
                          Math.round(
                            allCourseReviews.avgReviews._avg.interesting,
                          ) - 1
                        ]
                      }
                      "
                    </h2>
                    <Rate
                      style={{ color: "#F9A602" }}
                      disabled
                      value={Math.round(
                        allCourseReviews.avgReviews._avg.interesting,
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            <h2>All Reviews (total: {allCourseReviews.reviews.length} )</h2>
            {allCourseReviews && (
              <Table
                dataSource={dataSourceAllReviews}
                columns={columnsAllReviews}
                style={{ padding: "20px 0px", overflow: "scroll" }}
                pagination={{ position: [bottom] }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
