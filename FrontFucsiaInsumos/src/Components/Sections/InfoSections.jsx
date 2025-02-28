import React from "react";
import { useNavigate } from "react-router-dom";
import envioImg from '../../assets/envio.png';
import compraImg from '../../assets/compra.png';
import pagosImg from '../../assets/pagos.png';

const sections = [
  {
    id: "como-comprar",
    title: "CÓMO COMPRAR",
    description: "En 3 simples pasos",
    icon: compraImg, // Reemplaza con la imagen importada
    route: "/como-comprar",
  },
  {
    id: "pago-farmacia",
    title: "PAGÁ ONLINE ",
    description: " O abona en el local cuando retires",
    icon: pagosImg, // Reemplaza con la imagen importada
    route: "/pago-farmacia",
  },
  {
    id: "envio-gratis",
    title: "ENVÍO GRATIS",
    description: "Con compras mayores a $20000",
    icon: envioImg, // Reemplaza con la imagen importada
    route: "/envio-gratis",
  },
];

const InfoSections = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-gray-100 py-8 px-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="w-full md:w-64 flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          onClick={() => navigate(section.route)}
        >
          <img src={section.icon} alt={section.title} className="w-16 h-16" />
          <h3 className="text-cyan-500 font-bold text-lg mt-4 text-center">{section.title}</h3>
          <p className="text-gray-600 text-sm text-center">{section.description}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoSections;

