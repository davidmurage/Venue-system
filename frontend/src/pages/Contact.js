import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            For any query and info about our services and Products feel free to call anytime via our 
            contact below.
          </p>
          <p className="mt-3">
            <BiMailSend /> : info@essexgroup.co.ke
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : +25496509538
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;