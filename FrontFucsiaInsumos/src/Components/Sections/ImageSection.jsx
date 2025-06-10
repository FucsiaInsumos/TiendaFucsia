import React from 'react';
import { Link } from 'react-router-dom';
import image1 from '../../assets/imgVarias/img1.jpeg';
import image2 from '../../assets/imgVarias/img2.jpeg';
import image3 from '../../assets/imgVarias/img3.jpeg';

const ImageSection = () => {
    return (
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
              <Link to="/seccion1">
                <img
                  src={image3}
                  alt="Sección 1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Sección 1</span>
                </div>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="relative h-32 lg:h-48 rounded-lg overflow-hidden">
                <Link to="/seccion2">
                  <img
                    src={image1}
                    alt="Sección 2"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Sección 2</span>
                  </div>
                </Link>
              </div>
              <div className="relative h-32 lg:h-48 rounded-lg overflow-hidden">
                <Link to="/seccion3">
                  <img
                    src={image2}
                    alt="Sección 3"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Sección 3</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    };

export default ImageSection;