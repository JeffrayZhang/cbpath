import { RouterProvider, useParams } from "react-router-dom";
import { PageLayout } from "./components/layout";
import { useState, useEffect } from "react";
import { authenticatedApiRequest } from "./lib/firebase";
import axios from "axios";


type CourseData = { code: string, title: string, description?: string, prerequesites: string, is_ib_course: boolean, elective: boolean }
function CoursePage() {
    const { courseID } = useParams();
    const [courseData, setCourseData] = useState<CourseData>()
    useEffect(() => {
        // when component mounts, check if courseCode exists
        (async function () {
            try {
                const response = await axios.get(`/course/${courseID}`)
                setCourseData(response.data)
            } catch (error) { setCourseData(undefined) }
        })()
    })
    if (!courseData) {
        return <p>error</p>;
    }
    return <p>sucess</p>
}
export default CoursePage;