import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "../styles/HomeSlider.css";

function HomeSlider({ slides }) {
  const settings = {
    dots: true, // Tampilkan titik-titik navigasi
    infinite: true, // Loop tak terbatas
    speed: 500, // Kecepatan transisi (ms)
    slidesToShow: 1, // Tampilkan 1 slide sekaligus
    slidesToScroll: 1,
    autoplay: true, // Putar otomatis
    autoplaySpeed: 3000, // Pindah setiap 4 detik
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id_slider} className="slide-item">
            {slide.link_url && slide.link_url.startsWith("/") ? (
              <Link to={slide.link_url}>
                <img
                  src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                    slide.gambar_path
                  }`}
                  alt={slide.judul}
                  className="slide-image"
                />
              </Link>
            ) : (
              <a
                href={slide.link_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                    slide.gambar_path
                  }`}
                  alt={slide.judul}
                  className="slide-image"
                />
              </a>
            )}

            {/* Teks di atas gambar */}
            <div className="slide-caption">
              <h2>{slide.judul}</h2>
              <p>{slide.deskripsi_singkat}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeSlider;
