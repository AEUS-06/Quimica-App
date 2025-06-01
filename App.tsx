import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import Orientation from 'react-native-orientation-locker';

// Colores por grupo
const coloresPorGrupo: {[key: number]: string} = {
  1: '#FF6B6B',    // Alcalinos (rojo)
  2: '#FFA502',    // Alcalinotérreos (naranja)
  3: '#FFD700',    // Tierras raras (dorado)
  4: '#7BED9F',    // Grupo 4 (verde claro)
  5: '#70A1FF',    // Grupo 5 (azul claro)
  6: '#A55EEA',    // Grupo 6 (morado)
  7: '#FF7F50',    // Grupo 7 (coral)
  8: '#FF6348',    // Grupo 8 (tomate)
  9: '#FFD700',    // Grupo 9 (oro)
  10: '#2ED573',   // Grupo 10 (verde)
  11: '#1E90FF',   // Grupo 11 (azul dodger)
  12: '#9B59B6',   // Grupo 12 (púrpura)
  13: '#FF6B81',   // Grupo 13 (rosa)
  14: '#F39C12',   // Grupo 14 (naranja oscuro)
  15: '#26C6DA',   // Grupo 15 (turquesa)
  16: '#2ECC71',   // Grupo 16 (verde esmeralda)
  17: '#3498DB',   // Halógenos (azul)
  18: '#9B59B6',   // Gases nobles (púrpura oscuro)
};

// Definición de tipo para los elementos
type Elemento = {
  simbolo: string;
  nombre: string;
  numeroAtomico: number;
  grupo: number;
  periodo: number;
  configElectronica: string;
  electronegatividad?: number;
  tipo: string;
  valencia: number;
  masa: number | string;
  radio: number;
  estado: string;
  descubrimiento: string | number;
  protones: number;
  neutrones: number;
  electrones: number;
  isotopos: string[];
  caracteristicas: string;
};

const elementos: Elemento[] = [
  {
    simbolo: "H", nombre: "Hidrógeno", numeroAtomico: 1, grupo: 1, periodo: 1,
    configElectronica: "1s¹", electronegatividad: 2.20, tipo: "No metal", 
    valencia: 1, masa: 1.008, radio: 53, estado: "Gas", descubrimiento: 1766,
    protones: 1, neutrones: 0, electrones: 1,
    isotopos: ["¹H (99.98%)", "²H (0.02%)", "³H (trazas)"],
    caracteristicas: "Elemento más ligero y abundante del universo."
  },
  {
    simbolo: "He", nombre: "Helio", numeroAtomico: 2, grupo: 18, periodo: 1,
    configElectronica: "1s²", electronegatividad: 0, tipo: "Gas noble", 
    valencia: 0, masa: 4.0026, radio: 31, estado: "Gas", descubrimiento: 1868,
    protones: 2, neutrones: 2, electrones: 2,
    isotopos: ["³He (0.0001%)", "⁴He (99.9999%)"],
    caracteristicas: "Gas inerte, usado en globos y criogenia."
  },
  {
    simbolo: "Li", nombre: "Litio", numeroAtomico: 3, grupo: 1, periodo: 2,
    configElectronica: "[He] 2s¹", electronegatividad: 0.98, tipo: "Metal alcalino", 
    valencia: 1, masa: 6.94, radio: 167, estado: "Sólido", descubrimiento: 1817,
    protones: 3, neutrones: 4, electrones: 3,
    isotopos: ["⁶Li (7.5%)", "⁷Li (92.5%)"],
    caracteristicas: "Usado en baterías recargables."
  },
  {
    simbolo: "Be", nombre: "Berilio", numeroAtomico: 4, grupo: 2, periodo: 2,
    configElectronica: "[He] 2s²", electronegatividad: 1.57, tipo: "Metal alcalinotérreo", 
    valencia: 2, masa: 9.0122, radio: 112, estado: "Sólido", descubrimiento: 1798,
    protones: 4, neutrones: 5, electrones: 4,
    isotopos: ["⁹Be (100%)"],
    caracteristicas: "Tóxico, usado en aleaciones ligeras."
  },
  {
    simbolo: "B", nombre: "Boro", numeroAtomico: 5, grupo: 13, periodo: 2,
    configElectronica: "[He] 2s² 2p¹", electronegatividad: 2.04, tipo: "Metaloide", 
    valencia: 3, masa: 10.81, radio: 87, estado: "Sólido", descubrimiento: 1808,
    protones: 5, neutrones: 6, electrones: 5,
    isotopos: ["¹⁰B (20%)", "¹¹B (80%)"],
    caracteristicas: "Usado en vidrios y cerámicas."
  },
  {
    simbolo: "C", nombre: "Carbono", numeroAtomico: 6, grupo: 14, periodo: 2,
    configElectronica: "[He] 2s² 2p²", electronegatividad: 2.55, tipo: "No metal", 
    valencia: 4, masa: 12.011, radio: 67, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 6, neutrones: 6, electrones: 6,
    isotopos: ["¹²C (98.9%)", "¹³C (1.1%)", "¹⁴C (trazas)"],
    caracteristicas: "Base de la vida orgánica."
  },
  {
    simbolo: "N", nombre: "Nitrógeno", numeroAtomico: 7, grupo: 15, periodo: 2,
    configElectronica: "[He] 2s² 2p³", electronegatividad: 3.04, tipo: "No metal", 
    valencia: 3, masa: 14.007, radio: 56, estado: "Gas", descubrimiento: 1772,
    protones: 7, neutrones: 7, electrones: 7,
    isotopos: ["¹⁴N (99.6%)", "¹⁵N (0.4%)"],
    caracteristicas: "Componente principal del aire (78%)."
  },
  {
    simbolo: "O", nombre: "Oxígeno", numeroAtomico: 8, grupo: 16, periodo: 2,
    configElectronica: "[He] 2s² 2p⁴", electronegatividad: 3.44, tipo: "No metal", 
    valencia: 2, masa: 15.999, radio: 48, estado: "Gas", descubrimiento: 1774,
    protones: 8, neutrones: 8, electrones: 8,
    isotopos: ["¹⁶O (99.76%)", "¹⁷O (0.04%)", "¹⁸O (0.2%)"],
    caracteristicas: "Esencial para la respiración."
  },
  {
    simbolo: "F", nombre: "Flúor", numeroAtomico: 9, grupo: 17, periodo: 2,
    configElectronica: "[He] 2s² 2p⁵", electronegatividad: 3.98, tipo: "Halógeno", 
    valencia: 1, masa: 18.998, radio: 42, estado: "Gas", descubrimiento: 1886,
    protones: 9, neutrones: 10, electrones: 9,
    isotopos: ["¹⁹F (100%)"],
    caracteristicas: "Elemento más electronegativo."
  },
  {
    simbolo: "Ne", nombre: "Neón", numeroAtomico: 10, grupo: 18, periodo: 2,
    configElectronica: "[He] 2s² 2p⁶", electronegatividad: 0, tipo: "Gas noble", 
    valencia: 0, masa: 20.180, radio: 38, estado: "Gas", descubrimiento: 1898,
    protones: 10, neutrones: 10, electrones: 10,
    isotopos: ["²⁰Ne (90.5%)", "²¹Ne (0.3%)", "²²Ne (9.2%)"],
    caracteristicas: "Usado en letreros luminosos."
  },
  {
    simbolo: "Na", nombre: "Sodio", numeroAtomico: 11, grupo: 1, periodo: 3,
    configElectronica: "[Ne] 3s¹", electronegatividad: 0.93, tipo: "Metal alcalino", 
    valencia: 1, masa: 22.990, radio: 190, estado: "Sólido", descubrimiento: 1807,
    protones: 11, neutrones: 12, electrones: 11,
    isotopos: ["²³Na (100%)"],
    caracteristicas: "Componente de la sal común."
  },
  {
    simbolo: "Mg", nombre: "Magnesio", numeroAtomico: 12, grupo: 2, periodo: 3,
    configElectronica: "[Ne] 3s²", electronegatividad: 1.31, tipo: "Metal alcalinotérreo", 
    valencia: 2, masa: 24.305, radio: 145, estado: "Sólido", descubrimiento: 1755,
    protones: 12, neutrones: 12, electrones: 12,
    isotopos: ["²⁴Mg (79%)", "²⁵Mg (10%)", "²⁶Mg (11%)"],
    caracteristicas: "Esencial para la fotosíntesis."
  },
  {
    simbolo: "Al", nombre: "Aluminio", numeroAtomico: 13, grupo: 13, periodo: 3,
    configElectronica: "[Ne] 3s² 3p¹", electronegatividad: 1.61, tipo: "Metal", 
    valencia: 3, masa: 26.982, radio: 118, estado: "Sólido", descubrimiento: 1825,
    protones: 13, neutrones: 14, electrones: 13,
    isotopos: ["²⁷Al (100%)"],
    caracteristicas: "Metal ligero resistente a la corrosión."
  },
  {
    simbolo: "Si", nombre: "Silicio", numeroAtomico: 14, grupo: 14, periodo: 3,
    configElectronica: "[Ne] 3s² 3p²", electronegatividad: 1.90, tipo: "Metaloide", 
    valencia: 4, masa: 28.085, radio: 111, estado: "Sólido", descubrimiento: 1824,
    protones: 14, neutrones: 14, electrones: 14,
    isotopos: ["²⁸Si (92.2%)", "²⁹Si (4.7%)", "³⁰Si (3.1%)"],
    caracteristicas: "Fundamental en electrónica."
  },
  {
    simbolo: "P", nombre: "Fósforo", numeroAtomico: 15, grupo: 15, periodo: 3,
    configElectronica: "[Ne] 3s² 3p³", electronegatividad: 2.19, tipo: "No metal", 
    valencia: 3, masa: 30.974, radio: 98, estado: "Sólido", descubrimiento: 1669,
    protones: 15, neutrones: 16, electrones: 15,
    isotopos: ["³¹P (100%)"],
    caracteristicas: "Componente de ADN y ATP."
  },
  {
    simbolo: "S", nombre: "Azufre", numeroAtomico: 16, grupo: 16, periodo: 3,
    configElectronica: "[Ne] 3s² 3p⁴", electronegatividad: 2.58, tipo: "No metal", 
    valencia: 2, masa: 32.06, radio: 88, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 16, neutrones: 16, electrones: 16,
    isotopos: ["³²S (95%)", "³³S (0.8%)", "³⁴S (4.2%)"],
    caracteristicas: "Usado en ácido sulfúrico."
  },
  {
    simbolo: "Cl", nombre: "Cloro", numeroAtomico: 17, grupo: 17, periodo: 3,
    configElectronica: "[Ne] 3s² 3p⁵", electronegatividad: 3.16, tipo: "Halógeno", 
    valencia: 1, masa: 35.45, radio: 79, estado: "Gas", descubrimiento: 1774,
    protones: 17, neutrones: 18, electrones: 17,
    isotopos: ["³⁵Cl (76%)", "³⁷Cl (24%)"],
    caracteristicas: "Usado en desinfección de agua."
  },
  {
    simbolo: "Ar", nombre: "Argón", numeroAtomico: 18, grupo: 18, periodo: 3,
    configElectronica: "[Ne] 3s² 3p⁶", electronegatividad: 0, tipo: "Gas noble", 
    valencia: 0, masa: 39.948, radio: 71, estado: "Gas", descubrimiento: 1894,
    protones: 18, neutrones: 22, electrones: 18,
    isotopos: ["³⁶Ar (0.3%)", "³⁸Ar (0.1%)", "⁴⁰Ar (99.6%)"],
    caracteristicas: "Usado en iluminación."
  },
  {
    simbolo: "K", nombre: "Potasio", numeroAtomico: 19, grupo: 1, periodo: 4,
    configElectronica: "[Ar] 4s¹", electronegatividad: 0.82, tipo: "Metal alcalino", 
    valencia: 1, masa: 39.098, radio: 243, estado: "Sólido", descubrimiento: 1807,
    protones: 19, neutrones: 20, electrones: 19,
    isotopos: ["³⁹K (93.3%)", "⁴⁰K (0.01%)", "⁴¹K (6.7%)"],
    caracteristicas: "Esencial para la función nerviosa."
  },
  {
    simbolo: "Ca", nombre: "Calcio", numeroAtomico: 20, grupo: 2, periodo: 4,
    configElectronica: "[Ar] 4s²", electronegatividad: 1.00, tipo: "Metal alcalinotérreo", 
    valencia: 2, masa: 40.078, radio: 194, estado: "Sólido", descubrimiento: 1808,
    protones: 20, neutrones: 20, electrones: 20,
    isotopos: ["⁴⁰Ca (97%)", "⁴²Ca (0.6%)", "⁴³Ca (0.1%)"],
    caracteristicas: "Esencial para huesos y dientes."
  },
   {
    simbolo: "Sc", nombre: "Escandio", numeroAtomico: 21, grupo: 3, periodo: 4,
    configElectronica: "[Ar] 3d¹ 4s²", electronegatividad: 1.36, tipo: "Metal de transición", 
    valencia: 3, masa: 44.956, radio: 184, estado: "Sólido", descubrimiento: 1879,
    protones: 21, neutrones: 24, electrones: 21,
    isotopos: ["⁴⁵Sc (100%)"],
    caracteristicas: "Usado en aleaciones ligeras y lámparas."
  },
  {
    simbolo: "Ti", nombre: "Titanio", numeroAtomico: 22, grupo: 4, periodo: 4,
    configElectronica: "[Ar] 3d² 4s²", electronegatividad: 1.54, tipo: "Metal de transición", 
    valencia: 4, masa: 47.867, radio: 176, estado: "Sólido", descubrimiento: 1791,
    protones: 22, neutrones: 26, electrones: 22,
    isotopos: ["⁴⁶Ti (8%)", "⁴⁷Ti (7.3%)", "⁴⁸Ti (73.8%)"],
    caracteristicas: "Resistente a la corrosión, usado en implantes médicos."
  },
  {
    simbolo: "V", nombre: "Vanadio", numeroAtomico: 23, grupo: 5, periodo: 4,
    configElectronica: "[Ar] 3d³ 4s²", electronegatividad: 1.63, tipo: "Metal de transición", 
    valencia: 5, masa: 50.942, radio: 171, estado: "Sólido", descubrimiento: 1801,
    protones: 23, neutrones: 28, electrones: 23,
    isotopos: ["⁵⁰V (0.2%)", "⁵¹V (99.8%)"],
    caracteristicas: "Endurece el acero para herramientas."
  },
  {
    simbolo: "Cr", nombre: "Cromo", numeroAtomico: 24, grupo: 6, periodo: 4,
    configElectronica: "[Ar] 3d⁵ 4s¹", electronegatividad: 1.66, tipo: "Metal de transición", 
    valencia: 3, masa: 51.996, radio: 166, estado: "Sólido", descubrimiento: 1797,
    protones: 24, neutrones: 28, electrones: 24,
    isotopos: ["⁵²Cr (83.8%)", "⁵³Cr (9.5%)", "⁵⁴Cr (2.4%)"],
    caracteristicas: "Componente clave de aceros inoxidables."
  },
  {
    simbolo: "Mn", nombre: "Manganeso", numeroAtomico: 25, grupo: 7, periodo: 4,
    configElectronica: "[Ar] 3d⁵ 4s²", electronegatividad: 1.55, tipo: "Metal de transición", 
    valencia: 7, masa: 54.938, radio: 161, estado: "Sólido", descubrimiento: 1774,
    protones: 25, neutrones: 30, electrones: 25,
    isotopos: ["⁵⁵Mn (100%)"],
    caracteristicas: "Esencial en la producción de acero."
  },
  {
    simbolo: "Fe", nombre: "Hierro", numeroAtomico: 26, grupo: 8, periodo: 4,
    configElectronica: "[Ar] 3d⁶ 4s²", electronegatividad: 1.83, tipo: "Metal de transición", 
    valencia: 3, masa: 55.845, radio: 156, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 26, neutrones: 30, electrones: 26,
    isotopos: ["⁵⁴Fe (5.8%)", "⁵⁶Fe (91.7%)", "⁵⁷Fe (2.2%)"],
    caracteristicas: "Componente principal del núcleo terrestre."
  },
  {
    simbolo: "Co", nombre: "Cobalto", numeroAtomico: 27, grupo: 9, periodo: 4,
    configElectronica: "[Ar] 3d⁷ 4s²", electronegatividad: 1.88, tipo: "Metal de transición", 
    valencia: 3, masa: 58.933, radio: 152, estado: "Sólido", descubrimiento: 1735,
    protones: 27, neutrones: 32, electrones: 27,
    isotopos: ["⁵⁹Co (100%)"],
    caracteristicas: "Usado en imanes y baterías recargables."
  },
  {
    simbolo: "Ni", nombre: "Níquel", numeroAtomico: 28, grupo: 10, periodo: 4,
    configElectronica: "[Ar] 3d⁸ 4s²", electronegatividad: 1.91, tipo: "Metal de transición", 
    valencia: 2, masa: 58.693, radio: 149, estado: "Sólido", descubrimiento: 1751,
    protones: 28, neutrones: 31, electrones: 28,
    isotopos: ["⁵⁸Ni (68%)", "⁶⁰Ni (26%)", "⁶²Ni (3.6%)"],
    caracteristicas: "Componente de aceros inoxidables."
  },
  {
    simbolo: "Cu", nombre: "Cobre", numeroAtomico: 29, grupo: 11, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s¹", electronegatividad: 1.90, tipo: "Metal de transición", 
    valencia: 2, masa: 63.546, radio: 145, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 29, neutrones: 35, electrones: 29,
    isotopos: ["⁶³Cu (69%)", "⁶⁵Cu (31%)"],
    caracteristicas: "Excelente conductor eléctrico."
  },
  {
    simbolo: "Zn", nombre: "Zinc", numeroAtomico: 30, grupo: 12, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s²", electronegatividad: 1.65, tipo: "Metal de transición", 
    valencia: 2, masa: 65.38, radio: 142, estado: "Sólido", descubrimiento: 1746,
    protones: 30, neutrones: 35, electrones: 30,
    isotopos: ["⁶⁴Zn (49%)", "⁶⁶Zn (28%)", "⁶⁸Zn (19%)"],
    caracteristicas: "Usado en galvanización y baterías."
  },
  {
    simbolo: "Ga", nombre: "Galio", numeroAtomico: 31, grupo: 13, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s² 4p¹", electronegatividad: 1.81, tipo: "Metal", 
    valencia: 3, masa: 69.723, radio: 136, estado: "Sólido", descubrimiento: 1875,
    protones: 31, neutrones: 39, electrones: 31,
    isotopos: ["⁶⁹Ga (60%)", "⁷¹Ga (40%)"],
    caracteristicas: "Se derrite a temperatura ambiente."
  },
  {
    simbolo: "Ge", nombre: "Germanio", numeroAtomico: 32, grupo: 14, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s² 4p²", electronegatividad: 2.01, tipo: "Metaloide", 
    valencia: 4, masa: 72.630, radio: 125, estado: "Sólido", descubrimiento: 1886,
    protones: 32, neutrones: 41, electrones: 32,
    isotopos: ["⁷⁰Ge (21%)", "⁷²Ge (27%)", "⁷⁴Ge (36%)"],
    caracteristicas: "Semiconductor usado en electrónica."
  },
  {
    simbolo: "As", nombre: "Arsénico", numeroAtomico: 33, grupo: 15, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s² 4p³", electronegatividad: 2.18, tipo: "Metaloide", 
    valencia: 3, masa: 74.922, radio: 114, estado: "Sólido", descubrimiento: "Edad Media",
    protones: 33, neutrones: 42, electrones: 33,
    isotopos: ["⁷⁵As (100%)"],
    caracteristicas: "Tóxico pero usado en semiconductores."
  },
  {
    simbolo: "Se", nombre: "Selenio", numeroAtomico: 34, grupo: 16, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s² 4p⁴", electronegatividad: 2.55, tipo: "No metal", 
    valencia: 2, masa: 78.971, radio: 103, estado: "Sólido", descubrimiento: 1817,
    protones: 34, neutrones: 45, electrones: 34,
    isotopos: ["⁷⁴Se (0.9%)", "⁷⁶Se (9%)", "⁷⁸Se (23%)"],
    caracteristicas: "Esencial en enzimas antioxidantes."
  },
  {
    simbolo: "Br", nombre: "Bromo", numeroAtomico: 35, grupo: 17, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s² 4p⁵", electronegatividad: 2.96, tipo: "Halógeno", 
    valencia: 1, masa: 79.904, radio: 94, estado: "Líquido", descubrimiento: 1826,
    protones: 35, neutrones: 45, electrones: 35,
    isotopos: ["⁷⁹Br (51%)", "⁸¹Br (49%)"],
    caracteristicas: "Único halógeno líquido a temperatura ambiente."
  },
  {
    simbolo: "Kr", nombre: "Kriptón", numeroAtomico: 36, grupo: 18, periodo: 4,
    configElectronica: "[Ar] 3d¹⁰ 4s² 4p⁶", electronegatividad: 3.00, tipo: "Gas noble", 
    valencia: 0, masa: 83.798, radio: 88, estado: "Gas", descubrimiento: 1898,
    protones: 36, neutrones: 48, electrones: 36,
    isotopos: ["⁷⁸Kr (0.4%)", "⁸⁰Kr (2.3%)", "⁸⁴Kr (57%)"],
    caracteristicas: "Usado en lámparas de flash fotográfico."
  },
  {
    simbolo: "Rb", nombre: "Rubidio", numeroAtomico: 37, grupo: 1, periodo: 5,
    configElectronica: "[Kr] 5s¹", electronegatividad: 0.82, tipo: "Metal alcalino", 
    valencia: 1, masa: 85.468, radio: 265, estado: "Sólido", descubrimiento: 1861,
    protones: 37, neutrones: 48, electrones: 37,
    isotopos: ["⁸⁵Rb (72%)", "⁸⁷Rb (28%)"],
    caracteristicas: "Usado en relojes atómicos."
  },
  {
    simbolo: "Sr", nombre: "Estroncio", numeroAtomico: 38, grupo: 2, periodo: 5,
    configElectronica: "[Kr] 5s²", electronegatividad: 0.95, tipo: "Metal alcalinotérreo", 
    valencia: 2, masa: 87.62, radio: 219, estado: "Sólido", descubrimiento: 1790,
    protones: 38, neutrones: 50, electrones: 38,
    isotopos: ["⁸⁴Sr (0.6%)", "⁸⁶Sr (10%)", "⁸⁷Sr (7%)"],
    caracteristicas: "Da color rojo a fuegos artificiales."
  },
  {
    simbolo: "Y", nombre: "Itrio", numeroAtomico: 39, grupo: 3, periodo: 5,
    configElectronica: "[Kr] 4d¹ 5s²", electronegatividad: 1.22, tipo: "Metal de transición", 
    valencia: 3, masa: 88.906, radio: 212, estado: "Sólido", descubrimiento: 1794,
    protones: 39, neutrones: 50, electrones: 39,
    isotopos: ["⁸⁹Y (100%)"],
    caracteristicas: "Componente de superconductores."
  },
  {
    simbolo: "Zr", nombre: "Circonio", numeroAtomico: 40, grupo: 4, periodo: 5,
    configElectronica: "[Kr] 4d² 5s²", electronegatividad: 1.33, tipo: "Metal de transición", 
    valencia: 4, masa: 91.224, radio: 206, estado: "Sólido", descubrimiento: 1789,
    protones: 40, neutrones: 51, electrones: 40,
    isotopos: ["⁹⁰Zr (51%)", "⁹¹Zr (11%)", "⁹²Zr (17%)"],
    caracteristicas: "Resistente a la corrosión en reactores nucleares."
  },
  {
    simbolo: "Nb", nombre: "Niobio", numeroAtomico: 41, grupo: 5, periodo: 5,
    configElectronica: "[Kr] 4d⁴ 5s¹", electronegatividad: 1.6, tipo: "Metal de transición",
    valencia: 5, masa: 92.906, radio: 198, estado: "Sólido", descubrimiento: 1801,
    protones: 41, neutrones: 52, electrones: 41,
    isotopos: ["⁹³Nb (100%)"],
    caracteristicas: "Usado en aleaciones para cohetes."
  },
  {
    simbolo: "Mo", nombre: "Molibdeno", numeroAtomico: 42, grupo: 6, periodo: 5,
    configElectronica: "[Kr] 4d⁵ 5s¹", electronegatividad: 2.16, tipo: "Metal de transición",
    valencia: 6, masa: 95.95, radio: 190, estado: "Sólido", descubrimiento: 1778,
    protones: 42, neutrones: 54, electrones: 42,
    isotopos: ["⁹²Mo (15%)", "⁹⁴Mo (9%)", "⁹⁵Mo (16%)"],
    caracteristicas: "Esencial para algunas enzimas."
  },
  {
    simbolo: "Tc", nombre: "Tecnecio", numeroAtomico: 43, grupo: 7, periodo: 5,
    configElectronica: "[Kr] 4d⁵ 5s²", electronegatividad: 1.9, tipo: "Metal de transición",
    valencia: 7, masa: 98, radio: 183, estado: "Sólido", descubrimiento: 1937,
    protones: 43, neutrones: 55, electrones: 43,
    isotopos: ["⁹⁷Tc", "⁹⁸Tc", "⁹⁹Tc"],
    caracteristicas: "Primer elemento artificial, radiactivo."
  },
  {
    simbolo: "Ru", nombre: "Rutenio", numeroAtomico: 44, grupo: 8, periodo: 5,
    configElectronica: "[Kr] 4d⁷ 5s¹", electronegatividad: 2.2, tipo: "Metal de transición",
    valencia: 4, masa: 101.07, radio: 178, estado: "Sólido", descubrimiento: 1844,
    protones: 44, neutrones: 57, electrones: 44,
    isotopos: ["⁹⁶Ru (5.5%)", "⁹⁸Ru (1.9%)", "⁹⁹Ru (12.7%)"],
    caracteristicas: "Usado en joyería y catalizadores."
  },
  {
    simbolo: "Rh", nombre: "Rodio", numeroAtomico: 45, grupo: 9, periodo: 5,
    configElectronica: "[Kr] 4d⁸ 5s¹", electronegatividad: 2.28, tipo: "Metal de transición",
    valencia: 3, masa: 102.91, radio: 173, estado: "Sólido", descubrimiento: 1803,
    protones: 45, neutrones: 58, electrones: 45,
    isotopos: ["¹⁰³Rh (100%)"],
    caracteristicas: "Metal precioso usado en convertidores catalíticos."
  },
  {
    simbolo: "Pd", nombre: "Paladio", numeroAtomico: 46, grupo: 10, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰", electronegatividad: 2.20, tipo: "Metal de transición",
    valencia: 2, masa: 106.42, radio: 169, estado: "Sólido", descubrimiento: 1803,
    protones: 46, neutrones: 60, electrones: 46,
    isotopos: ["¹⁰²Pd (1%)", "¹⁰⁴Pd (11%)", "¹⁰⁵Pd (22%)"],
    caracteristicas: "Usado en catalizadores automotrices."
  },
  {
    simbolo: "Ag", nombre: "Plata", numeroAtomico: 47, grupo: 11, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s¹", electronegatividad: 1.93, tipo: "Metal de transición",
    valencia: 1, masa: 107.87, radio: 165, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 47, neutrones: 61, electrones: 47,
    isotopos: ["¹⁰⁷Ag (51.8%)", "¹⁰⁹Ag (48.2%)"],
    caracteristicas: "Excelente conductor térmico y eléctrico."
  },
  {
    simbolo: "Cd", nombre: "Cadmio", numeroAtomico: 48, grupo: 12, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s²", electronegatividad: 1.69, tipo: "Metal de transición",
    valencia: 2, masa: 112.41, radio: 161, estado: "Sólido", descubrimiento: 1817,
    protones: 48, neutrones: 64, electrones: 48,
    isotopos: ["¹⁰⁶Cd (1.2%)", "¹⁰⁸Cd (0.9%)", "¹¹⁰Cd (12.5%)"],
    caracteristicas: "Usado en baterías recargables."
  },
  {
    simbolo: "In", nombre: "Indio", numeroAtomico: 49, grupo: 13, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s² 5p¹", electronegatividad: 1.78, tipo: "Metal",
    valencia: 3, masa: 114.82, radio: 156, estado: "Sólido", descubrimiento: 1863,
    protones: 49, neutrones: 66, electrones: 49,
    isotopos: ["¹¹³In (4.3%)", "¹¹⁵In (95.7%)"],
    caracteristicas: "Componente clave de pantallas táctiles."
  },
  {
    simbolo: "Sn", nombre: "Estaño", numeroAtomico: 50, grupo: 14, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s² 5p²", electronegatividad: 1.96, tipo: "Metal",
    valencia: 4, masa: 118.71, radio: 145, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 50, neutrones: 69, electrones: 50,
    isotopos: ["¹¹²Sn (0.97%)", "¹¹⁴Sn (0.66%)", "¹¹⁸Sn (24.2%)"],
    caracteristicas: "Usado en soldaduras y envases."
  },
  {
    simbolo: "Sb", nombre: "Antimonio", numeroAtomico: 51, grupo: 15, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s² 5p³", electronegatividad: 2.05, tipo: "Metaloide",
    valencia: 3, masa: 121.76, radio: 133, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 51, neutrones: 71, electrones: 51,
    isotopos: ["¹²¹Sb (57.4%)", "¹²³Sb (42.6%)"],
    caracteristicas: "Usado en retardantes de llama."
  },
  {
    simbolo: "Te", nombre: "Telurio", numeroAtomico: 52, grupo: 16, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s² 5p⁴", electronegatividad: 2.1, tipo: "Metaloide",
    valencia: 2, masa: 127.60, radio: 123, estado: "Sólido", descubrimiento: 1782,
    protones: 52, neutrones: 76, electrones: 52,
    isotopos: ["¹²⁰Te (0.1%)", "¹²²Te (2.6%)", "¹²⁴Te (4.8%)"],
    caracteristicas: "Componente de paneles solares."
  },
  {
    simbolo: "I", nombre: "Yodo", numeroAtomico: 53, grupo: 17, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s² 5p⁵", electronegatividad: 2.66, tipo: "Halógeno",
    valencia: 1, masa: 126.90, radio: 115, estado: "Sólido", descubrimiento: 1811,
    protones: 53, neutrones: 74, electrones: 53,
    isotopos: ["¹²⁷I (100%)"],
    caracteristicas: "Esencial para la función tiroidea."
  },
  {
    simbolo: "Xe", nombre: "Xenón", numeroAtomico: 54, grupo: 18, periodo: 5,
    configElectronica: "[Kr] 4d¹⁰ 5s² 5p⁶", electronegatividad: 2.6, tipo: "Gas noble",
    valencia: 0, masa: 131.29, radio: 108, estado: "Gas", descubrimiento: 1898,
    protones: 54, neutrones: 77, electrones: 54,
    isotopos: ["¹²⁴Xe (0.1%)", "¹²⁶Xe (0.1%)", "¹²⁸Xe (1.9%)"],
    caracteristicas: "Usado en lámparas y anestésicos."
  },
  {
    simbolo: "Cs", nombre: "Cesio", numeroAtomico: 55, grupo: 1, periodo: 6,
    configElectronica: "[Xe] 6s¹", electronegatividad: 0.79, tipo: "Metal alcalino",
    valencia: 1, masa: 132.91, radio: 298, estado: "Sólido", descubrimiento: 1860,
    protones: 55, neutrones: 78, electrones: 55,
    isotopos: ["¹³³Cs (100%)"],
    caracteristicas: "Base de relojes atómicos de alta precisión."
  },
  {
    simbolo: "Ba", nombre: "Bario", numeroAtomico: 56, grupo: 2, periodo: 6,
    configElectronica: "[Xe] 6s²", electronegatividad: 0.89, tipo: "Metal alcalinotérreo",
    valencia: 2, masa: 137.33, radio: 253, estado: "Sólido", descubrimiento: 1808,
    protones: 56, neutrones: 81, electrones: 56,
    isotopos: ["¹³⁰Ba (0.1%)", "¹³²Ba (0.1%)", "¹³⁴Ba (2.4%)"],
    caracteristicas: "Usado en contrastes para rayos X."
  },
  {
    simbolo: "La", nombre: "Lantano", numeroAtomico: 57, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 5d¹ 6s²", electronegatividad: 1.1, tipo: "Lantánido",
    valencia: 3, masa: 138.91, radio: 195, estado: "Sólido", descubrimiento: 1839,
    protones: 57, neutrones: 82, electrones: 57,
    isotopos: ["¹³⁸La (0.09%)", "¹³⁹La (99.91%)"],
    caracteristicas: "Primer elemento de tierras raras."
  },
  {
    simbolo: "Ce", nombre: "Cerio", numeroAtomico: 58, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹ 5d¹ 6s²", electronegatividad: 1.12, tipo: "Lantánido",
    valencia: 3, masa: 140.12, radio: 185, estado: "Sólido", descubrimiento: 1803,
    protones: 58, neutrones: 82, electrones: 58,
    isotopos: ["¹³⁶Ce (0.2%)", "¹³⁸Ce (0.3%)", "¹⁴⁰Ce (88.5%)"],
    caracteristicas: "Usado en catalizadores para automóviles."
  },
  {
    simbolo: "Pr", nombre: "Praseodimio", numeroAtomico: 59, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f³ 6s²", electronegatividad: 1.13, tipo: "Lantánido",
    valencia: 3, masa: 140.91, radio: 185, estado: "Sólido", descubrimiento: 1885,
    protones: 59, neutrones: 82, electrones: 59,
    isotopos: ["¹⁴¹Pr (100%)"],
    caracteristicas: "Componente de imanes de alta resistencia."
  },
  {
    simbolo: "Nd", nombre: "Neodimio", numeroAtomico: 60, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f⁴ 6s²", electronegatividad: 1.14, tipo: "Lantánido",
    valencia: 3, masa: 144.24, radio: 185, estado: "Sólido", descubrimiento: 1885,
    protones: 60, neutrones: 84, electrones: 60,
    isotopos: ["¹⁴²Nd (27.2%)", "¹⁴³Nd (12.2%)", "¹⁴⁴Nd (23.8%)"],
    caracteristicas: "Esencial para imanes permanentes fuertes."
  },
    {
    simbolo: "Pm", nombre: "Prometio", numeroAtomico: 61, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f⁵ 6s²", electronegatividad: 1.13, tipo: "Lantánido",
    valencia: 3, masa: 145, radio: 185, estado: "Sólido", descubrimiento: 1945,
    protones: 61, neutrones: 84, electrones: 61,
    isotopos: ["¹⁴⁵Pm", "¹⁴⁷Pm"],
    caracteristicas: "Elemento radiactivo artificial, usado en baterías nucleares."
  },
  {
    simbolo: "Sm", nombre: "Samario", numeroAtomico: 62, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f⁶ 6s²", electronegatividad: 1.17, tipo: "Lantánido",
    valencia: 3, masa: 150.36, radio: 185, estado: "Sólido", descubrimiento: 1879,
    protones: 62, neutrones: 88, electrones: 62,
    isotopos: ["¹⁴⁴Sm (3.1%)", "¹⁴⁹Sm (13.8%)", "¹⁵⁰Sm (7.4%)"],
    caracteristicas: "Usado en imanes y reactores nucleares."
  },
  {
    simbolo: "Eu", nombre: "Europio", numeroAtomico: 63, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f⁷ 6s²", electronegatividad: 1.2, tipo: "Lantánido",
    valencia: 3, masa: 151.96, radio: 185, estado: "Sólido", descubrimiento: 1901,
    protones: 63, neutrones: 89, electrones: 63,
    isotopos: ["¹⁵¹Eu (47.8%)", "¹⁵³Eu (52.2%)"],
    caracteristicas: "Emite luz roja en pantallas y lámparas fluorescentes."
  },
  {
    simbolo: "Gd", nombre: "Gadolinio", numeroAtomico: 64, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f⁷ 5d¹ 6s²", electronegatividad: 1.2, tipo: "Lantánido",
    valencia: 3, masa: 157.25, radio: 180, estado: "Sólido", descubrimiento: 1880,
    protones: 64, neutrones: 93, electrones: 64,
    isotopos: ["¹⁵⁴Gd (2.2%)", "¹⁵⁵Gd (14.8%)", "¹⁵⁶Gd (20.5%)"],
    caracteristicas: "Usado en contrastes para resonancias magnéticas."
  },
  {
    simbolo: "Tb", nombre: "Terbio", numeroAtomico: 65, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f⁹ 6s²", electronegatividad: 1.2, tipo: "Lantánido",
    valencia: 3, masa: 158.93, radio: 175, estado: "Sólido", descubrimiento: 1843,
    protones: 65, neutrones: 94, electrones: 65,
    isotopos: ["¹⁵⁹Tb (100%)"],
    caracteristicas: "Componente de dispositivos de sonido y láseres."
  },
  {
    simbolo: "Dy", nombre: "Disprosio", numeroAtomico: 66, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹⁰ 6s²", electronegatividad: 1.22, tipo: "Lantánido",
    valencia: 3, masa: 162.50, radio: 175, estado: "Sólido", descubrimiento: 1886,
    protones: 66, neutrones: 97, electrones: 66,
    isotopos: ["¹⁵⁶Dy (0.06%)", "¹⁵⁸Dy (0.1%)", "¹⁶⁰Dy (2.3%)"],
    caracteristicas: "Usado en imanes de alta eficiencia."
  },
  {
    simbolo: "Ho", nombre: "Holmio", numeroAtomico: 67, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹¹ 6s²", electronegatividad: 1.23, tipo: "Lantánido",
    valencia: 3, masa: 164.93, radio: 175, estado: "Sólido", descubrimiento: 1878,
    protones: 67, neutrones: 98, electrones: 67,
    isotopos: ["¹⁶⁵Ho (100%)"],
    caracteristicas: "Aplicaciones en láseres médicos y nucleares."
  },
  {
    simbolo: "Er", nombre: "Erbio", numeroAtomico: 68, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹² 6s²", electronegatividad: 1.24, tipo: "Lantánido",
    valencia: 3, masa: 167.26, radio: 175, estado: "Sólido", descubrimiento: 1843,
    protones: 68, neutrones: 99, electrones: 68,
    isotopos: ["¹⁶²Er (0.1%)", "¹⁶⁴Er (1.6%)", "¹⁶⁶Er (33.5%)"],
    caracteristicas: "Ampliamente usado en fibras ópticas."
  },
  {
    simbolo: "Tm", nombre: "Tulio", numeroAtomico: 69, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹³ 6s²", electronegatividad: 1.25, tipo: "Lantánido",
    valencia: 3, masa: 168.93, radio: 175, estado: "Sólido", descubrimiento: 1879,
    protones: 69, neutrones: 100, electrones: 69,
    isotopos: ["¹⁶⁹Tm (100%)"],
    caracteristicas: "Usado en equipos de rayos X portátiles."
  },
  {
    simbolo: "Yb", nombre: "Iterbio", numeroAtomico: 70, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 6s²", electronegatividad: 1.1, tipo: "Lantánido",
    valencia: 3, masa: 173.05, radio: 175, estado: "Sólido", descubrimiento: 1878,
    protones: 70, neutrones: 103, electrones: 70,
    isotopos: ["¹⁶⁸Yb (0.1%)", "¹⁷⁰Yb (3%)", "¹⁷²Yb (21.9%)"],
    caracteristicas: "Relojes atómicos de alta precisión."
  },
  {
    simbolo: "Lu", nombre: "Lutecio", numeroAtomico: 71, grupo: 3, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹ 6s²", electronegatividad: 1.27, tipo: "Lantánido",
    valencia: 3, masa: 174.97, radio: 175, estado: "Sólido", descubrimiento: 1907,
    protones: 71, neutrones: 104, electrones: 71,
    isotopos: ["¹⁷⁵Lu (97.4%)", "¹⁷⁶Lu (2.6%)"],
    caracteristicas: "Catalizador en refinerías de petróleo."
  },
  {
    simbolo: "Hf", nombre: "Hafnio", numeroAtomico: 72, grupo: 4, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d² 6s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 4, masa: 178.49, radio: 155, estado: "Sólido", descubrimiento: 1923,
    protones: 72, neutrones: 106, electrones: 72,
    isotopos: ["¹⁷⁴Hf (0.2%)", "¹⁷⁶Hf (5.3%)", "¹⁷⁷Hf (18.6%)"],
    caracteristicas: "Usado en reactores nucleares por su absorción de neutrones."
  },
  {
    simbolo: "Ta", nombre: "Tantalio", numeroAtomico: 73, grupo: 5, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d³ 6s²", electronegatividad: 1.5, tipo: "Metal de transición",
    valencia: 5, masa: 180.95, radio: 145, estado: "Sólido", descubrimiento: 1802,
    protones: 73, neutrones: 108, electrones: 73,
    isotopos: ["¹⁸⁰Ta (0.01%)", "¹⁸¹Ta (99.99%)"],
    caracteristicas: "Resistente a la corrosión, usado en electrónica."
  },
  {
    simbolo: "W", nombre: "Wolframio (Tungsteno)", numeroAtomico: 74, grupo: 6, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d⁴ 6s²", electronegatividad: 2.36, tipo: "Metal de transición",
    valencia: 6, masa: 183.84, radio: 135, estado: "Sólido", descubrimiento: 1783,
    protones: 74, neutrones: 110, electrones: 74,
    isotopos: ["¹⁸²W (26.5%)", "¹⁸³W (14.3%)", "¹⁸⁴W (30.6%)"],
    caracteristicas: "Metal con el punto de fusión más alto (3422°C)."
  },
  {
    simbolo: "Re", nombre: "Renio", numeroAtomico: 75, grupo: 7, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d⁵ 6s²", electronegatividad: 1.9, tipo: "Metal de transición",
    valencia: 7, masa: 186.21, radio: 135, estado: "Sólido", descubrimiento: 1925,
    protones: 75, neutrones: 111, electrones: 75,
    isotopos: ["¹⁸⁵Re (37.4%)", "¹⁸⁷Re (62.6%)"],
    caracteristicas: "Usado en turbinas de aviones y catalizadores."
  },
  {
    simbolo: "Os", nombre: "Osmio", numeroAtomico: 76, grupo: 8, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d⁶ 6s²", electronegatividad: 2.2, tipo: "Metal de transición",
    valencia: 4, masa: 190.23, radio: 130, estado: "Sólido", descubrimiento: 1803,
    protones: 76, neutrones: 114, electrones: 76,
    isotopos: ["¹⁸⁴Os (0.02%)", "¹⁸⁷Os (1.6%)", "¹⁸⁸Os (13.3%)"],
    caracteristicas: "Metal más denso (22.59 g/cm³), usado en aleaciones duras."
  },
  {
    simbolo: "Ir", nombre: "Iridio", numeroAtomico: 77, grupo: 9, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d⁷ 6s²", electronegatividad: 2.20, tipo: "Metal de transición",
    valencia: 4, masa: 192.22, radio: 135, estado: "Sólido", descubrimiento: 1803,
    protones: 77, neutrones: 115, electrones: 77,
    isotopos: ["¹⁹¹Ir (37.3%)", "¹⁹³Ir (62.7%)"],
    caracteristicas: "Extremadamente resistente a la corrosión."
  },
  {
    simbolo: "Pt", nombre: "Platino", numeroAtomico: 78, grupo: 10, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d⁹ 6s¹", electronegatividad: 2.28, tipo: "Metal de transición",
    valencia: 4, masa: 195.08, radio: 135, estado: "Sólido", descubrimiento: 1735,
    protones: 78, neutrones: 117, electrones: 78,
    isotopos: ["¹⁹⁴Pt (32.9%)", "¹⁹⁵Pt (33.8%)", "¹⁹⁶Pt (25.3%)"],
    caracteristicas: "Catalizador en vehículos y joyería de lujo."
  },
  {
    simbolo: "Au", nombre: "Oro", numeroAtomico: 79, grupo: 11, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", electronegatividad: 2.54, tipo: "Metal de transición",
    valencia: 3, masa: 196.97, radio: 135, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 79, neutrones: 118, electrones: 79,
    isotopos: ["¹⁹⁷Au (100%)"],
    caracteristicas: "Símbolo de riqueza, usado en electrónica y joyería."
  },
  {
    simbolo: "Hg", nombre: "Mercurio", numeroAtomico: 80, grupo: 12, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", electronegatividad: 2.00, tipo: "Metal de transición",
    valencia: 2, masa: 200.59, radio: 150, estado: "Líquido", descubrimiento: "Antigüedad",
    protones: 80, neutrones: 121, electrones: 80,
    isotopos: ["¹⁹⁶Hg (0.15%)", "¹⁹⁸Hg (10%)", "²⁰²Hg (29.9%)"],
    caracteristicas: "Único metal líquido a temperatura ambiente, tóxico."
  },
    {
    simbolo: "Tl", nombre: "Talio", numeroAtomico: 81, grupo: 13, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", electronegatividad: 1.62, tipo: "Metal",
    valencia: 1, masa: 204.38, radio: 170, estado: "Sólido", descubrimiento: 1861,
    protones: 81, neutrones: 123, electrones: 81,
    isotopos: ["²⁰³Tl (29.5%)", "²⁰⁵Tl (70.5%)"],
    caracteristicas: "Tóxico, usado en detectores de radiación."
  },
  {
    simbolo: "Pb", nombre: "Plomo", numeroAtomico: 82, grupo: 14, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", electronegatividad: 2.33, tipo: "Metal",
    valencia: 4, masa: 207.2, radio: 175, estado: "Sólido", descubrimiento: "Antigüedad",
    protones: 82, neutrones: 125, electrones: 82,
    isotopos: ["²⁰⁴Pb (1.4%)", "²⁰⁶Pb (24.1%)", "²⁰⁷Pb (22.1%)"],
    caracteristicas: "Usado en baterías y blindajes contra radiación."
  },
  {
    simbolo: "Bi", nombre: "Bismuto", numeroAtomico: 83, grupo: 15, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", electronegatividad: 2.02, tipo: "Metal",
    valencia: 3, masa: 208.98, radio: 160, estado: "Sólido", descubrimiento: 1753,
    protones: 83, neutrones: 126, electrones: 83,
    isotopos: ["²⁰⁹Bi (100%)"],
    caracteristicas: "Menos tóxico que otros metales pesados, usado en cosméticos."
  },
  {
    simbolo: "Po", nombre: "Polonio", numeroAtomico: 84, grupo: 16, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", electronegatividad: 2.0, tipo: "Metaloide",
    valencia: 2, masa: 209, radio: 140, estado: "Sólido", descubrimiento: 1898,
    protones: 84, neutrones: 125, electrones: 84,
    isotopos: ["²⁰⁹Po", "²¹⁰Po"],
    caracteristicas: "Altamente radiactivo, usado en fuentes de calor espacial."
  },
  {
    simbolo: "At", nombre: "Ástato", numeroAtomico: 85, grupo: 17, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", electronegatividad: 2.2, tipo: "Halógeno",
    valencia: 1, masa: 210, radio: 140, estado: "Sólido", descubrimiento: 1940,
    protones: 85, neutrones: 125, electrones: 85,
    isotopos: ["²¹⁰At", "²¹¹At"],
    caracteristicas: "Elemento más raro en la naturaleza, radiactivo."
  },
  {
    simbolo: "Rn", nombre: "Radón", numeroAtomico: 86, grupo: 18, periodo: 6,
    configElectronica: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", electronegatividad: 2.2, tipo: "Gas noble",
    valencia: 0, masa: 222, radio: 120, estado: "Gas", descubrimiento: 1900,
    protones: 86, neutrones: 136, electrones: 86,
    isotopos: ["²²²Rn"],
    caracteristicas: "Gas radiactivo, peligroso en espacios cerrados."
  },
  {
    simbolo: "Fr", nombre: "Francio", numeroAtomico: 87, grupo: 1, periodo: 7,
    configElectronica: "[Rn] 7s¹", electronegatividad: 0.7, tipo: "Metal alcalino",
    valencia: 1, masa: 223, radio: 270, estado: "Sólido", descubrimiento: 1939,
    protones: 87, neutrones: 136, electrones: 87,
    isotopos: ["²²³Fr"],
    caracteristicas: "Metal más reactivo, extremadamente raro y radiactivo."
  },
  {
    simbolo: "Ra", nombre: "Radio", numeroAtomico: 88, grupo: 2, periodo: 7,
    configElectronica: "[Rn] 7s²", electronegatividad: 0.9, tipo: "Metal alcalinotérreo",
    valencia: 2, masa: 226, radio: 215, estado: "Sólido", descubrimiento: 1898,
    protones: 88, neutrones: 138, electrones: 88,
    isotopos: ["²²⁶Ra", "²²⁸Ra"],
    caracteristicas: "Usado en medicina (radioterapia), altamente radiactivo."
  },
  {
    simbolo: "Ac", nombre: "Actinio", numeroAtomico: 89, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 6d¹ 7s²", electronegatividad: 1.1, tipo: "Actínido",
    valencia: 3, masa: 227, radio: 195, estado: "Sólido", descubrimiento: 1899,
    protones: 89, neutrones: 138, electrones: 89,
    isotopos: ["²²⁷Ac"],
    caracteristicas: "Similar al lantano, pero radiactivo."
  },
  {
    simbolo: "Th", nombre: "Torio", numeroAtomico: 90, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 6d² 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 4, masa: 232.04, radio: 180, estado: "Sólido", descubrimiento: 1828,
    protones: 90, neutrones: 142, electrones: 90,
    isotopos: ["²³²Th (100%)"],
    caracteristicas: "Combustible potencial en reactores nucleares."
  },
  {
    simbolo: "Pa", nombre: "Protactinio", numeroAtomico: 91, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f² 6d¹ 7s²", electronegatividad: 1.5, tipo: "Actínido",
    valencia: 5, masa: 231.04, radio: 180, estado: "Sólido", descubrimiento: 1913,
    protones: 91, neutrones: 140, electrones: 91,
    isotopos: ["²³¹Pa"],
    caracteristicas: "Uno de los elementos más raros y caros."
  },
  {
    simbolo: "U", nombre: "Uranio", numeroAtomico: 92, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f³ 6d¹ 7s²", electronegatividad: 1.38, tipo: "Actínido",
    valencia: 6, masa: 238.03, radio: 175, estado: "Sólido", descubrimiento: 1789,
    protones: 92, neutrones: 146, electrones: 92,
    isotopos: ["²³⁵U (0.7%)", "²³⁸U (99.3%)"],
    caracteristicas: "Combustible principal en energía nuclear."
  },
  {
    simbolo: "Np", nombre: "Neptunio", numeroAtomico: 93, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f⁴ 6d¹ 7s²", electronegatividad: 1.36, tipo: "Actínido",
    valencia: 5, masa: 237, radio: 175, estado: "Sólido", descubrimiento: 1940,
    protones: 93, neutrones: 144, electrones: 93,
    isotopos: ["²³⁷Np"],
    caracteristicas: "Primer elemento sintético de la serie actínida."
  },
  {
    simbolo: "Pu", nombre: "Plutonio", numeroAtomico: 94, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f⁶ 7s²", electronegatividad: 1.28, tipo: "Actínido",
    valencia: 4, masa: 244, radio: 175, estado: "Sólido", descubrimiento: 1940,
    protones: 94, neutrones: 150, electrones: 94,
    isotopos: ["²³⁹Pu", "²⁴⁰Pu", "²⁴²Pu"],
    caracteristicas: "Usado en armas nucleares y reactores."
  },
  {
    simbolo: "Am", nombre: "Americio", numeroAtomico: 95, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f⁷ 7s²", electronegatividad: 1.13, tipo: "Actínido",
    valencia: 3, masa: 243, radio: 175, estado: "Sólido", descubrimiento: 1944,
    protones: 95, neutrones: 148, electrones: 95,
    isotopos: ["²⁴¹Am", "²⁴³Am"],
    caracteristicas: "Presente en detectores de humo."
  },
  {
    simbolo: "Cm", nombre: "Curio", numeroAtomico: 96, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f⁷ 6d¹ 7s²", electronegatividad: 1.28, tipo: "Actínido",
    valencia: 3, masa: 247, radio: 175, estado: "Sólido", descubrimiento: 1944,
    protones: 96, neutrones: 151, electrones: 96,
    isotopos: ["²⁴⁴Cm", "²⁴⁷Cm"],
    caracteristicas: "Usado en generadores termoeléctricos para naves espaciales."
  },
  {
    simbolo: "Bk", nombre: "Berkelio", numeroAtomico: 97, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f⁹ 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 4, masa: 247, radio: 170, estado: "Sólido", descubrimiento: 1949,
    protones: 97, neutrones: 150, electrones: 97,
    isotopos: ["²⁴⁷Bk", "²⁴⁹Bk"],
    caracteristicas: "Producido en cantidades mínimas (miligramos)."
  },
  {
    simbolo: "Cf", nombre: "Californio", numeroAtomico: 98, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f¹⁰ 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 3, masa: 251, radio: 170, estado: "Sólido", descubrimiento: 1950,
    protones: 98, neutrones: 153, electrones: 98,
    isotopos: ["²⁴⁹Cf", "²⁵²Cf"],
    caracteristicas: "Emisor de neutrones, usado en reactores."
  },
  {
    simbolo: "Es", nombre: "Einstenio", numeroAtomico: 99, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f¹¹ 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 3, masa: 252, radio: 170, estado: "Sólido", descubrimiento: 1952,
    protones: 99, neutrones: 153, electrones: 99,
    isotopos: ["²⁵²Es", "²⁵³Es"],
    caracteristicas: "Sintetizado en explosiones nucleares."
  },
  {
    simbolo: "Fm", nombre: "Fermio", numeroAtomico: 100, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f¹² 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 3, masa: 257, radio: 170, estado: "Sólido", descubrimiento: 1952,
    protones: 100, neutrones: 157, electrones: 100,
    isotopos: ["²⁵⁷Fm"],
    caracteristicas: "Descubierto en residuos de pruebas termonucleares."
  },
  {
    simbolo: "Md", nombre: "Mendelevio", numeroAtomico: 101, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f¹³ 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 3, masa: 258, radio: 170, estado: "Sólido", descubrimiento: 1955,
    protones: 101, neutrones: 157, electrones: 101,
    isotopos: ["²⁵⁸Md"],
    caracteristicas: "Producido en aceleradores de partículas."
  },
  {
    simbolo: "No", nombre: "Nobelio", numeroAtomico: 102, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 2, masa: 259, radio: 170, estado: "Sólido", descubrimiento: 1958,
    protones: 102, neutrones: 157, electrones: 102,
    isotopos: ["²⁵⁹No"],
    caracteristicas: "Inestable, con vida media de minutos."
  },
    {
    simbolo: "Lr", nombre: "Lawrencio", numeroAtomico: 103, grupo: 3, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹ 7s²", electronegatividad: 1.3, tipo: "Actínido",
    valencia: 3, masa: 262, radio: 170, estado: "Sólido", descubrimiento: 1961,
    protones: 103, neutrones: 159, electrones: 103,
    isotopos: ["²⁶²Lr"],
    caracteristicas: "Último actínido, sintetizado en aceleradores."
  },
  {
    simbolo: "Rf", nombre: "Rutherfordio", numeroAtomico: 104, grupo: 4, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d² 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 4, masa: 267, radio: 150, estado: "Sólido", descubrimiento: 1964,
    protones: 104, neutrones: 163, electrones: 104,
    isotopos: ["²⁶⁷Rf"],
    caracteristicas: "Primer elemento superpesado, altamente inestable."
  },
  {
    simbolo: "Db", nombre: "Dubnio", numeroAtomico: 105, grupo: 5, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d³ 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 5, masa: 268, radio: 140, estado: "Sólido", descubrimiento: 1967,
    protones: 105, neutrones: 163, electrones: 105,
    isotopos: ["²⁶⁸Db"],
    caracteristicas: "Solo se han producido unos pocos átomos."
  },
  {
    simbolo: "Sg", nombre: "Seaborgio", numeroAtomico: 106, grupo: 6, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d⁴ 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 6, masa: 271, radio: 140, estado: "Sólido", descubrimiento: 1974,
    protones: 106, neutrones: 165, electrones: 106,
    isotopos: ["²⁷¹Sg"],
    caracteristicas: "Nombrado en honor a Glenn T. Seaborg."
  },
  {
    simbolo: "Bh", nombre: "Bohrio", numeroAtomico: 107, grupo: 7, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d⁵ 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 7, masa: 272, radio: 140, estado: "Sólido", descubrimiento: 1981,
    protones: 107, neutrones: 165, electrones: 107,
    isotopos: ["²⁷²Bh"],
    caracteristicas: "Vida media de solo milisegundos."
  },
  {
    simbolo: "Hs", nombre: "Hassio", numeroAtomico: 108, grupo: 8, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d⁶ 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 8, masa: 270, radio: 135, estado: "Sólido", descubrimiento: 1984,
    protones: 108, neutrones: 162, electrones: 108,
    isotopos: ["²⁷⁰Hs"],
    caracteristicas: "Nombrado en honor a la región alemana de Hesse."
  },
  {
    simbolo: "Mt", nombre: "Meitnerio", numeroAtomico: 109, grupo: 9, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d⁷ 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 9, masa: 276, radio: 135, estado: "Sólido", descubrimiento: 1982,
    protones: 109, neutrones: 167, electrones: 109,
    isotopos: ["²⁷⁶Mt"],
    caracteristicas: "Homenaje a la física Lise Meitner."
  },
  {
    simbolo: "Ds", nombre: "Darmstadtio", numeroAtomico: 110, grupo: 10, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d⁹ 7s¹", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 10, masa: 281, radio: 135, estado: "Sólido", descubrimiento: 1994,
    protones: 110, neutrones: 171, electrones: 110,
    isotopos: ["²⁸¹Ds"],
    caracteristicas: "Sintetizado en el GSI (Alemania)."
  },
  {
    simbolo: "Rg", nombre: "Roentgenio", numeroAtomico: 111, grupo: 11, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s¹", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 11, masa: 280, radio: 135, estado: "Sólido", descubrimiento: 1994,
    protones: 111, neutrones: 169, electrones: 111,
    isotopos: ["²⁸⁰Rg"],
    caracteristicas: "Nombrado en honor a Wilhelm Röntgen."
  },
  {
    simbolo: "Cn", nombre: "Copernicio", numeroAtomico: 112, grupo: 12, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", electronegatividad: 1.3, tipo: "Metal de transición",
    valencia: 2, masa: 285, radio: 130, estado: "Líquido", descubrimiento: 1996,
    protones: 112, neutrones: 173, electrones: 112,
    isotopos: ["²⁸⁵Cn"],
    caracteristicas: "Posiblemente líquido a temperatura ambiente."
  },
  {
    simbolo: "Nh", nombre: "Nihonio", numeroAtomico: 113, grupo: 13, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", electronegatividad: 1.3, tipo: "Metal",
    valencia: 3, masa: 286, radio: 125, estado: "Sólido", descubrimiento: 2003,
    protones: 113, neutrones: 173, electrones: 113,
    isotopos: ["²⁸⁶Nh"],
    caracteristicas: "Primer elemento descubierto en Asia (Japón)."
  },
  {
    simbolo: "Fl", nombre: "Flerovio", numeroAtomico: 114, grupo: 14, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", electronegatividad: 1.3, tipo: "Metal",
    valencia: 4, masa: 289, radio: 120, estado: "Sólido", descubrimiento: 1998,
    protones: 114, neutrones: 175, electrones: 114,
    isotopos: ["²⁸⁹Fl"],
    caracteristicas: "Podría ser un metal volátil."
  },
  {
    simbolo: "Mc", nombre: "Moscovio", numeroAtomico: 115, grupo: 15, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", electronegatividad: 1.3, tipo: "Metal",
    valencia: 5, masa: 290, radio: 120, estado: "Sólido", descubrimiento: 2003,
    protones: 115, neutrones: 175, electrones: 115,
    isotopos: ["²⁹⁰Mc"],
    caracteristicas: "Nombrado en honor a Moscú (Rusia)."
  },
  {
    simbolo: "Lv", nombre: "Livermorio", numeroAtomico: 116, grupo: 16, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", electronegatividad: 1.3, tipo: "Metal",
    valencia: 6, masa: 293, radio: 120, estado: "Sólido", descubrimiento: 2000,
    protones: 116, neutrones: 177, electrones: 116,
    isotopos: ["²⁹³Lv"],
    caracteristicas: "Homenaje al Laboratorio Nacional Lawrence Livermore."
  },
  {
    simbolo: "Ts", nombre: "Teneso", numeroAtomico: 117, grupo: 17, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", electronegatividad: 1.3, tipo: "Halógeno",
    valencia: 7, masa: 294, radio: 115, estado: "Sólido", descubrimiento: 2010,
    protones: 117, neutrones: 177, electrones: 117,
    isotopos: ["²⁹⁴Ts"],
    caracteristicas: "Segundo elemento más pesado conocido."
  },
  {
    simbolo: "Og", nombre: "Oganesón", numeroAtomico: 118, grupo: 18, periodo: 7,
    configElectronica: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", electronegatividad: 1.3, tipo: "Gas noble",
    valencia: 0, masa: 294, radio: 110, estado: "Gas", descubrimiento: 2002,
    protones: 118, neutrones: 176, electrones: 118,
    isotopos: ["²⁹⁴Og"],
    caracteristicas: "Último elemento de la tabla periódica, altamente inestable."
  }
];

const TablaPeriodica = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<Elemento | null>(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => {
      Orientation.unlockAllOrientations();
      subscription?.remove();
    };
  }, []);

  const abrirModal = (elemento: Elemento) => {
    setElementoSeleccionado(elemento);
    setModalVisible(true);
  };

  const getElementPosition = (elemento: Elemento) => {
    const elementSize = dimensions.width < 600 ? 60 : 70;
    let left = (elemento.grupo - 1) * elementSize;
    let top = (elemento.periodo - 1) * elementSize;

    // Posicionamiento de lantánidos y actínidos
    if (elemento.numeroAtomico >= 57 && elemento.numeroAtomico <= 71) {
      left = (elemento.numeroAtomico - 57 + 3) * elementSize;
      top = 8 * elementSize;
    } 
    else if (elemento.numeroAtomico >= 89 && elemento.numeroAtomico <= 103) {
      left = (elemento.numeroAtomico - 89 + 3) * elementSize;
      top = 9 * elementSize;
    }

    return { left, top, size: elementSize };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Tabla Periódica Completa</Text>
        
        <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={true}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollVerticalContainer, 
              { height: 10 * (dimensions.width < 600 ? 60 : 70) + 20 }
            ]}
            showsVerticalScrollIndicator={true}
          >
            <View style={[
              styles.grid, 
              { 
                width: 18 * (dimensions.width < 600 ? 60 : 70),
                height: 10 * (dimensions.width < 600 ? 60 : 70) 
              }
            ]}>
              {elementos.map((elemento, index) => {
                const position = getElementPosition(elemento);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.elemento,
                      {
                        backgroundColor: coloresPorGrupo[elemento.grupo] || '#DDDDDD',
                        left: position.left,
                        top: position.top,
                        width: position.size - 5,
                        height: position.size - 5,
                        borderColor: coloresPorGrupo[elemento.grupo] || '#999999',
                      },
                    ]}
                    onPress={() => abrirModal(elemento)}
                  >
                    <Text style={styles.numeroAtomico}>{elemento.numeroAtomico}</Text>
                    <Text style={styles.simbolo}>{elemento.simbolo}</Text>
                    <Text style={styles.nombre} numberOfLines={1}>{elemento.nombre}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            {elementoSeleccionado && (
              <View style={[
                styles.modalContent, 
                { 
                  backgroundColor: '#1E1E1E',
                  borderColor: coloresPorGrupo[elementoSeleccionado.grupo] || '#999999',
                  width: dimensions.width * 0.95,
                  maxHeight: dimensions.height * 0.9
                }
              ]}>
                {/* Encabezado con icono de elemento */}
                <View style={styles.modalHeader}>
                  <View style={[
                    styles.elementIcon,
                    { backgroundColor: coloresPorGrupo[elementoSeleccionado.grupo] || '#DDDDDD' }
                  ]}>
                    <Text style={styles.elementIconSymbol}>{elementoSeleccionado.simbolo}</Text>
                    <Text style={styles.elementIconNumber}>{elementoSeleccionado.numeroAtomico}</Text>
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.modalTitle}>{elementoSeleccionado.nombre}</Text>
                    <Text style={styles.modalSubtitle}>{elementoSeleccionado.tipo}</Text>
                  </View>
                </View>

                <ScrollView style={styles.modalScrollContent}>
                  {/* Información principal en 2 columnas */}
                  <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Número atómico: </Text>{elementoSeleccionado.numeroAtomico}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Masa atómica: </Text>{elementoSeleccionado.masa} u</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Grupo: </Text>{elementoSeleccionado.grupo}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Periodo: </Text>{elementoSeleccionado.periodo}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Estado: </Text>{elementoSeleccionado.estado}</Text>
                    </View>
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Radio atómico: </Text>{elementoSeleccionado.radio} pm</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Electronegatividad: </Text>{elementoSeleccionado.electronegatividad || 'N/A'}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Valencia: </Text>{elementoSeleccionado.valencia}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Protones: </Text>{elementoSeleccionado.protones}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Neutrones: </Text>{elementoSeleccionado.neutrones}</Text>
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Electrones: </Text>{elementoSeleccionado.electrones}</Text>
                    </View>
                  </View>

                  {/* Configuración electrónica */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Configuración electrónica</Text>
                    <Text style={styles.sectionContent}>{elementoSeleccionado.configElectronica}</Text>
                  </View>

                  {/* Isótopos */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Isótopos principales</Text>
                    <Text style={styles.sectionContent}>{elementoSeleccionado.isotopos.join(', ')}</Text>
                  </View>

                  {/* Descubrimiento */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descubrimiento</Text>
                    <Text style={styles.sectionContent}>{elementoSeleccionado.descubrimiento}</Text>
                  </View>

                  {/* Características */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Características</Text>
                    <Text style={styles.sectionContent}>{elementoSeleccionado.caracteristicas}</Text>
                  </View>
                </ScrollView>

                {/* Botón de cerrar */}
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: coloresPorGrupo[elementoSeleccionado.grupo] || '#DDDDDD' }
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212'
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 1,
    elevation: 3,
  },
  exitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  scrollVerticalContainer: {
    paddingBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 234, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  grid: {
    position: 'relative',
    marginHorizontal: 10,
  },
  elemento: {
    position: 'absolute',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  simbolo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  nombre: {
    color: '#FFFFFF',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  numeroAtomico: {
    position: 'absolute',
    top: 3,
    left: 3,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    borderRadius: 15,
    borderWidth: 3,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalScrollContent: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  elementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  elementIconSymbol: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  elementIconNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  headerTextContainer: {
    flex: 1,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoColumn: {
    width: '48%',
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingBottom: 3,
  },
  sectionContent: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TablaPeriodica;