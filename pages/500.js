/* This page is a custom 500 page and 
will be rendered if an error happens in 
the backend */
const Error5 = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "33vw",
        top: "35vh",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1>Server Side Error</h1>
      <strong>500 error</strong>
      <p>Well it seems like you have found an error.</p>
    </div>
  );
};
export default Error5;
