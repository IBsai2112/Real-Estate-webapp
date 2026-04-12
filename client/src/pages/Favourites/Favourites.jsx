import React, { useContext, useState, useMemo, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";
import { motion } from "framer-motion"; // Suggesting framer-motion for smooth entry

const Favourites = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { favourites },
  } = useContext(UserDetailContext);

  // Detail: Automatically scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoize the filtered list to optimize performance
  const filteredProperties = useMemo(() => {
    if (!data) return [];

    // DETAIL: Using a Set for O(1) lookup efficiency
    const favoriteSet = new Set(favourites || []);
    const searchStr = filter.toLowerCase().trim();

    return data
      .filter((property) => favoriteSet.has(property.id))
      .filter((property) => 
        [property?.title, property?.city, property?.country].some(field => 
          field?.toLowerCase().includes(searchStr)
        )
      );
  }, [data, favourites, filter]);

  if (isError) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <span className="errorText">Error while fetching data. Please check your connection.</span>
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
        {/* Detail: Added a clear header for better UX */}
        <div className="flexColStart f-header" style={{width: "100%", gap: "0.5rem"}}>
          <span className="orangeText">Your Choices</span>
          <span className="primaryText">Favorite Properties</span>
        </div>

        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((card, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={card.id}
              >
                <PropertyCard card={card} />
              </motion.div>
            ))
          ) : (
            <div className="flexCenter empty-message" style={{ marginTop: "4rem", textAlign: "center" }}>
              <div className="flexColCenter">
                <span className="secondaryText" style={{ fontSize: "1.5rem" }}>
                   {filter 
                    ? `We couldn't find "${filter}" in your favorites.` 
                    : "Your favorites list is empty!"}
                </span>
                <p style={{ marginTop: "1rem" }}>
                  {filter ? "Try a different search term." : "Go to the properties page to add some!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourites;