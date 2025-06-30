"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import FiltrosProductos from "./FiltrosProductos"
import { CartContext } from "../../context/CartContext" // Importar el contexto del carrito
import "./Tienda.css"

// Importación de imágenes para los destacados
import imgSuplementos from "../../assets/p4.jpg"
import imgRopa from "../../assets/p23.jpg"
import imgEntrenamiento from "../../assets/p26.jpg"
import imgTecnologia from "../../assets/p27.jpg"
// Importación de imágenes para el carrusel
import producto1 from "../../assets/p3.jpg"
import producto2 from "../../assets/p4.jpg"
import producto3 from "../../assets/p5.jpg"
import producto4 from "../../assets/p6.jpg"
import producto5 from "../../assets/p7.jpg"
import producto6 from "../../assets/p8.jpg"
import producto7 from "../../assets/p9.jpg"
import producto8 from "../../assets/p10.jpg"
import producto9 from "../../assets/p11.jpg"
import producto10 from "../../assets/p12.jpg"
import producto11 from "../../assets/p13.jpg"
import producto12 from "../../assets/p14.jpg"
import producto13 from "../../assets/p15.jpg"
import producto14 from "../../assets/p16.jpg"
import producto15 from "../../assets/p17.jpg"
import producto16 from "../../assets/p18.jpg"
import producto17 from "../../assets/p19.jpg"
import producto18 from "../../assets/p20.jpg"
import producto19 from "../../assets/p21.jpg"
import producto20 from "../../assets/p22.jpg"
import producto21 from "../../assets/p23.jpg"
import producto22 from "../../assets/p24.jpg"
import producto23 from "../../assets/p25.jpg"
import producto25 from "../../assets/p27.jpg"
import producto26 from "../../assets/p28.jpg"

// Importación de iconos
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaShoppingCart,
  FaUser,
  FaAngleDown,
  FaDumbbell,
  FaTshirt,
  FaHeadphones,
  FaFlask,
  FaCheck,
} from "react-icons/fa"

// 🔥 Lista de productos en el carrusel
const productosCarrusel = [
  {
    id: 1,
    nombre: "Life Pro Essentials Cla Clarinol 1000mg 90",
    precio: "$1,750.00 MXN",
    precioNumerico: 1750,
    categoria: "Suplementos",
    subcategoria: "Suplementos",
    marca: "Life Pro",
    calificacion: 5,
    descuento: "10%",
    imagen: producto1,
    descripcion:
      "Life Pro Essentials CLA Clarinol es un suplemento de ácido linoleico conjugado de alta calidad, diseñado para apoyar la pérdida de grasa y el mantenimiento de la masa muscular durante programas de entrenamiento intenso.",
    caracteristicas: [
      "1000mg de CLA por cápsula",
      "90 cápsulas por envase",
      "Ayuda a reducir la grasa corporal",
      "Promueve el mantenimiento de la masa muscular",
      "Sin estimulantes",
    ],
  },
  {
    id: 2,
    nombre: "Suplemento Optimum Nutrition Proteína Gold",
    precio: "$1,429.00 MXN",
    precioNumerico: 1429,
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    marca: "Optimum Nutrition",
    calificacion: 4,
    descuento: "25%",
    imagen: producto2,
    descripcion:
      "Gold Standard 100% Whey de Optimum Nutrition es la proteína más vendida del mundo. Cada porción proporciona 24g de proteína de suero de leche de rápida absorción con aminoácidos esenciales para el soporte muscular y la recuperación después del entrenamiento.",
    caracteristicas: [
      "24g de proteína por porción",
      "5.5g de BCAAs naturales",
      "4g de glutamina y precursores de glutamina",
      "Bajo en azúcares y grasas",
      "Disponible en múltiples sabores",
    ],
  },
  {
    id: 3,
    nombre: "Proteína Dymatize ISO 100 Hidrolizada 5lbs",
    precio: "$1,750.00 MXN",
    precioNumerico: 1750,
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    marca: "Dymatize",
    calificacion: 5,
    descuento: "10%",
    imagen: producto3,
    descripcion:
      "Dymatize ISO 100 es una proteína de suero hidrolizada de la más alta calidad y pureza. Cada porción proporciona 25g de proteína de rápida absorción y está virtualmente libre de grasas y azúcares, ideal para atletas que buscan maximizar la recuperación muscular.",
    caracteristicas: [
      "25g de proteína por porción",
      "Aislado de proteína de suero hidrolizado",
      "Menos de 1g de azúcar y grasa por porción",
      "5.5g de BCAAs por porción",
      "Certificado por Informed-Choice",
    ],
  },
  {
    id: 4,
    nombre: "Carnivor 4.5 lbs 56 porciones",
    precio: "$950.00 MXN",
    precioNumerico: 950,
    categoria: "Suplementos",
    subcategoria: "Ganadores de Masa",
    marca: "MuscleMeds",
    calificacion: 4,
    descuento: "25%",
    imagen: producto4,
    descripcion:
      "Carnivor es el primer aislado de proteína de carne de res del mundo. Proporciona 23g de proteína por porción, es libre de grasa y colesterol, y contiene creatina y BCAAs. Carnivor Beef Protein se asimila más rápido que las proteínas de suero, huevo y pollo.",
    caracteristicas: [
      "23g de proteína por porción",
      "Libre de grasa y colesterol",
      "Contiene creatina y BCAAs",
      "Se asimila más rápido que otras proteínas",
      "56 porciones por envase",
    ],
  },
  {
    id: 5,
    nombre: "BCAA 6000 Mega Caps",
    precio: "$1,200.00 MXN",
    precioNumerico: 1200,
    categoria: "Suplementos",
    subcategoria: "Aminoácidos",
    marca: "Olimp Sport",
    calificacion: 5,
    descuento: "10%",
    imagen: producto5,
    descripcion:
      "BCAA 6000 Mega Caps de Olimp Sport contiene una potente dosis de aminoácidos de cadena ramificada (leucina, isoleucina y valina) en proporción 2:1:1. Estos aminoácidos son esenciales para la síntesis de proteínas y la recuperación muscular.",
    caracteristicas: [
      "6000mg de BCAAs por porción",
      "Proporción 2:1:1 (Leucina:Isoleucina:Valina)",
      "Ayuda a prevenir el catabolismo muscular",
      "Promueve la recuperación muscular",
      "Formato en cápsulas para mayor comodidad",
    ],
  },
  {
    id: 6,
    nombre: "Creatina Monohidratada 300g",
    precio: "$899.00 MXN",
    precioNumerico: 899,
    categoria: "Suplementos",
    subcategoria: "Creatina",
    marca: "Universal Nutrition",
    calificacion: 4,
    descuento: "25%",
    imagen: producto6,
    descripcion:
      "La Creatina Monohidratada de Universal Nutrition es uno de los suplementos más estudiados y efectivos para aumentar la fuerza, potencia y rendimiento en entrenamientos de alta intensidad. Cada porción proporciona 5g de creatina pura de la más alta calidad.",
    caracteristicas: [
      "5g de creatina monohidratada por porción",
      "Aumenta la fuerza y potencia muscular",
      "Mejora el rendimiento en entrenamientos de alta intensidad",
      "Promueve la recuperación muscular",
      "60 porciones por envase",
    ],
  },
  {
    id: 7,
    nombre: "Proteína Whey Isolate 2kg",
    precio: "$2,000.00 MXN",
    precioNumerico: 2000,
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    marca: "ON",
    calificacion: 5,
    descuento: "10%",
    imagen: producto7,
    descripcion:
      "Whey Isolate de ON es un aislado de proteína de suero de la más alta calidad, con un 90% de proteína por peso. Cada porción proporciona 27g de proteína pura con mínimas cantidades de grasa y carbohidratos, ideal para atletas que buscan maximizar su ingesta de proteínas sin calorías adicionales.",
    caracteristicas: [
      "27g de proteína por porción",
      "Menos de 1g de grasa y carbohidratos",
      "Rápida absorción",
      "Ideal para definición muscular",
      "Más de 65 porciones por envase",
    ],
  },
  {
    id: 8,
    nombre: "Mass Gainer 5kg",
    precio: "$1,600.00 MXN",
    precioNumerico: 1600,
    categoria: "Suplementos",
    subcategoria: "Ganadores de Masa",
    marca: "BSN",
    calificacion: 4,
    descuento: "25%",
    imagen: producto8,
    descripcion:
      "Mass Gainer de BSN es una fórmula avanzada para aumentar de peso y masa muscular. Cada porción proporciona 1250 calorías, 50g de proteína y 250g de carbohidratos, ideal para personas con metabolismo acelerado que buscan ganar peso y masa muscular de forma efectiva.",
    caracteristicas: [
      "1250 calorías por porción",
      "50g de proteína por porción",
      "250g de carbohidratos complejos",
      "Contiene enzimas digestivas para mejor absorción",
      "25 porciones por envase",
    ],
  },
  {
    id: 9,
    nombre: "Glutamina Micronizada 500g",
    precio: "$850.00 MXN",
    precioNumerico: 850,
    categoria: "Suplementos",
    subcategoria: "Aminoácidos",
    marca: "Now Sports",
    calificacion: 5,
    descuento: "10%",
    imagen: producto9,
    descripcion:
      "La Glutamina Micronizada de Now Sports es un aminoácido esencial para la recuperación muscular y el soporte del sistema inmunológico. La forma micronizada asegura una mejor absorción y biodisponibilidad, maximizando sus beneficios para atletas y personas activas.",
    caracteristicas: [
      "5g de L-Glutamina pura por porción",
      "Forma micronizada para mejor absorción",
      "Ayuda a la recuperación muscular",
      "Apoya el sistema inmunológico",
      "100 porciones por envase",
    ],
  },
  {
    id: 10,
    nombre: "Pre-Entreno Explosivo 250g",
    precio: "$780.00 MXN",
    precioNumerico: 780,
    categoria: "Suplementos",
    subcategoria: "Pre-Entrenos",
    marca: "C4 Cellucor",
    calificacion: 4,
    descuento: "25%",
    imagen: producto10,
    descripcion:
      "C4 Original es el pre-entrenamiento más vendido de América. Su fórmula explosiva proporciona energía, concentración y bombeo muscular para maximizar cada entrenamiento. Contiene cafeína, beta-alanina, creatina y otros ingredientes para potenciar tu rendimiento.",
    caracteristicas: [
      "150mg de cafeína por porción",
      "1.6g de beta-alanina para resistencia muscular",
      "1g de creatina para fuerza y potencia",
      "Vitaminas B para producción de energía",
      "30 porciones por envase",
    ],
  },
  {
    id: 11,
    nombre: "Óxido Nítrico 60 cápsulas",
    precio: "$650.00 MXN",
    precioNumerico: 650,
    categoria: "Suplementos",
    subcategoria: "Pre-Entrenos",
    marca: "Nitrix",
    calificacion: 5,
    descuento: "10%",
    imagen: producto11,
    descripcion:
      "Nitrix es un potente vasodilatador que aumenta la producción de óxido nítrico en el cuerpo, mejorando el flujo sanguíneo y el bombeo muscular durante el entrenamiento. Esto resulta en mejores entrenamientos, mayor congestión muscular y mejor recuperación.",
    caracteristicas: [
      "3g de arginina por porción",
      "Aumenta la producción de óxido nítrico",
      "Mejora el flujo sanguíneo y bombeo muscular",
      "Promueve mejor recuperación",
      "30 porciones por envase",
    ],
  },
  {
    id: 12,
    nombre: "Proteína Vegana 1kg",
    precio: "$1,500.00 MXN",
    precioNumerico: 1500,
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    marca: "Vega",
    calificacion: 4,
    descuento: "25%",
    imagen: producto12,
    descripcion:
      "Proteína Vegana de Vega es una mezcla completa de proteínas vegetales de guisante, arroz integral, sacha inchi y cáñamo. Proporciona 25g de proteína por porción con un perfil completo de aminoácidos, ideal para veganos, vegetarianos o personas con intolerancia a la lactosa.",
    caracteristicas: [
      "25g de proteína vegetal por porción",
      "Perfil completo de aminoácidos",
      "Sin lactosa, gluten ni soya",
      "Incluye probióticos y enzimas digestivas",
      "20 porciones por envase",
    ],
  },
  {
    id: 13,
    nombre: "Caseína Micelar 2lb",
    precio: "$1,800.00 MXN",
    precioNumerico: 1800,
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    marca: "Optimum Nutrition",
    calificacion: 5,
    descuento: "10%",
    imagen: producto13,
    descripcion:
      "La Caseína Micelar de Optimum Nutrition es una proteína de liberación lenta, ideal para tomar antes de dormir o entre comidas. Proporciona un flujo constante de aminoácidos durante varias horas, ayudando a prevenir el catabolismo muscular y promoviendo la recuperación durante períodos prolongados sin alimentos.",
    caracteristicas: [
      "24g de proteína por porción",
      "Liberación lenta de aminoácidos (hasta 8 horas)",
      "Ideal para tomar antes de dormir",
      "Ayuda a prevenir el catabolismo muscular",
      "Contiene enzimas digestivas para mejor absorción",
    ],
  },
  {
    id: 14,
    nombre: "Omega 3 Ultra Concentrado",
    precio: "$500.00 MXN",
    precioNumerico: 500,
    categoria: "Suplementos",
    subcategoria: "Aceites Esenciales",
    marca: "Nordic Naturals",
    calificacion: 4,
    descuento: "25%",
    imagen: producto14,
    descripcion:
      "Omega 3 Ultra Concentrado de Nordic Naturals proporciona altas dosis de EPA y DHA, ácidos grasos esenciales que apoyan la salud cardiovascular, cerebral y articular. Extraído de pescados salvajes de aguas frías y purificado mediante un proceso patentado para eliminar contaminantes.",
    caracteristicas: [
      "1100mg de Omega 3 por porción",
      "650mg de EPA y 450mg de DHA",
      "Apoya la salud cardiovascular y cerebral",
      "Reduce la inflamación y mejora la recuperación",
      "Sabor a limón para evitar regurgitación",
    ],
  },
  {
    id: 15,
    nombre: "Carbohidratos Rápida Absorción 1.5kg",
    precio: "$1,100.00 MXN",
    precioNumerico: 1100,
    categoria: "Suplementos",
    subcategoria: "Ganadores de Masa",
    marca: "Dymatize",
    calificacion: 5,
    descuento: "10%",
    imagen: producto15,
    descripcion:
      "Carbohidratos de Rápida Absorción de Dymatize es una mezcla de maltodextrina y dextrosa diseñada para reponer rápidamente los niveles de glucógeno muscular después del entrenamiento. Ideal para atletas que buscan maximizar la recuperación y el crecimiento muscular.",
    caracteristicas: [
      "50g de carbohidratos por porción",
      "Mezcla de maltodextrina y dextrosa",
      "Rápida absorción para reposición de glucógeno",
      "Ideal para tomar post-entrenamiento",
      "30 porciones por envase",
    ],
  },
  {
    id: 16,
    nombre: "Multivitamínico Deportivo",
    precio: "$750.00 MXN",
    precioNumerico: 750,
    categoria: "Suplementos",
    subcategoria: "Vitaminas",
    marca: "Animal Pak",
    calificacion: 4,
    descuento: "25%",
    imagen: producto16,
    descripcion:
      "Animal Pak es el multivitamínico más completo para atletas y culturistas. Contiene vitaminas, minerales, aminoácidos, antioxidantes y enzimas digestivas en dosis optimizadas para deportistas que someten su cuerpo a entrenamientos intensos y necesitan un soporte nutricional superior.",
    caracteristicas: [
      "Complejo de vitaminas y minerales en dosis óptimas",
      "Complejo de aminoácidos para soporte muscular",
      "Antioxidantes para combatir el estrés oxidativo",
      "Enzimas digestivas para mejor absorción",
      "Extractos de hierbas para soporte hormonal",
    ],
  },
  {
    id: 17,
    nombre: "Electrolitos en Polvo 500g",
    precio: "$850.00 MXN",
    precioNumerico: 850,
    categoria: "Suplementos",
    subcategoria: "Hidratación",
    marca: "Nuun",
    calificacion: 5,
    descuento: "10%",
    imagen: producto17,
    descripcion:
      "Electrolitos en Polvo de Nuun es una fórmula avanzada de hidratación que repone los electrolitos perdidos durante el ejercicio. Contiene sodio, potasio, magnesio y calcio en proporciones óptimas para una rápida rehidratación y mejor rendimiento durante actividades físicas intensas.",
    caracteristicas: [
      "Contiene sodio, potasio, magnesio y calcio",
      "Bajo en calorías y azúcares",
      "Rápida absorción y biodisponibilidad",
      "Previene calambres y fatiga muscular",
      "50 porciones por envase",
    ],
  },
  {
    id: 18,
    nombre: "Proteína Keto Friendly 1.2kg",
    precio: "$1,700.00 MXN",
    precioNumerico: 1700,
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    marca: "Nuun",
    calificacion: 5,
    descuento: "10%",
    imagen: producto18,
    descripcion:
      "Proteína Keto Friendly es una fórmula especialmente diseñada para personas que siguen una dieta cetogénica. Contiene 25g de proteína por porción con altos niveles de grasas saludables y mínimos carbohidratos, ayudando a mantener el estado de cetosis mientras se apoya el desarrollo muscular.",
    caracteristicas: [
      "25g de proteína por porción",
      "15g de grasas saludables (MCT)",
      "Menos de 2g de carbohidratos netos",
      "Compatible con dieta cetogénica",
      "Sin azúcares añadidos",
    ],
  },
  {
    id: 19,
    nombre: "Ácido Hialurónico + Colágeno",
    precio: "$950.00 MXN",
    precioNumerico: 950,
    categoria: "Suplementos",
    subcategoria: "Vitaminas",
    marca: "Nuun",
    calificacion: 5,
    descuento: "10%",
    imagen: producto19,
    descripcion:
      "Ácido Hialurónico + Colágeno es un suplemento avanzado para la salud de articulaciones, piel y tejido conectivo. El ácido hialurónico mejora la lubricación articular mientras que el colágeno hidrolizado proporciona los bloques de construcción para cartílagos, tendones y piel.",
    caracteristicas: [
      "10g de colágeno hidrolizado por porción",
      "100mg de ácido hialurónico de alta pureza",
      "Contiene vitamina C para mejor síntesis de colágeno",
      "Apoya la salud de articulaciones y piel",
      "30 porciones por envase",
    ],
  },
  {
    id: 20,
    nombre: "Quemador de Grasa Avanzado",
    precio: "$1,300.00 MXN",
    precioNumerico: 1300,
    categoria: "Suplementos",
    subcategoria: "Control de Peso",
    marca: "Nuun",
    calificacion: 5,
    descuento: "10%",
    imagen: producto20,
    descripcion:
      "Quemador de Grasa Avanzado es una potente fórmula termogénica que combina ingredientes como L-carnitina, extracto de té verde, cafeína y pimienta de cayena para acelerar el metabolismo, aumentar la oxidación de grasas y suprimir el apetito, ayudando a maximizar la pérdida de grasa corporal.",
    caracteristicas: [
      "Aumenta el metabolismo basal",
      "Mejora la oxidación de grasas",
      "Proporciona energía y concentración",
      "Ayuda a controlar el apetito",
      "60 cápsulas por envase",
    ],
  },
  {
    id: 21,
    nombre: "Camiseta Dry Fit",
    precio: "$500.00 MXN",
    precioNumerico: 500,
    categoria: "Ropa y accesorios",
    subcategoria: "Camisetas",
    marca: "Nike",
    color: "blue",
    talla: "M",
    genero: "Hombre",
    calificacion: 5,
    descuento: "10%",
    imagen: producto21,
    descripcion:
      "Camiseta Dry Fit de Nike fabricada con tecnología de tejido que aleja el sudor de la piel y favorece su rápida evaporación, ayudándote a mantenerte seco y cómodo durante el entrenamiento. Su diseño ergonómico proporciona libertad de movimiento para cualquier actividad física.",
    caracteristicas: [
      "Tecnología Dry Fit para manejo de humedad",
      "Tejido ligero y transpirable",
      "Costuras planas para evitar rozaduras",
      "Diseño ergonómico para libertad de movimiento",
      "Protección UV integrada",
    ],
  },
  {
    id: 22,
    nombre: "Leggings Deportivos",
    precio: "$750.00 MXN",
    precioNumerico: 750,
    categoria: "Ropa y accesorios",
    subcategoria: "Leggings",
    marca: "Adidas",
    color: "black",
    talla: "S",
    genero: "Mujer",
    calificacion: 4,
    descuento: "25%",
    imagen: producto22,
    descripcion:
      "Leggings Deportivos de Adidas diseñados para ofrecer máxima comodidad y soporte durante cualquier tipo de entrenamiento. Fabricados con tejido elástico de compresión que mejora la circulación sanguínea y reduce la fatiga muscular, con tecnología de control de humedad para mantenerte seca.",
    caracteristicas: [
      "Tejido de compresión para soporte muscular",
      "Tecnología Climalite para control de humedad",
      "Cintura alta para mayor cobertura y soporte",
      "Bolsillo lateral para guardar objetos pequeños",
      "Material opaco para máxima confianza",
    ],
  },
  {
    id: 23,
    nombre: "Cuerda para saltar",
    precio: "$400.00 MXN",
    precioNumerico: 400,
    categoria: "Entrenamiento",
    subcategoria: "Control de Peso",
    marca: "Everlast",
    tipo: "Cardio",
    calificacion: 4,
    descuento: "15%",
    imagen: producto23,
    descripcion:
      "Cuerda para saltar profesional de Everlast, ideal para entrenamiento cardiovascular y quema de calorías. Con rodamientos de alta velocidad y cable ajustable, permite realizar desde saltos básicos hasta técnicas avanzadas de doble salto, perfecto para boxeadores y atletas de CrossFit.",
    caracteristicas: [
      "Rodamientos de alta velocidad",
      "Cable ajustable para diferentes alturas",
      "Mangos ergonómicos antideslizantes",
      "Peso ligero para mayor velocidad",
      "Ideal para entrenamiento HIIT y CrossFit",
    ],
  },
  {
    id: 25,
    nombre: "Smartwatch Fitness",
    precio: "$3,000.00 MXN",
    precioNumerico: 3000,
    categoria: "Tecnología",
    subcategoria: "Control de Peso",
    marca: "Garmin",
    tipo: "Reloj Inteligente",
    calificacion: 5,
    descuento: "5%",
    imagen: producto25,
    descripcion:
      "Smartwatch Fitness de Garmin con GPS integrado y más de 20 perfiles de actividad preinstalados. Monitorea frecuencia cardíaca, niveles de oxígeno en sangre, calidad del sueño y estrés. Incluye funciones avanzadas de entrenamiento como VO2 máx, tiempo de recuperación y carga de entrenamiento.",
    caracteristicas: [
      "GPS integrado de alta precisión",
      "Monitoreo avanzado de métricas de salud",
      "Batería de larga duración (hasta 7 días)",
      "Resistente al agua hasta 50 metros",
      "Compatible con smartphones Android e iOS",
    ],
  },
  {
    id: 26,
    nombre: "Auriculares deportivos",
    precio: "$1,200.00 MXN",
    precioNumerico: 1200,
    categoria: "Tecnología",
    subcategoria: "Control de Peso",
    marca: "Sony",
    tipo: "Auriculares",
    calificacion: 4,
    descuento: "20%",
    imagen: producto26,
    descripcion:
      "Auriculares deportivos inalámbricos de Sony con tecnología Bluetooth 5.0 y resistencia al agua y sudor (IPX7). Diseñados específicamente para actividades deportivas, con ganchos de oreja seguros y almohadillas de silicona en diferentes tamaños para un ajuste personalizado y cómodo durante el ejercicio.",
    caracteristicas: [
      "Bluetooth 5.0 para conexión estable",
      "Resistencia al agua y sudor IPX7",
      "Batería de 10 horas de reproducción",
      "Micrófono integrado para llamadas",
      "Cancelación de ruido para mejor experiencia",
    ],
  },
]

// 🔥 Categorías (solo para el menú desplegable)
const categorias = [
  { id: 1, nombre: "Suplementos", icono: <FaFlask />, ruta: "/" },
  { id: 2, nombre: "Ropa y accesorios", icono: <FaTshirt />, ruta: "/" },
  { id: 3, nombre: "Entrenamiento", icono: <FaDumbbell />, ruta: "/" },
  { id: 4, nombre: "Tecnología", icono: <FaHeadphones />, ruta: "/" },
]

// 🔥 Destacados (Independiente de las categorías)
const destacados = [
  { id: 1, nombre: "Suplementos", imagen: imgSuplementos },
  { id: 2, nombre: "Ropa y accesorios", imagen: imgRopa },
  { id: 3, nombre: "Entrenamiento", imagen: imgEntrenamiento },
  { id: 4, nombre: "Tecnología", imagen: imgTecnologia },
]

// Función para sanitizar entrada del usuario
const sanitizeInput = (input) => {
  return input
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/['";$%&()=+]/g, "")
    .trim()
}

// Función para convertir kebab-case a formato normal
const formatearCategoria = (categoria) => {
  if (!categoria) return null

  // Convertir kebab-case a palabras separadas por espacios
  const palabras = categoria.split("-").map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))

  // Casos especiales
  if (palabras.join(" ") === "Ropa Y Accesorios") {
    return "Ropa y accesorios"
  }

  return palabras.join(" ")
}

const Tienda = () => {
  const [menuCategoriasAbierto, setMenuCategoriasAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const navigate = useNavigate()
  const [indice, setIndice] = useState(0)
  const [productosAgregados, setProductosAgregados] = useState({}) // Estado para controlar los productos agregados

  // Obtener el contexto del carrito
  const { addToCart, getCartItemsCount } = useContext(CartContext)

  // Obtener el parámetro de categoría de la URL
  const { categoria } = useParams()

  // Efecto para establecer la categoría seleccionada basada en la URL
  useEffect(() => {
    if (categoria) {
      const categoriaFormateada = formatearCategoria(categoria)

      // Verificar si la categoría existe en nuestro listado
      const categoriaExiste = categorias.some((cat) => cat.nombre.toLowerCase() === categoriaFormateada.toLowerCase())

      if (categoriaExiste) {
        setCategoriaSeleccionada(categoriaFormateada)
      } else {
        // Si la categoría no existe, redirigir a la tienda principal
        navigate("/tienda")
      }
    } else {
      setCategoriaSeleccionada(null)
    }
  }, [categoria, navigate])

  const siguienteProductos = () => {
    setIndice((prev) => (prev + 1) % (productosCarrusel.length - 4))
  }

  const anteriorProductos = () => {
    setIndice((prev) => (prev === 0 ? productosCarrusel.length - 5 : prev - 1))
  }

  // Alternar visibilidad del menú de categorías
  const toggleMenuCategorias = () => {
    setMenuCategoriasAbierto(!menuCategoriasAbierto)
  }

  // 🔥 Función para resetear la tienda
  const resetearTienda = () => {
    setCategoriaSeleccionada(null)
    setBusqueda("") // También limpiar la búsqueda al resetear
    navigate("/tienda") // Redirigir a la vista original de Tienda
  }

  // Redirigir al hacer clic en una categoría
  const manejarClickCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setMenuCategoriasAbierto(false)
    // Usar una URL amigable para SEO
    navigate(`/tienda/${categoria.toLowerCase().replace(/\s+/g, "-")}`)
  }

  // Función para manejar el clic en el icono del carrito
  const irAlCarrito = () => {
    navigate("/carrito")
  }

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    addToCart(producto)

    // Mostrar confirmación visual
    setProductosAgregados((prev) => ({
      ...prev,
      [producto.id]: true,
    }))

    // Después de un tiempo, quitar la confirmación visual
    setTimeout(() => {
      setProductosAgregados((prev) => ({
        ...prev,
        [producto.id]: false,
      }))
    }, 2000)
  }

  // 🔥 Mensaje de la promoción
  const mensajePromocion = "¡¡10% DE DESCUENTO EN LA PRIMERA COMPRA!!"

  // 🔥 Función para duplicar el texto dinámicamente
  const generarTextoPromocional = () => {
    return (
      <>
        <span className="oferta-texto">{mensajePromocion}</span>
        <span className="oferta-texto">{mensajePromocion}</span>
        <span className="oferta-texto">{mensajePromocion}</span>
      </>
    )
  }

  // Obtener el número de productos en el carrito
  const cartItemsCount = getCartItemsCount()

  // Función para ver detalle de un producto
  const verDetalleProducto = (producto) => {
    navigate(`/detalle-producto/${producto.id}`, { state: { producto } })
  }

  return (
    <div className="contenedor_Tienda">
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs categoriaSeleccionada={categoriaSeleccionada} onResetearTienda={resetearTienda} />
      </div>

      {/* 🔥 Menú de Categorías */}
      <div className="menu-tienda">
        <div className="categorias-container">
          <button className={`btn-categorias ${menuCategoriasAbierto ? "activo" : ""}`} onClick={toggleMenuCategorias}>
            Categorías <FaAngleDown className={menuCategoriasAbierto ? "rotate" : ""} />
          </button>

          <div className={`categorias-dropdown ${menuCategoriasAbierto ? "visible" : ""}`}>
            {categorias.map((cat) => (
              <button key={cat.id} className="categoria-opcion" onClick={() => manejarClickCategoria(cat.nombre)}>
                {cat.icono} {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* 🔥 Barra de búsqueda */}
        <div className="barra-busqueda">
         
          <input
            type="text"
            placeholder="Buscar Productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(sanitizeInput(e.target.value))}
          />
        </div>

        <div className="iconos-menu">
          <FaBell className="icono" />
          {/* Modificar el icono del carrito para que redirija al componente Carrito */}
          <div className="carrito-container">
            <FaShoppingCart className="icono" onClick={irAlCarrito} style={{ cursor: "pointer" }} />
            {cartItemsCount > 0 && <span className="carrito-contador">{cartItemsCount}</span>}
          </div>
          <FaUser className="icono" />
        </div>
      </div>

      {/* 🔥 Lógica para mostrar productos o filtros según la búsqueda y la categoría */}
      {categoriaSeleccionada ? (
        <FiltrosProductos
          categoria={categoriaSeleccionada}
          productos={productosCarrusel}
          busqueda={busqueda}
          onAgregarAlCarrito={agregarAlCarrito}
          productosAgregados={productosAgregados}
        />
      ) : busqueda ? (
        <section className="contenedor-productos">
          {productosCarrusel
            .filter((producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map((producto) => (
              <div key={producto.id} className="tarjeta-producto" onClick={() => verDetalleProducto(producto)}>
                {producto.descuento && <div className="etiqueta-descuento">{producto.descuento}</div>}
                <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="imagen-producto" />
                <h3 className="nombre-producto">{producto.nombre}</h3>
                <p className="precio-producto">{producto.precio}</p>
                <button
                  className={`btn-agregar ${productosAgregados[producto.id] ? "agregado" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation() // Evitar que el clic se propague a la tarjeta
                    agregarAlCarrito(producto)
                  }}
                  disabled={productosAgregados[producto.id]}
                >
                  {productosAgregados[producto.id] ? (
                    <>
                      <FaCheck /> Agregado
                    </>
                  ) : (
                    "Agregar al carrito"
                  )}
                </button>
              </div>
            ))}
        </section>
      ) : (
        <>
          {/* 🔥 Barra de Promoción */}
          <div className="barra-oferta">
            <div className="oferta-contenedor">{generarTextoPromocional()}</div>
          </div>

          {/* 🔥 Sección de Destacados */}
          <section className="destacados">
            <h2 className="titulo-destacados">DESTACADOS</h2>
            <div className="destacados-contenedor">
              {destacados.map((destacado) => (
                <div
                  key={destacado.id}
                  className="destacado-card"
                  onClick={() => manejarClickCategoria(destacado.nombre)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={destacado.imagen || "/placeholder.svg"} alt={destacado.nombre} />
                  <p>{destacado.nombre}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🔥 Sección del Carrusel */}
          <section className="carrusel">
            <div className="carrusel-descuento">
              <p className="oferta-titulo">¡¡ ÚLTIMA OPORTUNIDAD !!</p>
              <h2 className="oferta-subtitulo">HASTA UN</h2>
              <h1 className="oferta-porcentaje">25%</h1>
              <p className="oferta-texto-adicional">EN PRODUCTOS SELECCIONADOS</p>
            </div>

            <div className="carrusel-productos">
              <button className="btn-carrusel izquierda" onClick={anteriorProductos}>
                <FaChevronLeft />
              </button>

              <div className="productos-activos" style={{ transform: `translateX(-${indice * 25}%)` }}>
                {productosCarrusel.map((producto) => (
                  <div key={producto.id} className="producto-card">
                    <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} />
                    <div className="producto-info">
                      <h3>
                        {producto.nombre.length > 20 ? `${producto.nombre.substring(0, 20)}...` : producto.nombre}
                      </h3>
                      <p className="producto-precio">{producto.precio}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-carrusel derecha" onClick={siguienteProductos}>
                <FaChevronRight />
              </button>
            </div>
          </section>

          {/* 🔥 Sección de Productos */}
          <section className="seccion-productos">
            <div className="contenedor-productos">
              {productosCarrusel.map((producto) => (
                <div key={producto.id} className="tarjeta-producto" onClick={() => verDetalleProducto(producto)}>
                  {producto.descuento && <div className="etiqueta-descuento">{producto.descuento}</div>}
                  <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="imagen-producto" />
                  <h3 className="nombre-producto">{producto.nombre}</h3>
                  <p className="precio-producto">{producto.precio}</p>
                  <button
                    className={`btn-agregar ${productosAgregados[producto.id] ? "agregado" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation() // Evitar que el clic se propague a la tarjeta
                      agregarAlCarrito(producto)
                    }}
                    disabled={productosAgregados[producto.id]}
                  >
                    {productosAgregados[producto.id] ? (
                      <>
                        <FaCheck /> Agregado
                      </>
                    ) : (
                      "Agregar al carrito"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <FooterH />
    </div>
  )
}

export default Tienda

