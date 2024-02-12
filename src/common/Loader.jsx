import React from "react";
import { Bars } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-full h-[91.6vh] flex flex-col justify-center items-center">
      <Bars
        height="80"
        width="80"
        color="#838894"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
