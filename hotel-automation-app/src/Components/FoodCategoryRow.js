import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/FoodCategoryRow.css';

const FoodCategoryRow = ({ categories }) => {
    const sliderRef = React.useRef(null);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        draggable: true,
        swipeToSlide: true,
        touchThreshold: 10,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const handleCategoryClick = (category) => {
        const categorySection = document.getElementById(category);
        if (categorySection) {
            categorySection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    };

    return (
        <div className="food-category-slider" style={{ position: "relative" }} onWheel={(e) => e.stopPropagation()}>
            <div className="slider-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2><b>What's on your mind? 🤔</b></h2>
                <div className="slider-arrows" style={{ display: "flex", alignItems: "center" }}>
                    <SamplePrevArrow onClick={() => sliderRef.current.slickPrev()} />
                    <SampleNextArrow onClick={() => sliderRef.current.slickNext()} />
                </div>
            </div>

            <Slider ref={sliderRef} {...settings} onWheel={(e) => e.stopPropagation()}>
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="category-card" >
                        {items.map((item, index) => (
                            <div key={index} className="category-image-container" >
                                {index === 0 && item.image && (
                                    <>
                                        <img className="category-image" onClick={() => handleCategoryClick(category)} src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`} alt={item.productName} />
                                        <div className="category-title" onClick={() => handleCategoryClick(category)}>{category}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

// Custom arrow components
const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="arrow-wrapper left"
            onClick={onClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="24"><path fill="#6E83B7" d="m10 256 200 150v-80h156V186H210v-80zM394 186h40v140h-40zM462 186h40v140h-40z" /></svg>
        </div>
    );
};

const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="arrow-wrapper"
            onClick={onClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="24"><path fill="#6E83B7" d="M502 256 302 106v80H146v140h156v80zM78 186h40v140H78zM10 186h40v140H10z" /></svg>
        </div>
    );
};

export default FoodCategoryRow;
