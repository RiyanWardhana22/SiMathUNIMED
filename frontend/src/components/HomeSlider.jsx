import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../styles/HomeSlider.css";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "25px", zIndex: 2 }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "25px", zIndex: 2 }}
      onClick={onClick}
    />
  );
}

function HomeSlider({ slides }) {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Gambar bertahan 5 detik
    pauseOnHover: false, // Tetap jalan walau dihover agar efek zoom lancar
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const renderSlideContent = (slide) => {
    const Content = () => (
      <>
        <div className="slide-image-wrapper">
          <img
            src={`${import.meta.env.VITE_API_URL}../uploads/images/${
              slide.gambar_path
            }`}
            alt={slide.judul}
            className="slide-image"
          />
          <div className="slide-overlay"></div>
        </div>

        <div className="slide-caption">
          <div className="caption-content">
            <h2 className="slide-title">{slide.judul}</h2>
            {slide.deskripsi_singkat && (
              <p className="slide-desc">{slide.deskripsi_singkat}</p>
            )}

            <span className="slide-btn">
              Selengkapnya <FaArrowRight style={{ marginLeft: "8px" }} />
            </span>
          </div>
        </div>
      </>
    );

    if (slide.link_url && slide.link_url.startsWith("/")) {
      return (
        <Link to={slide.link_url} className="slide-link-wrapper">
          <Content />
        </Link>
      );
    }
    return (
      <a
        href={slide.link_url || "#"}
        className="slide-link-wrapper"
        target={slide.link_url ? "_blank" : "_self"}
        rel="noopener noreferrer"
        style={{ cursor: slide.link_url ? "pointer" : "default" }}
      >
        <Content />
      </a>
    );
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id_slider} className="slide-item">
            {renderSlideContent(slide)}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeSlider;
