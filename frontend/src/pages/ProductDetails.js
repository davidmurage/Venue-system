import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import "../styles/ProductDetailsStyles.css";
import toast from 'react-hot-toast';
import { BASE_URL } from '../utils/config';

const VenueDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [venue, setVenue] = useState({});
    const [relatedVenues, setRelatedVenues] = useState([]);

    useEffect(() => {
        if (params?.slug) getVenue();
    }, [params?.slug]);

    // Get single venue
    const getVenue = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/venue/get-venue/${params.slug}`);
            if (data?.success) {
                setVenue(data.venue);
                getSimilarVenues(data.venue._id, data.venue.category._id);
            } else {
                toast.error("Venue not found");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while fetching venue details");
        }
    };

    // Get similar venues by category
    const getSimilarVenues = async (venueId, categoryId) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/venue/related-venue/${venueId}/${categoryId}`);
            setRelatedVenues(data?.venues || []);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while fetching similar venues");
        }
    };

    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-6">
                    <img
                        src={`${BASE_URL}/api/v1/venue/venue-photo/${venue._id}`}
                        className="card-img-top"
                        alt={venue.name}
                        height="300"
                        width="350"
                    />
                </div>
                <div className="col-md-6 venue-details-info">
                    <h1 className="text-center">Venue Details</h1>
                    <hr />
                    <h6>Name: {venue.name}</h6>
                    <h6>Description: {venue.description}</h6>
                    <h6>
                        Price:{" "}
                        {venue?.price?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "KSH",
                        })}
                    </h6>
                    <h6>Category: {venue?.category?.name}</h6>
                    <Link to={`/book/${venue.slug}`}>
                        <button className="btn btn-secondary ms-1">Book Now</button>
                    </Link>
                </div>
            </div>
            <hr />
            <div className="row container similar-venues">
                <h4>Similar Venues ➡️</h4>
                {relatedVenues.length < 1 && (
                    <p className="text-center">No Similar Venues found</p>
                )}
                <div className="d-flex flex-wrap">
                    {relatedVenues.map((v) => (
                        <div className="card m-2" key={v._id}>
                            <img
                                src={`${BASE_URL}/api/v1/venue/venue-photo/${v._id}`}
                                className="card-img-top"
                                alt={v.name}
                            />
                            <div className="card-body">
                                <div className="card-name-price">
                                    <h5 className="card-title">{v.name}</h5>
                                    <h5 className="card-title card-price">
                                        {v.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "KSH",
                                        })}
                                    </h5>
                                </div>
                                <p className="card-text">
                                    {v.description.substring(0, 60)}...
                                </p>
                                <div className="card-name-price">
                                    <button
                                        className="btn btn-info ms-1"
                                        onClick={() => navigate(`/product/${v.slug}`)}
                                    >
                                        More Details
                                    </button>
                                    <Link to={`/book/${v.slug}`}>
                                        <button className="btn btn-dark ms-1">Book Now</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default VenueDetails;
