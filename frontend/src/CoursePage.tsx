import { RouterProvider, useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "./components/layout";
import { useState, useEffect } from "react";
import { authenticatedApiRequest, useCurrentUser } from "./lib/firebase";
import axios, { AxiosError, isAxiosError } from "axios";
import { API_URL } from "./lib/api";
import { message } from "antd";

interface Review {
  course_code: string;
  title?: string;
  content?: string;
  difficulty: number;
  interesting: number;
  liked: boolean;
  lastUpdated: Date;
}

const CustomForm: React.FC<{ existingReview?: Review }> = ({
  existingReview,
}) => {
  const [formValues, setFormValues] = useState<Review>({
    course_code: "",
    title: "",
    content: "",
    difficulty: 0,
    interesting: 0,
    liked: false,
    lastUpdated: new Date(),
    ...existingReview,
  });

  const loggedInUser = useCurrentUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
      lastUpdated: new Date(), // Update last updated time whenever any field changes
    });
  };

  const handleLikedChange = (liked: boolean) => {
    setFormValues({
      ...formValues,
      liked,
      lastUpdated: new Date(), // Update last updated time when liked status changes
    });
  };

  const handleRatingChange = (
    type: "difficulty" | "interesting",
    value: number,
  ) => {
    setFormValues({
      ...formValues,
      [type]: value,
      lastUpdated: new Date(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!loggedInUser || !loggedInUser) {
        throw new Error("User not logged in or token not available");
      } 
      else{
        const response = await authenticatedApiRequest("POST", "/review", formValues);
        console.log("Review submitted successfully:", response.data);
        message.success("Review submitted successfully");
      }

    } catch (error) 
    {
      console.error("Error submitting review:", error || error);
      message.error("Failed to submit review. Please try again later.");
    }
  };
  
  

return(<form onSubmit={handleSubmit}>
  <label>
    Course Code:
    <input
      type="text"
      name="course_code"
      value={formValues.course_code}
      onChange={handleChange}
    />
  </label>
  <br />
  <label>
    Title:
    <input
      type="text"
      name="title"
      value={formValues.title}
      onChange={handleChange}
    />
  </label>
  <br />
  <label>
    Content:
    <textarea
      name="content"
      value={formValues.content}
      onChange={handleChange}
    />
  </label>
  <br />
  <label>
    Difficulty:
    <input
      type="number"
      name="difficulty"
      value={formValues.difficulty}
      onChange={handleChange}
    />
  </label>
  <br />
  <label>
    Interesting:
    <div>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleRatingChange("interesting", value)}
          style={{ cursor: "pointer" }}
        >
          ⭐
        </span>
      ))}
    </div>
  </label>
  <br />
  <label>
    Liked:
    <button type="button" onClick={() => handleLikedChange(true)}>
      👍
    </button>
    <button type="button" onClick={() => handleLikedChange(false)}>
      👎
    </button>
  </label>
  <br />
  <button type="submit">Submit</button>
</form> )}

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
    return <p>error</p>; //TODO: add error page
  }

  else{
    return<CustomForm></CustomForm>;
}}
