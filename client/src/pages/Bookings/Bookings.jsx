import React, { useContext, useState, useMemo, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";
import { motion } from "framer-motion";

const Bookings = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { bookings },
  } = useContext(UserDetailContext);

  // DETAIL: Reset scroll position when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoize filtered results for performance
  const filteredBookings = useMemo(() => {
    if (!data || !bookings) return [];

    // DETAIL: Create a Set of booked IDs for O(1) lookup speed
    const bookedIds = new Set(bookings.map((booking) => booking.id));
    const searchStr = filter.toLowerCase().trim();

    return data
      .filter((property) => bookedIds.has(property.id))
      .filter((property) =>
        [property?.title, property?.city, property?.country].some((field) =>
          field?.toLowerCase().includes(searchStr)
        )
      );
  }, [data, bookings, filter]);

  if (isError) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <span className="errorText">Error while fetching your bookings. Please try again.</span>
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
        {/* DETAIL: Consistent header styling */}
        <div className="flexColStart p-header" style={{ width: "100%", gap: "0.5rem" }}>
          <span className="orangeText">My Trips</span>
          <span className="primaryText">Booked Properties</span>
        </div>

        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((card, index) => (
              /* DETAIL: Staggered entry animation */
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PropertyCard card={card} />
              </motion.div>
            ))
          ) : (
            <div className="flexCenter empty-message" style={{ marginTop: "4rem" }}>
              <div className="flexColCenter">
                <span className="secondaryText" style={{ fontSize: "1.5rem" }}>
                  {filter 
                    ? `No bookings match "${filter}"` 
                    : "You haven't booked any properties yet!"}
                </span>
                <p style={{ marginTop: "1rem", color: "#8c8c8c" }}>
                  {filter 
                    ? "Try adjusting your search filters." 
                    : "Explore our listings and find your next stay!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;