import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseAddForm from "main/components/Courses/CourseAddForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CoursesAddPage() {
  const objectToAxiosParams = (course) => ({
    url: "/api/courses/post",
    method: "POST",
    params: {
      enrollCd: course.enrollCd,
      psId: course.psId,
    },
  });

  const onSuccess = (course) => {
    toast(
      `New course added - id: ${course[0].id} enrollCd: ${course[0].enrollCd}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/courses/user/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    const psId = {
      psId: localStorage["CourseForm-psId"],
    };
    const dataFinal = Object.assign(data, psId);
    mutation.mutate(dataFinal);
  };

  if (isSuccess) {
    return <Navigate to="/courses/list" />;
  }
  if (mutation.isError) {
    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Add Course to Schedule</h1>

          <CourseAddForm submitAction={onSubmit} />
          <p data-testid="PSCourseAdd-Error">
            Error: {mutation.error.response.data?.message}
          </p>
        </div>
      </BasicLayout>
    );
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Add Course to Schedule</h1>

        <CourseAddForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
