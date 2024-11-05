import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Prices } from "../components/Prices";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Checkbox, Radio } from 'antd';
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/endpoint`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in fetching categories");
    }
  };

  // Get all venues for the current page
  const getVenues = async (reset = false) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/venue/venue-list/${page}`);
      setLoading(false);
      setVenues(reset ? data.venues : [...venues, ...data.venues]);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong in fetching venues");
    }
  };

  // Get total venue count
  const getTotalVenues = async () => {
    try {
      const { data } = await axios.get("/api/v1/venue/venue-count");
      setTotal(data.total);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in fetching venue count");
    }
  };

  useEffect(() => {
    getAllCategories();
    getTotalVenues();
    getVenues(true); // Fetch initial venues
  }, []);

  // Load more venues when `page` changes
  useEffect(() => {
    if (page > 1) getVenues();
  }, [page]);

  // Load more venues handler
  const loadMore = () => setPage(page + 1);

  // Handle category filter
  const handleCategoryFilter = (isChecked, id) => {
    let updatedCheckedCategories = [...checkedCategories];
    if (isChecked) {
      updatedCheckedCategories.push(id);
    } else {
      updatedCheckedCategories = updatedCheckedCategories.filter(c => c !== id);
    }
    setCheckedCategories(updatedCheckedCategories);
  };

  // Filter venues by selected categories and price
  const filterVenues = async () => {
    try {
      const { data } = await axios.post("/api/v1/venue/venue-filters", { checked: checkedCategories, radio });
      setVenues(data.venues);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in filtering venues");
    }
  };

  useEffect(() => {
    if (!checkedCategories.length && !radio.length) {
      getVenues(true); // Reset to all venues if no filters
    } else {
      filterVenues();
    }
  }, [checkedCategories, radio]);

  // Reset filters
  const resetFilters = () => {
    setCheckedCategories([]);
    setRadio([]);
    setPage(1); // Reset the page to 1
    getVenues(true); // Fetch all venues again
  };

  return (
    <Layout title="All Venues - Best of all time offers">
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories.map((category) => (
              <Checkbox
                key={category._id}
                checked={checkedCategories.includes(category._id)}
                onChange={(e) => handleCategoryFilter(e.target.checked, category._id)}
              >
                {category.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group value={radio} onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((price) => (
                <div key={price._id}>
                  <Radio value={price.array}>{price.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={resetFilters}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Venues</h1>
          <div className="d-flex flex-wrap">
            {venues.map((venue) => (
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
                        currency: "KSH",
                      })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {venue.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${venue.slug}`)}
                    >
                      More Details
                    </button>
                    <Link to={`/book/${venue.slug}`}>
                      <button className="btn btn-dark ms-2">Book Now</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="m-2 p-3">
            {venues.length < total && (
              <button className="btn loadmore" onClick={loadMore}>
                {loading ? "Loading ..." : <>Load More <AiOutlineReload /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
