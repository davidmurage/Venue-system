import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Essex app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
        Welcome to our venues web App.. we have varieties of venues suitable for meetings or meet ups.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;