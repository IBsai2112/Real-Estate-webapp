import React, { useContext, useState, useMemo } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";

const Bookings = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { bookings },
  } = useContext(UserDetailContext);

  // 1. Memoize filtered data to prevent unnecessary re-calculations on every re-render
  const filteredBookings = useMemo(() => {
    if (!data || !bookings) return [];

    // Create a Set of IDs for O(1) lookup efficiency
    const bookedIds = new Set(bookings.map((b) => b.id));

    return data
      .filter((property) => bookedIds.has(property.id))
      .filter((property) =>
        [property.title, property.city, property.country].some((field) =>
          field.toLowerCase().includes(filter.toLowerCase())
        )
      );
  }, [data, bookings, filter]);

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
          {filteredBookings.length > 0 ? (
            filteredBookings.map((card, i) => (
              <PropertyCard card={card} key={card.id || i} />
            ))
          ) : (
            <div className="flexCenter" style={{ marginTop: "2rem" }}>
              <span>No bookings found matching your criteria.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;