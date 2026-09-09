import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import CourseDiscovery from "./pages/CourseDiscovery";
import CourseDetail from "./pages/CourseDetail";
import SupportTutor from "./pages/SupportTutor";
import { MOCK_COURSES, COURSE_DETAILS, MOCK_COURSE } from "./data/mockCourses";

// Resolves the current course from the URL param.
// Replace the COURSE_DETAILS lookup with a real fetch/query keyed on courseId
// once your API is wired up.
function CourseDetailRoute() {
  const { courseId } = useParams();
  const course = COURSE_DETAILS[courseId] || MOCK_COURSE;
  return <CourseDetail course={course} key={courseId} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseDiscovery courses={MOCK_COURSES} />} />
        <Route path="/courses" element={<CourseDiscovery courses={MOCK_COURSES} />} />
        <Route path="/courses/:courseId" element={<CourseDetailRoute />} />
        <Route path="/support" element={<SupportTutor />} />
        <Route path="/tutors/:tutorId/support" element={<SupportTutor />} />
      </Routes>
    </BrowserRouter>
  );
}