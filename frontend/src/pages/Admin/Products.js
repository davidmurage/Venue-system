import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Venues = () => {
  const [venues, setVenues] = useState([]);

  // Get all venues
  const getAllVenues = async () => {
    try {
      const { data } = await axios.get("/api/v1/venue/get-venue");
      if (data?.success) {
        setVenues(data.venues);
      } else {
        toast.error("Failed to fetch venues");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching venues");
    }
  };

  // Lifecycle method to fetch venues
  useEffect(() => {
    getAllVenues();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Venues List</h1>
          <div className="d-flex flex-wrap">
            {venues.map((venue) => (
              <Link
                key={venue._id}
                to={`/dashboard/admin/product/${venue.slug}`}
                className="venue-link"
              >
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`/api/v1/venue/venue-photo/${venue._id}`}
                    className="card-img-top"
                    alt={venue.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{venue.name}</h5>
                    <p className="card-text">{venue.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Venues;
