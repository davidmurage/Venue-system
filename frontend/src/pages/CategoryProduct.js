import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";

const CategoryVenue = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (params?.slug) getVenuesByCategory();
  }, [params?.slug]);

  const getVenuesByCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/venue/venue-category/${params.slug}`);
      setVenues(data?.venues); // Update to 'venues' for consistent naming
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{venues?.length} result(s) found</h6>
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap">
              {venues?.map((venue) => (
                <div className="card m-2" key={venue._id}>
                  <img
                    src={`/api/v1/venue/venue-photo/${venue._id}`}
                    className="card-img-top"
                    alt={venue.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{venue.name}</h5>
                      <h5 className="card-title card-price">
                        {venue.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">
                      {venue.description.substring(0, 60)}...
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/venue/${venue.slug}`)}
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryVenue;
