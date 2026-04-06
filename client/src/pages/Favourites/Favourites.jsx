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

    // DETAIL: Using a Set for O(1) lookup efficiency instead of .includes() O(n)
    const favoriteSet = new Set(favourites || []);
    const searchStr = filter.toLowerCase().trim();

    return data
      .filter((property) => favoriteSet.has(property.id))
      .filter((property) => 
        // Cleaner checking using .some() for better readability
        [property?.title, property?.city, property?.country].some(field => 
          field?.toLowerCase().includes(searchStr)
        )
      );
  }, [data, favourites, filter]);

  if (isError) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <span>Error while fetching data. Please try again later.</span>
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
            <div className="flexCenter" style={{ marginTop: "4rem", opacity: 0.6 }}>
              <h3>
                {filter 
                  ? `No favorites match "${filter}"` 
                  : "You haven't added any favorites yet!"}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourites;