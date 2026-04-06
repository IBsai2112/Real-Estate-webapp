import React, { useState, useMemo } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");

  // Memoize filtered results to ensure smooth typing in SearchBar
  const filteredProperties = useMemo(() => {
    if (!data) return [];
    
    const searchStr = filter.toLowerCase().trim();
    
    return data.filter((property) => 
      // Check multiple fields using .some() for cleaner code
      [property?.title, property?.city, property?.country].some((field) => 
        field?.toLowerCase().includes(searchStr)
      )
    );
  }, [data, filter]);

  // Error State
  if (isError) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <span>Error while fetching data. Please try again later.</span>
      </div>
    );
  }

  // Loading State
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
        {/* Search functionality */}
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((card) => (
              <PropertyCard card={card} key={card.id} />
            ))
          ) : (
            <div className="flexCenter" style={{ marginTop: "4rem", opacity: 0.6 }}>
              <h3>No properties found matching "{filter}"</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;