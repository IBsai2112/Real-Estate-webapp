 import React, { useState, useMemo, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { motion } from "framer-motion"; // For smooth entry animations

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");

  // DETAIL: Ensure the user starts at the top of the list when navigating here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoize filtered results to ensure smooth typing in SearchBar
  const filteredProperties = useMemo(() => {
    if (!data) return [];
    
    const searchStr = filter.toLowerCase().trim();
    
    return data.filter((property) => 
      [property?.title, property?.city, property?.country].some((field) => 
        field?.toLowerCase().includes(searchStr)
      )
    );
  }, [data, filter]);

  if (isError) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <span className="errorText">Error while fetching data. Please try again later.</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        {/* DETAIL: Page Heading for better structure */}
        <div className="flexColStart p-header" style={{ width: "100%", gap: "0.5rem" }}>
          <span className="orangeText">Our Listings</span>
          <span className="primaryText">Discover Best Properties</span>
        </div>

        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((card, index) => (
              /* DETAIL: Staggered entry animation for a premium feel */
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <PropertyCard card={card} />
              </motion.div>
            ))
          ) : (
            <div className="flexCenter empty-message" style={{ marginTop: "4rem" }}>
              <div className="flexColCenter">
                <span className="secondaryText" style={{ fontSize: "1.5rem" }}>
                  Oops! No matches for "{filter}"
                </span>
                <p style={{ marginTop: "1rem", color: "#8c8c8c" }}>
                  Try checking your spelling or using different keywords.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;