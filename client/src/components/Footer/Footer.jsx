import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
        <div className="flexColStart f-left">
          <a href="/" className="logo-container">
            <div className="text-logo">
            <span>VisionPlots</span>
            </div>
          </a>
          {/* <img src="./logo2.png" alt="" width={120} /> */}
          <span className="secondaryText">
            Our vision is to help you find <br />
            the perfect ground to build your dreams.
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">Goa</span>
          <div className="flexCenter f-menu">
            <span>Property</span>
            <span>Services</span>
            <span>Product</span>
            <span>About Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
