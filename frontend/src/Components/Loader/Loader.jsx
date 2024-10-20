import "./Loader.css";
const Loader = () => {
  return (
    <div className="active-outer-loader">
      <div className="lds-ellipsis ">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="disclaimer">
        {" "}
        Loading...the site where backend is hosted is slow to respond
      </div>
    </div>
  );
};

export { Loader };
