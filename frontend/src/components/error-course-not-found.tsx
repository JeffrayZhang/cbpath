import noCourseImg from "../error-icon.svg";

export const ErrorCourseNotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <img src={noCourseImg} style={{ paddingLeft: "70px" }} alt="error" />
      <h2>Uh oh! Course not found 😔 </h2>
      <p>Try searching for another course</p>
    </div>
  );
};
