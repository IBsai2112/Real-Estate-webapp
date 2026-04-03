import React, { useState, useMemo } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");

  // Memoize filtered results for better performance
  const filteredProperties = useMemo(() => {
    if (!data) return [];
    
    const searchStr = filter.toLowerCase();
    
    return data.filter(
      (property) =>
        property.title.toLowerCase().includes(searchStr) ||
        property.city.toLowerCase().includes(searchStr) ||
        property.country.toLowerCase().includes(searchStr)
    );
  }, [data, filter]);

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
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
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((card) => (
              <PropertyCard card={card} key={card.id} />
            ))
          ) : (
            <div className="flexCenter" style={{ marginTop: "2rem", opacity: 0.7 }}>
              <span>No properties found matching your search.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;