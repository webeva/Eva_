/* This page is a custom 404 page and 
will be rendered if the user goes
to an invalid link */
const NotFound = () => {
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
      <h1>Page not found</h1>
      <strong>404 error</strong>
      <p>
        Well it seems like you have found a page that doesn&apos;t exist.<br></br>{" "}
        Maybe try not breaking the website next time.
      </p>
    </div>
  );
};
export default NotFound;
