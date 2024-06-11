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
      <p style={{ fontSize: "20px" }}>
        <b>Hint 🤔:</b> If you're searching for an HL/SL/Studies IB course,
        append a 1, 2, or 3 to the end of the course code respectively (e.g. HL
        Chem is SCH4U1).
      </p>
      <p style={{ fontSize: "20px" }}>
        <b>Still can't find your course?</b> Please send an email with subject
        "Course Request" to "contact.cbpath@gmail.com" with the course info. Ty
        ❤️
      </p>
    </div>
  );
};
