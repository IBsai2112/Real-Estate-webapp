import React, { useContext, useState, useMemo } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";

const Favourites = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { favourites },
  } = useContext(UserDetailContext);

  // Memoize the filtered list to optimize performance
  const filteredProperties = useMemo(() => {
    if (!data) return [];

    return data
      .filter((property) => favourites?.includes(property.id))
      .filter((property) => {
        const searchStr = filter.toLowerCase();
        return (
          property.title.toLowerCase().includes(searchStr) ||
          property.city.toLowerCase().includes(searchStr) ||
          property.country.toLowerCase().includes(searchStr)
        );
      });
  }, [data, favourites, filter]);

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
            <div className="flexCenter" style={{ marginTop: "2rem", opacity: 0.6 }}>
              <span>No favorite properties found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourites;