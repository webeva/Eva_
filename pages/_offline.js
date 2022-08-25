/* This page is a fallback page when the 
user is offline */
const Offline = () => {
    return (
      <div
        style={{
          width:"100vw",
          marginTop:"40vh",
          color: "var(--color-white)",
          textAlign: "center",
        }}
      >
        <h1>Looks like your are Offline</h1>
       
       <p>You will be able to access this page once you are connected to the internet</p>
      </div>
    );
  };
  export default Offline;
  