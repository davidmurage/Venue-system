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
          We are a Technological company majoring in AI and IOT.
           We advance Technology through cutting edge solutions to meet our customers seamless needs. 
          We embrace the latest Technologies in Automation and  Virtual reality (VR).
          
          @EGL
          Where future is made
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;