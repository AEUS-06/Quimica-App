import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Orientation from 'react-native-orientation-locker';

// Colores por grupo según clasificación estándar
const coloresPorGrupo: Record<number, string> = {
  1: '#FF5555',    // Metales alcalinos
  2: '#FF9955',    // Metales alcalinotérreos
  3: '#FFCC33',    // Metales de transición
  4: '#FF66CC',    // Lantánidos
  5: '#FF99CC',    // Actínidos
  6: '#FFCC99',    // Metales post-transición
  13: '#55CCFF',   // Grupo del Boro
  14: '#77DD77',   // Grupo del Carbono
  15: '#FFEE55',   // Grupo del Nitrógeno
  16: '#FFAA55',   // Calcógenos
  17: '#55FF55',   // Halógenos
  18: '#AA55FF',   // Gases nobles
};


// Lista completa de los 118 elementos
const elementos = [
  { simbolo: 'H', nombre: 'Hidrógeno', numeroAtomico: 1, grupo: 1, periodo: 1, configElectronica: '1s¹', electronegatividad: 2.20, tipo: 'No metal', valencia: 1, masa: 1.008, radio: 53, estado: 'Gas', descubrimiento: 1766, aniones: ['H⁻'], cationes: ['H⁺'], caracteristicas: 'El elemento más ligero y abundante del universo.' },
  { simbolo: 'He', nombre: 'Helio', numeroAtomico: 2, grupo: 18, periodo: 1, configElectronica: '1s²', electronegatividad: null, tipo: 'Gas noble', valencia: 0, masa: 4.0026, radio: 31, estado: 'Gas', descubrimiento: 1868, aniones: [], cationes: [], caracteristicas: 'Gas inerte, segundo elemento más ligero.' },
  { simbolo: 'Li', nombre: 'Litio', numeroAtomico: 3, grupo: 1, periodo: 2, configElectronica: '[He] 2s¹', electronegatividad: 0.98, tipo: 'Metal alcalino', valencia: 1, masa: 6.94, radio: 167, estado: 'Sólido', descubrimiento: 1817, aniones: [], cationes: ['Li⁺'], caracteristicas: 'Metal más ligero, usado en baterías.' },
  { simbolo: 'Be', nombre: 'Berilio', numeroAtomico: 4, grupo: 2, periodo: 2, configElectronica: '[He] 2s²', electronegatividad: 1.57, tipo: 'Metal alcalinotérreo', valencia: 2, masa: 9.0122, radio: 112, estado: 'Sólido', descubrimiento: 1798, aniones: [], cationes: ['Be²⁺'], caracteristicas: 'Metal ligero pero rígido, tóxico.' },
  { simbolo: 'B', nombre: 'Boro', numeroAtomico: 5, grupo: 13, periodo: 2, configElectronica: '[He] 2s² 2p¹', electronegatividad: 2.04, tipo: 'Metaloide', valencia: 3, masa: 10.81, radio: 87, estado: 'Sólido', descubrimiento: 1808, aniones: ['B³⁻'], cationes: ['B³⁺'], caracteristicas: 'Esencial para plantas, usado en vidrios.' },
  { simbolo: 'C', nombre: 'Carbono', numeroAtomico: 6, grupo: 14, periodo: 2, configElectronica: '[He] 2s² 2p²', electronegatividad: 2.55, tipo: 'No metal', valencia: 4, masa: 12.011, radio: 67, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: ['C⁴⁻'], cationes: ['C⁴⁺'], caracteristicas: 'Base de la química orgánica, múltiples formas alotrópicas.' },
  { simbolo: 'N', nombre: 'Nitrógeno', numeroAtomico: 7, grupo: 15, periodo: 2, configElectronica: '[He] 2s² 2p³', electronegatividad: 3.04, tipo: 'No metal', valencia: 3, masa: 14.007, radio: 56, estado: 'Gas', descubrimiento: 1772, aniones: ['N³⁻'], cationes: ['N³⁺'], caracteristicas: 'Componente principal del aire (78%).' },
  { simbolo: 'O', nombre: 'Oxígeno', numeroAtomico: 8, grupo: 16, periodo: 2, configElectronica: '[He] 2s² 2p⁴', electronegatividad: 3.44, tipo: 'No metal', valencia: 2, masa: 15.999, radio: 48, estado: 'Gas', descubrimiento: 1774, aniones: ['O²⁻'], cationes: ['O²⁺'], caracteristicas: 'Esencial para la respiración, forma el ozono.' },
  { simbolo: 'F', nombre: 'Flúor', numeroAtomico: 9, grupo: 17, periodo: 2, configElectronica: '[He] 2s² 2p⁵', electronegatividad: 3.98, tipo: 'Halógeno', valencia: 1, masa: 18.998, radio: 42, estado: 'Gas', descubrimiento: 1886, aniones: ['F⁻'], cationes: ['F⁺'], caracteristicas: 'Elemento más electronegativo, muy reactivo.' },
  { simbolo: 'Ne', nombre: 'Neón', numeroAtomico: 10, grupo: 18, periodo: 2, configElectronica: '[He] 2s² 2p⁶', electronegatividad: null, tipo: 'Gas noble', valencia: 0, masa: 20.180, radio: 38, estado: 'Gas', descubrimiento: 1898, aniones: [], cationes: [], caracteristicas: 'Usado en letreros luminosos, gas inerte.' },
  { simbolo: 'Na', nombre: 'Sodio', numeroAtomico: 11, grupo: 1, periodo: 3, configElectronica: '[Ne] 3s¹', electronegatividad: 0.93, tipo: 'Metal alcalino', valencia: 1, masa: 22.990, radio: 190, estado: 'Sólido', descubrimiento: 1807, aniones: [], cationes: ['Na⁺'], caracteristicas: 'Esencial para la vida, componente de la sal.' },
  { simbolo: 'Mg', nombre: 'Magnesio', numeroAtomico: 12, grupo: 2, periodo: 3, configElectronica: '[Ne] 3s²', electronegatividad: 1.31, tipo: 'Metal alcalinotérreo', valencia: 2, masa: 24.305, radio: 145, estado: 'Sólido', descubrimiento: 1755, aniones: [], cationes: ['Mg²⁺'], caracteristicas: 'Importante en biología, usado en aleaciones.' },
  { simbolo: 'Al', nombre: 'Aluminio', numeroAtomico: 13, grupo: 13, periodo: 3, configElectronica: '[Ne] 3s² 3p¹', electronegatividad: 1.61, tipo: 'Metal', valencia: 3, masa: 26.982, radio: 118, estado: 'Sólido', descubrimiento: 1825, aniones: [], cationes: ['Al³⁺'], caracteristicas: 'Metal ligero resistente a la corrosión.' },
  { simbolo: 'Si', nombre: 'Silicio', numeroAtomico: 14, grupo: 14, periodo: 3, configElectronica: '[Ne] 3s² 3p²', electronegatividad: 1.90, tipo: 'Metaloide', valencia: 4, masa: 28.085, radio: 111, estado: 'Sólido', descubrimiento: 1824, aniones: ['Si⁴⁻'], cationes: ['Si⁴⁺'], caracteristicas: 'Fundamental en electrónica, segundo elemento más abundante en la corteza.' },
  { simbolo: 'P', nombre: 'Fósforo', numeroAtomico: 15, grupo: 15, periodo: 3, configElectronica: '[Ne] 3s² 3p³', electronegatividad: 2.19, tipo: 'No metal', valencia: 3, masa: 30.974, radio: 98, estado: 'Sólido', descubrimiento: 1669, aniones: ['P³⁻'], cationes: ['P³⁺'], caracteristicas: 'Esencial para la vida, componente de ADN y ATP.' },
  { simbolo: 'S', nombre: 'Azufre', numeroAtomico: 16, grupo: 16, periodo: 3, configElectronica: '[Ne] 3s² 3p⁴', electronegatividad: 2.58, tipo: 'No metal', valencia: 2, masa: 32.06, radio: 88, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: ['S²⁻'], cationes: ['S²⁺'], caracteristicas: 'Usado en pólvora, ácido sulfúrico y vulcanización.' },
  { simbolo: 'Cl', nombre: 'Cloro', numeroAtomico: 17, grupo: 17, periodo: 3, configElectronica: '[Ne] 3s² 3p⁵', electronegatividad: 3.16, tipo: 'Halógeno', valencia: 1, masa: 35.45, radio: 79, estado: 'Gas', descubrimiento: 1774, aniones: ['Cl⁻'], cationes: ['Cl⁺'], caracteristicas: 'Usado en desinfección, compuestos orgánicos.' },
  { simbolo: 'Ar', nombre: 'Argón', numeroAtomico: 18, grupo: 18, periodo: 3, configElectronica: '[Ne] 3s² 3p⁶', electronegatividad: null, tipo: 'Gas noble', valencia: 0, masa: 39.948, radio: 71, estado: 'Gas', descubrimiento: 1894, aniones: [], cationes: [], caracteristicas: 'Gas inerte, usado en iluminación y protección.' },
  { simbolo: 'K', nombre: 'Potasio', numeroAtomico: 19, grupo: 1, periodo: 4, configElectronica: '[Ar] 4s¹', electronegatividad: 0.82, tipo: 'Metal alcalino', valencia: 1, masa: 39.098, radio: 243, estado: 'Sólido', descubrimiento: 1807, aniones: [], cationes: ['K⁺'], caracteristicas: 'Esencial para la función nerviosa y muscular.' },
  { simbolo: 'Ca', nombre: 'Calcio', numeroAtomico: 20, grupo: 2, periodo: 4, configElectronica: '[Ar] 4s²', electronegatividad: 1.00, tipo: 'Metal alcalinotérreo', valencia: 2, masa: 40.078, radio: 194, estado: 'Sólido', descubrimiento: 1808, aniones: [], cationes: ['Ca²⁺'], caracteristicas: 'Esencial para huesos, dientes y contracción muscular.' },
  { simbolo: 'Sc', nombre: 'Escandio', numeroAtomico: 21, grupo: 3, periodo: 4, configElectronica: '[Ar] 3d¹ 4s²', electronegatividad: 1.36, tipo: 'Metal de transición', valencia: 3, masa: 44.956, radio: 184, estado: 'Sólido', descubrimiento: 1879, aniones: [], cationes: ['Sc³⁺'], caracteristicas: 'Usado en aleaciones ligeras y lámparas.' },
  { simbolo: 'Ti', nombre: 'Titanio', numeroAtomico: 22, grupo: 4, periodo: 4, configElectronica: '[Ar] 3d² 4s²', electronegatividad: 1.54, tipo: 'Metal de transición', valencia: 4, masa: 47.867, radio: 176, estado: 'Sólido', descubrimiento: 1791, aniones: [], cationes: ['Ti⁴⁺'], caracteristicas: 'Metal fuerte, resistente a la corrosión, usado en implantes.' },
  { simbolo: 'V', nombre: 'Vanadio', numeroAtomico: 23, grupo: 5, periodo: 4, configElectronica: '[Ar] 3d³ 4s²', electronegatividad: 1.63, tipo: 'Metal de transición', valencia: 5, masa: 50.942, radio: 171, estado: 'Sólido', descubrimiento: 1801, aniones: [], cationes: ['V²⁺', 'V³⁺', 'V⁴⁺', 'V⁵⁺'], caracteristicas: 'Usado en aceros resistentes y catalizadores.' },
  { simbolo: 'Cr', nombre: 'Cromo', numeroAtomico: 24, grupo: 6, periodo: 4, configElectronica: '[Ar] 3d⁵ 4s¹', electronegatividad: 1.66, tipo: 'Metal de transición', valencia: 3, masa: 51.996, radio: 166, estado: 'Sólido', descubrimiento: 1797, aniones: [], cationes: ['Cr²⁺', 'Cr³⁺', 'Cr⁶⁺'], caracteristicas: 'Usado en cromado y aceros inoxidables.' },
  { simbolo: 'Mn', nombre: 'Manganeso', numeroAtomico: 25, grupo: 7, periodo: 4, configElectronica: '[Ar] 3d⁵ 4s²', electronegatividad: 1.55, tipo: 'Metal de transición', valencia: 7, masa: 54.938, radio: 161, estado: 'Sólido', descubrimiento: 1774, aniones: [], cationes: ['Mn²⁺', 'Mn³⁺', 'Mn⁴⁺', 'Mn⁷⁺'], caracteristicas: 'Esencial en acero, baterías y enzimas.' },
  { simbolo: 'Fe', nombre: 'Hierro', numeroAtomico: 26, grupo: 8, periodo: 4, configElectronica: '[Ar] 3d⁶ 4s²', electronegatividad: 1.83, tipo: 'Metal de transición', valencia: 3, masa: 55.845, radio: 156, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: [], cationes: ['Fe²⁺', 'Fe³⁺'], caracteristicas: 'Componente principal del núcleo terrestre y hemoglobina.' },
  { simbolo: 'Co', nombre: 'Cobalto', numeroAtomico: 27, grupo: 9, periodo: 4, configElectronica: '[Ar] 3d⁷ 4s²', electronegatividad: 1.88, tipo: 'Metal de transición', valencia: 3, masa: 58.933, radio: 152, estado: 'Sólido', descubrimiento: 1735, aniones: [], cationes: ['Co²⁺', 'Co³⁺'], caracteristicas: 'Usado en imanes, aleaciones y vitamina B12.' },
  { simbolo: 'Ni', nombre: 'Níquel', numeroAtomico: 28, grupo: 10, periodo: 4, configElectronica: '[Ar] 3d⁸ 4s²', electronegatividad: 1.91, tipo: 'Metal de transición', valencia: 2, masa: 58.693, radio: 149, estado: 'Sólido', descubrimiento: 1751, aniones: [], cationes: ['Ni²⁺', 'Ni³⁺'], caracteristicas: 'Usado en aceros inoxidables y baterías recargables.' },
  { simbolo: 'Cu', nombre: 'Cobre', numeroAtomico: 29, grupo: 11, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s¹', electronegatividad: 1.90, tipo: 'Metal de transición', valencia: 2, masa: 63.546, radio: 145, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: [], cationes: ['Cu⁺', 'Cu²⁺'], caracteristicas: 'Excelente conductor, usado en cables y monedas.' },
  { simbolo: 'Zn', nombre: 'Zinc', numeroAtomico: 30, grupo: 12, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s²', electronegatividad: 1.65, tipo: 'Metal de transición', valencia: 2, masa: 65.38, radio: 142, estado: 'Sólido', descubrimiento: 1746, aniones: [], cationes: ['Zn²⁺'], caracteristicas: 'Usado en galvanización y enzimas.' },
  { simbolo: 'Ga', nombre: 'Galio', numeroAtomico: 31, grupo: 13, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s² 4p¹', electronegatividad: 1.81, tipo: 'Metal', valencia: 3, masa: 69.723, radio: 136, estado: 'Sólido', descubrimiento: 1875, aniones: [], cationes: ['Ga³⁺'], caracteristicas: 'Se derrite en la mano, usado en semiconductores.' },
  { simbolo: 'Ge', nombre: 'Germanio', numeroAtomico: 32, grupo: 14, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s² 4p²', electronegatividad: 2.01, tipo: 'Metaloide', valencia: 4, masa: 72.630, radio: 125, estado: 'Sólido', descubrimiento: 1886, aniones: ['Ge⁴⁻'], cationes: ['Ge⁴⁺'], caracteristicas: 'Semiconductor importante en electrónica.' },
  { simbolo: 'As', nombre: 'Arsénico', numeroAtomico: 33, grupo: 15, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s² 4p³', electronegatividad: 2.18, tipo: 'Metaloide', valencia: 3, masa: 74.922, radio: 114, estado: 'Sólido', descubrimiento: 'Edad Media', aniones: ['As³⁻'], cationes: ['As³⁺', 'As⁵⁺'], caracteristicas: 'Veneno conocido, usado en semiconductores.' },
  { simbolo: 'Se', nombre: 'Selenio', numeroAtomico: 34, grupo: 16, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegatividad: 2.55, tipo: 'No metal', valencia: 2, masa: 78.971, radio: 103, estado: 'Sólido', descubrimiento: 1817, aniones: ['Se²⁻'], cationes: ['Se⁴⁺', 'Se⁶⁺'], caracteristicas: 'Esencial en pequeñas cantidades, usado en fotocopiadoras.' },
  { simbolo: 'Br', nombre: 'Bromo', numeroAtomico: 35, grupo: 17, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegatividad: 2.96, tipo: 'Halógeno', valencia: 1, masa: 79.904, radio: 94, estado: 'Líquido', descubrimiento: 1826, aniones: ['Br⁻'], cationes: ['Br⁺'], caracteristicas: 'Único halógeno líquido a temperatura ambiente.' },
  { simbolo: 'Kr', nombre: 'Kriptón', numeroAtomico: 36, grupo: 18, periodo: 4, configElectronica: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegatividad: 3.00, tipo: 'Gas noble', valencia: 0, masa: 83.798, radio: 88, estado: 'Gas', descubrimiento: 1898, aniones: [], cationes: [], caracteristicas: 'Usado en iluminación y láseres.' },
  { simbolo: 'Rb', nombre: 'Rubidio', numeroAtomico: 37, grupo: 1, periodo: 5, configElectronica: '[Kr] 5s¹', electronegatividad: 0.82, tipo: 'Metal alcalino', valencia: 1, masa: 85.468, radio: 265, estado: 'Sólido', descubrimiento: 1861, aniones: [], cationes: ['Rb⁺'], caracteristicas: 'Muy reactivo, usado en relojes atómicos.' },
  { simbolo: 'Sr', nombre: 'Estroncio', numeroAtomico: 38, grupo: 2, periodo: 5, configElectronica: '[Kr] 5s²', electronegatividad: 0.95, tipo: 'Metal alcalinotérreo', valencia: 2, masa: 87.62, radio: 219, estado: 'Sólido', descubrimiento: 1790, aniones: [], cationes: ['Sr²⁺'], caracteristicas: 'Usado en fuegos artificiales (color rojo).' },
  { simbolo: 'Y', nombre: 'Itrio', numeroAtomico: 39, grupo: 3, periodo: 5, configElectronica: '[Kr] 4d¹ 5s²', electronegatividad: 1.22, tipo: 'Metal de transición', valencia: 3, masa: 88.906, radio: 212, estado: 'Sólido', descubrimiento: 1794, aniones: [], cationes: ['Y³⁺'], caracteristicas: 'Usado en superconductores y LEDs.' },
  { simbolo: 'Zr', nombre: 'Circonio', numeroAtomico: 40, grupo: 4, periodo: 5, configElectronica: '[Kr] 4d² 5s²', electronegatividad: 1.33, tipo: 'Metal de transición', valencia: 4, masa: 91.224, radio: 206, estado: 'Sólido', descubrimiento: 1789, aniones: [], cationes: ['Zr⁴⁺'], caracteristicas: 'Resistente a la corrosión, usado en reactores nucleares.' },
  { simbolo: 'Nb', nombre: 'Niobio', numeroAtomico: 41, grupo: 5, periodo: 5, configElectronica: '[Kr] 4d⁴ 5s¹', electronegatividad: 1.6, tipo: 'Metal de transición', valencia: 5, masa: 92.906, radio: 198, estado: 'Sólido', descubrimiento: 1801, aniones: [], cationes: ['Nb⁵⁺'], caracteristicas: 'Usado en aleaciones para cohetes y superconductores.' },
  { simbolo: 'Mo', nombre: 'Molibdeno', numeroAtomico: 42, grupo: 6, periodo: 5, configElectronica: '[Kr] 4d⁵ 5s¹', electronegatividad: 2.16, tipo: 'Metal de transición', valencia: 6, masa: 95.95, radio: 190, estado: 'Sólido', descubrimiento: 1778, aniones: [], cationes: ['Mo⁶⁺'], caracteristicas: 'Esencial para algunas enzimas, usado en aleaciones.' },
  { simbolo: 'Tc', nombre: 'Tecnecio', numeroAtomico: 43, grupo: 7, periodo: 5, configElectronica: '[Kr] 4d⁵ 5s²', electronegatividad: 1.9, tipo: 'Metal de transición', valencia: 7, masa: 98, radio: 183, estado: 'Sólido', descubrimiento: 1937, aniones: [], cationes: ['Tc⁷⁺'], caracteristicas: 'Primer elemento artificialmente producido, radiactivo.' },
  { simbolo: 'Ru', nombre: 'Rutenio', numeroAtomico: 44, grupo: 8, periodo: 5, configElectronica: '[Kr] 4d⁷ 5s¹', electronegatividad: 2.2, tipo: 'Metal de transición', valencia: 4, masa: 101.07, radio: 178, estado: 'Sólido', descubrimiento: 1844, aniones: [], cationes: ['Ru⁴⁺'], caracteristicas: 'Usado en joyería y catalizadores.' },
  { simbolo: 'Rh', nombre: 'Rodio', numeroAtomico: 45, grupo: 9, periodo: 5, configElectronica: '[Kr] 4d⁸ 5s¹', electronegatividad: 2.28, tipo: 'Metal de transición', valencia: 3, masa: 102.91, radio: 173, estado: 'Sólido', descubrimiento: 1803, aniones: [], cationes: ['Rh³⁺'], caracteristicas: 'Metal precioso, usado en convertidores catalíticos.' },
  { simbolo: 'Pd', nombre: 'Paladio', numeroAtomico: 46, grupo: 10, periodo: 5, configElectronica: '[Kr] 4d¹⁰', electronegatividad: 2.20, tipo: 'Metal de transición', valencia: 2, masa: 106.42, radio: 169, estado: 'Sólido', descubrimiento: 1803, aniones: [], cationes: ['Pd²⁺'], caracteristicas: 'Usado en catalizadores y joyería.' },
  { simbolo: 'Ag', nombre: 'Plata', numeroAtomico: 47, grupo: 11, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s¹', electronegatividad: 1.93, tipo: 'Metal de transición', valencia: 1, masa: 107.87, radio: 165, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: [], cationes: ['Ag⁺'], caracteristicas: 'Excelente conductor, usado en joyería y fotografía.' },
  { simbolo: 'Cd', nombre: 'Cadmio', numeroAtomico: 48, grupo: 12, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s²', electronegatividad: 1.69, tipo: 'Metal de transición', valencia: 2, masa: 112.41, radio: 161, estado: 'Sólido', descubrimiento: 1817, aniones: [], cationes: ['Cd²⁺'], caracteristicas: 'Tóxico, usado en baterías y pigmentos.' },
  { simbolo: 'In', nombre: 'Indio', numeroAtomico: 49, grupo: 13, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s² 5p¹', electronegatividad: 1.78, tipo: 'Metal', valencia: 3, masa: 114.82, radio: 156, estado: 'Sólido', descubrimiento: 1863, aniones: [], cationes: ['In³⁺'], caracteristicas: 'Usado en pantallas táctiles y semiconductores.' },
  { simbolo: 'Sn', nombre: 'Estaño', numeroAtomico: 50, grupo: 14, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s² 5p²', electronegatividad: 1.96, tipo: 'Metal', valencia: 4, masa: 118.71, radio: 145, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: ['Sn⁴⁻'], cationes: ['Sn²⁺', 'Sn⁴⁺'], caracteristicas: 'Usado en soldaduras y envases.' },
  { simbolo: 'Sb', nombre: 'Antimonio', numeroAtomico: 51, grupo: 15, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s² 5p³', electronegatividad: 2.05, tipo: 'Metaloide', valencia: 3, masa: 121.76, radio: 133, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: ['Sb³⁻'], cationes: ['Sb³⁺', 'Sb⁵⁺'], caracteristicas: 'Usado en aleaciones y retardantes de llama.' },
  { simbolo: 'Te', nombre: 'Telurio', numeroAtomico: 52, grupo: 16, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s² 5p⁴', electronegatividad: 2.1, tipo: 'Metaloide', valencia: 2, masa: 127.60, radio: 123, estado: 'Sólido', descubrimiento: 1782, aniones: ['Te²⁻'], cationes: ['Te⁴⁺', 'Te⁶⁺'], caracteristicas: 'Usado en paneles solares y aleaciones.' },
  { simbolo: 'I', nombre: 'Yodo', numeroAtomico: 53, grupo: 17, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegatividad: 2.66, tipo: 'Halógeno', valencia: 1, masa: 126.90, radio: 115, estado: 'Sólido', descubrimiento: 1811, aniones: ['I⁻'], cationes: ['I⁺'], caracteristicas: 'Esencial para la tiroides, usado en desinfectantes.' },
  { simbolo: 'Xe', nombre: 'Xenón', numeroAtomico: 54, grupo: 18, periodo: 5, configElectronica: '[Kr] 4d¹⁰ 5s² 5p⁶', electronegatividad: 2.6, tipo: 'Gas noble', valencia: 0, masa: 131.29, radio: 108, estado: 'Gas', descubrimiento: 1898, aniones: [], cationes: [], caracteristicas: 'Usado en lámparas y anestésicos.' },
  { simbolo: 'Cs', nombre: 'Cesio', numeroAtomico: 55, grupo: 1, periodo: 6, configElectronica: '[Xe] 6s¹', electronegatividad: 0.79, tipo: 'Metal alcalino', valencia: 1, masa: 132.91, radio: 298, estado: 'Sólido', descubrimiento: 1860, aniones: [], cationes: ['Cs⁺'], caracteristicas: 'Metal más reactivo, usado en relojes atómicos.' },
  { simbolo: 'Ba', nombre: 'Bario', numeroAtomico: 56, grupo: 2, periodo: 6, configElectronica: '[Xe] 6s²', electronegatividad: 0.89, tipo: 'Metal alcalinotérreo', valencia: 2, masa: 137.33, radio: 253, estado: 'Sólido', descubrimiento: 1808, aniones: [], cationes: ['Ba²⁺'], caracteristicas: 'Usado en contrastes para rayos X y fuegos artificiales.' },
  { simbolo: 'La', nombre: 'Lantano', numeroAtomico: 57, grupo: 3, periodo: 6, configElectronica: '[Xe] 5d¹ 6s²', electronegatividad: 1.1, tipo: 'Lantánido', valencia: 3, masa: 138.91, radio: 195, estado: 'Sólido', descubrimiento: 1839, aniones: [], cationes: ['La³⁺'], caracteristicas: 'Primer lantánido, usado en baterías recargables.' },
  { simbolo: 'Ce', nombre: 'Cerio', numeroAtomico: 58, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹ 5d¹ 6s²', electronegatividad: 1.12, tipo: 'Lantánido', valencia: 3, masa: 140.12, radio: 185, estado: 'Sólido', descubrimiento: 1803, aniones: [], cationes: ['Ce³⁺', 'Ce⁴⁺'], caracteristicas: 'Usado en catalizadores y pulido de vidrio.' },
  { simbolo: 'Pr', nombre: 'Praseodimio', numeroAtomico: 59, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f³ 6s²', electronegatividad: 1.13, tipo: 'Lantánido', valencia: 3, masa: 140.91, radio: 185, estado: 'Sólido', descubrimiento: 1885, aniones: [], cationes: ['Pr³⁺'], caracteristicas: 'Usado en imanes y aleaciones.' },
  { simbolo: 'Nd', nombre: 'Neodimio', numeroAtomico: 60, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f⁴ 6s²', electronegatividad: 1.14, tipo: 'Lantánido', valencia: 3, masa: 144.24, radio: 185, estado: 'Sólido', descubrimiento: 1885, aniones: [], cationes: ['Nd³⁺'], caracteristicas: 'Usado en imanes fuertes y láseres.' },
  { simbolo: 'Pm', nombre: 'Prometio', numeroAtomico: 61, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f⁵ 6s²', electronegatividad: 1.13, tipo: 'Lantánido', valencia: 3, masa: 145, radio: 185, estado: 'Sólido', descubrimiento: 1945, aniones: [], cationes: ['Pm³⁺'], caracteristicas: 'Radiactivo, usado en baterías nucleares.' },
  { simbolo: 'Sm', nombre: 'Samario', numeroAtomico: 62, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f⁶ 6s²', electronegatividad: 1.17, tipo: 'Lantánido', valencia: 3, masa: 150.36, radio: 185, estado: 'Sólido', descubrimiento: 1879, aniones: [], cationes: ['Sm³⁺'], caracteristicas: 'Usado en imanes y tratamiento del cáncer.' },
  { simbolo: 'Eu', nombre: 'Europio', numeroAtomico: 63, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f⁷ 6s²', electronegatividad: 1.2, tipo: 'Lantánido', valencia: 3, masa: 151.96, radio: 185, estado: 'Sólido', descubrimiento: 1901, aniones: [], cationes: ['Eu³⁺'], caracteristicas: 'Usado en pantallas de TV y billetes para detectar falsificaciones.' },
  { simbolo: 'Gd', nombre: 'Gadolinio', numeroAtomico: 64, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f⁷ 5d¹ 6s²', electronegatividad: 1.2, tipo: 'Lantánido', valencia: 3, masa: 157.25, radio: 180, estado: 'Sólido', descubrimiento: 1880, aniones: [], cationes: ['Gd³⁺'], caracteristicas: 'Usado en resonancia magnética y barras de control nuclear.' },
  { simbolo: 'Tb', nombre: 'Terbio', numeroAtomico: 65, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f⁹ 6s²', electronegatividad: 1.2, tipo: 'Lantánido', valencia: 3, masa: 158.93, radio: 175, estado: 'Sólido', descubrimiento: 1843, aniones: [], cationes: ['Tb³⁺'], caracteristicas: 'Usado en dispositivos de sonar y aleaciones.' },
  { simbolo: 'Dy', nombre: 'Disprosio', numeroAtomico: 66, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹⁰ 6s²', electronegatividad: 1.22, tipo: 'Lantánido', valencia: 3, masa: 162.50, radio: 175, estado: 'Sólido', descubrimiento: 1886, aniones: [], cationes: ['Dy³⁺'], caracteristicas: 'Usado en imanes y reactores nucleares.' },
  { simbolo: 'Ho', nombre: 'Holmio', numeroAtomico: 67, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹¹ 6s²', electronegatividad: 1.23, tipo: 'Lantánido', valencia: 3, masa: 164.93, radio: 175, estado: 'Sólido', descubrimiento: 1878, aniones: [], cationes: ['Ho³⁺'], caracteristicas: 'Tiene las propiedades magnéticas más fuertes de cualquier elemento.' },
  { simbolo: 'Er', nombre: 'Erbio', numeroAtomico: 68, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹² 6s²', electronegatividad: 1.24, tipo: 'Lantánido', valencia: 3, masa: 167.26, radio: 175, estado: 'Sólido', descubrimiento: 1843, aniones: [], cationes: ['Er³⁺'], caracteristicas: 'Usado en fibra óptica y aleaciones.' },
  { simbolo: 'Tm', nombre: 'Tulio', numeroAtomico: 69, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹³ 6s²', electronegatividad: 1.25, tipo: 'Lantánido', valencia: 3, masa: 168.93, radio: 175, estado: 'Sólido', descubrimiento: 1879, aniones: [], cationes: ['Tm³⁺'], caracteristicas: 'El más raro de los lantánidos, usado en láseres.' },
  { simbolo: 'Yb', nombre: 'Iterbio', numeroAtomico: 70, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 6s²', electronegatividad: 1.1, tipo: 'Lantánido', valencia: 3, masa: 173.05, radio: 175, estado: 'Sólido', descubrimiento: 1878, aniones: [], cationes: ['Yb³⁺'], caracteristicas: 'Usado en relojes atómicos y aleaciones.' },
  { simbolo: 'Lu', nombre: 'Lutecio', numeroAtomico: 71, grupo: 3, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹ 6s²', electronegatividad: 1.27, tipo: 'Lantánido', valencia: 3, masa: 174.97, radio: 175, estado: 'Sólido', descubrimiento: 1907, aniones: [], cationes: ['Lu³⁺'], caracteristicas: 'Último lantánido, usado en catalizadores.' },
  { simbolo: 'Hf', nombre: 'Hafnio', numeroAtomico: 72, grupo: 4, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d² 6s²', electronegatividad: 1.3, tipo: 'Metal de transición', valencia: 4, masa: 178.49, radio: 155, estado: 'Sólido', descubrimiento: 1923, aniones: [], cationes: ['Hf⁴⁺'], caracteristicas: 'Usado en reactores nucleares y microprocesadores.' },
  { simbolo: 'Ta', nombre: 'Tantalio', numeroAtomico: 73, grupo: 5, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d³ 6s²', electronegatividad: 1.5, tipo: 'Metal de transición', valencia: 5, masa: 180.95, radio: 145, estado: 'Sólido', descubrimiento: 1802, aniones: [], cationes: ['Ta⁵⁺'], caracteristicas: 'Resistente a la corrosión, usado en electrónica.' },
  { simbolo: 'W', nombre: 'Wolframio', numeroAtomico: 74, grupo: 6, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronegatividad: 2.36, tipo: 'Metal de transición', valencia: 6, masa: 183.84, radio: 135, estado: 'Sólido', descubrimiento: 1783, aniones: [], cationes: ['W⁶⁺'], caracteristicas: 'Metal con el punto de fusión más alto, usado en filamentos.' },
  { simbolo: 'Re', nombre: 'Renio', numeroAtomico: 75, grupo: 7, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronegatividad: 1.9, tipo: 'Metal de transición', valencia: 7, masa: 186.21, radio: 135, estado: 'Sólido', descubrimiento: 1925, aniones: [], cationes: ['Re⁷⁺'], caracteristicas: 'Uno de los metales más densos, usado en turbinas.' },
  { simbolo: 'Os', nombre: 'Osmio', numeroAtomico: 76, grupo: 8, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronegatividad: 2.2, tipo: 'Metal de transición', valencia: 4, masa: 190.23, radio: 130, estado: 'Sólido', descubrimiento: 1803, aniones: [], cationes: ['Os⁴⁺'], caracteristicas: 'El metal más denso, usado en puntas de plumas.' },
  { simbolo: 'Ir', nombre: 'Iridio', numeroAtomico: 77, grupo: 9, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronegatividad: 2.20, tipo: 'Metal de transición', valencia: 4, masa: 192.22, radio: 135, estado: 'Sólido', descubrimiento: 1803, aniones: [], cationes: ['Ir⁴⁺'], caracteristicas: 'Uno de los metales más resistentes a la corrosión.' },
  { simbolo: 'Pt', nombre: 'Platino', numeroAtomico: 78, grupo: 10, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronegatividad: 2.28, tipo: 'Metal de transición', valencia: 2, masa: 195.08, radio: 135, estado: 'Sólido', descubrimiento: 1735, aniones: [], cationes: ['Pt²⁺'], caracteristicas: 'Metal precioso, usado en catalizadores y joyería.' },
  { simbolo: 'Au', nombre: 'Oro', numeroAtomico: 79, grupo: 11, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegatividad: 2.54, tipo: 'Metal de transición', valencia: 3, masa: 196.97, radio: 135, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: [], cationes: ['Au³⁺'], caracteristicas: 'Metal precioso, usado en joyería y electrónica.' },
  { simbolo: 'Hg', nombre: 'Mercurio', numeroAtomico: 80, grupo: 12, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronegatividad: 2.00, tipo: 'Metal de transición', valencia: 2, masa: 200.59, radio: 150, estado: 'Líquido', descubrimiento: 'Antigüedad', aniones: [], cationes: ['Hg²⁺'], caracteristicas: 'Único metal líquido a temperatura ambiente, tóxico.' },
  { simbolo: 'Tl', nombre: 'Talio', numeroAtomico: 81, grupo: 13, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronegatividad: 1.62, tipo: 'Metal', valencia: 3, masa: 204.38, radio: 170, estado: 'Sólido', descubrimiento: 1861, aniones: [], cationes: ['Tl⁺', 'Tl³⁺'], caracteristicas: 'Muy tóxico, usado en detectores infrarrojos.' },
  { simbolo: 'Pb', nombre: 'Plomo', numeroAtomico: 82, grupo: 14, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronegatividad: 2.33, tipo: 'Metal', valencia: 4, masa: 207.2, radio: 175, estado: 'Sólido', descubrimiento: 'Antigüedad', aniones: ['Pb⁴⁻'], cationes: ['Pb²⁺', 'Pb⁴⁺'], caracteristicas: 'Tóxico, usado en baterías y protección contra radiación.' },
  { simbolo: 'Bi', nombre: 'Bismuto', numeroAtomico: 83, grupo: 15, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronegatividad: 2.02, tipo: 'Metal', valencia: 3, masa: 208.98, radio: 155, estado: 'Sólido', descubrimiento: 'Edad Media', aniones: ['Bi³⁻'], cationes: ['Bi³⁺', 'Bi⁵⁺'], caracteristicas: 'El metal más diamagnético, usado en cosméticos y medicinas.' },
  { simbolo: 'Po', nombre: 'Polonio', numeroAtomico: 84, grupo: 16, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronegatividad: 2.0, tipo: 'Metaloide', valencia: 2, masa: 209, radio: 145, estado: 'Sólido', descubrimiento: 1898, aniones: ['Po²⁻'], cationes: ['Po²⁺', 'Po⁴⁺'], caracteristicas: 'Altamente radiactivo, usado en fuentes de calor para satélites.' },
  { simbolo: 'At', nombre: 'Astato', numeroAtomico: 85, grupo: 17, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronegatividad: 2.2, tipo: 'Halógeno', valencia: 1, masa: 210, radio: 140, estado: 'Sólido', descubrimiento: 1940, aniones: ['At⁻'], cationes: ['At⁺'], caracteristicas: 'El halógeno más raro, altamente radiactivo.' },
  { simbolo: 'Rn', nombre: 'Radón', numeroAtomico: 86, grupo: 18, periodo: 6, configElectronica: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', electronegatividad: null, tipo: 'Gas noble', valencia: 0, masa: 222, radio: 120, estado: 'Gas', descubrimiento: 1900, aniones: [], cationes: [], caracteristicas: 'Gas radiactivo, peligroso en espacios cerrados.' },
  { simbolo: 'Fr', nombre: 'Francio', numeroAtomico: 87, grupo: 1, periodo: 7, configElectronica: '[Rn] 7s¹', electronegatividad: 0.7, tipo: 'Metal alcalino', valencia: 1, masa: 223, radio: 260, estado: 'Sólido', descubrimiento: 1939, aniones: [], cationes: ['Fr⁺'], caracteristicas: 'El metal alcalino más pesado, extremadamente raro y radiactivo.' },
  { simbolo: 'Ra', nombre: 'Radio', numeroAtomico: 88, grupo: 2, periodo: 7, configElectronica: '[Rn] 7s²', electronegatividad: 0.9, tipo: 'Metal alcalinotérreo', valencia: 2, masa: 226, radio: 215, estado: 'Sólido', descubrimiento: 1898, aniones: [], cationes: ['Ra²⁺'], caracteristicas: 'Radiactivo, usado antiguamente en pinturas luminosas.' },
  { simbolo: 'Ac', nombre: 'Actinio', numeroAtomico: 89, grupo: 3, periodo: 7, configElectronica: '[Rn] 6d¹ 7s²', electronegatividad: 1.1, tipo: 'Actínido', valencia: 3, masa: 227, radio: 195, estado: 'Sólido', descubrimiento: 1899, aniones: [], cationes: ['Ac³⁺'], caracteristicas: 'Primer actínido, usado en generadores termoeléctricos.' },
  { simbolo: 'Th', nombre: 'Torio', numeroAtomico: 90, grupo: 3, periodo: 7, configElectronica: '[Rn] 6d² 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 4, masa: 232.04, radio: 180, estado: 'Sólido', descubrimiento: 1829, aniones: [], cationes: ['Th⁴⁺'], caracteristicas: 'Potencial combustible nuclear, usado en lámparas de gas.' },
  { simbolo: 'Pa', nombre: 'Protactinio', numeroAtomico: 91, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f² 6d¹ 7s²', electronegatividad: 1.5, tipo: 'Actínido', valencia: 5, masa: 231.04, radio: 180, estado: 'Sólido', descubrimiento: 1913, aniones: [], cationes: ['Pa⁵⁺'], caracteristicas: 'Muy raro y radiactivo, no tiene usos comerciales.' },
  { simbolo: 'U', nombre: 'Uranio', numeroAtomico: 92, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f³ 6d¹ 7s²', electronegatividad: 1.38, tipo: 'Actínido', valencia: 6, masa: 238.03, radio: 175, estado: 'Sólido', descubrimiento: 1789, aniones: [], cationes: ['U⁶⁺'], caracteristicas: 'Combustible nuclear principal, usado en armas y reactores.' },
  { simbolo: 'Np', nombre: 'Neptunio', numeroAtomico: 93, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f⁴ 6d¹ 7s²', electronegatividad: 1.36, tipo: 'Actínido', valencia: 5, masa: 237, radio: 175, estado: 'Sólido', descubrimiento: 1940, aniones: [], cationes: ['Np⁵⁺'], caracteristicas: 'Primer elemento transuránico sintetizado.' },
  { simbolo: 'Pu', nombre: 'Plutonio', numeroAtomico: 94, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f⁶ 7s²', electronegatividad: 1.28, tipo: 'Actínido', valencia: 4, masa: 244, radio: 175, estado: 'Sólido', descubrimiento: 1940, aniones: [], cationes: ['Pu⁴⁺'], caracteristicas: 'Usado en armas nucleares y como combustible.' },
  { simbolo: 'Am', nombre: 'Americio', numeroAtomico: 95, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f⁷ 7s²', electronegatividad: 1.13, tipo: 'Actínido', valencia: 3, masa: 243, radio: 175, estado: 'Sólido', descubrimiento: 1944, aniones: [], cationes: ['Am³⁺'], caracteristicas: 'Usado en detectores de humo.' },
  { simbolo: 'Cm', nombre: 'Curio', numeroAtomico: 96, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f⁷ 6d¹ 7s²', electronegatividad: 1.28, tipo: 'Actínido', valencia: 3, masa: 247, radio: 175, estado: 'Sólido', descubrimiento: 1944, aniones: [], cationes: ['Cm³⁺'], caracteristicas: 'Usado en generadores termoeléctricos para naves espaciales.' },
  { simbolo: 'Bk', nombre: 'Berkelio', numeroAtomico: 97, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f⁹ 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 3, masa: 247, radio: 175, estado: 'Sólido', descubrimiento: 1949, aniones: [], cationes: ['Bk³⁺'], caracteristicas: 'No tiene usos fuera de la investigación científica.' },
  { simbolo: 'Cf', nombre: 'Californio', numeroAtomico: 98, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f¹⁰ 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 3, masa: 251, radio: 175, estado: 'Sólido', descubrimiento: 1950, aniones: [], cationes: ['Cf³⁺'], caracteristicas: 'Usado en fuentes de neutrones para análisis de materiales.' },
  { simbolo: 'Es', nombre: 'Einstenio', numeroAtomico: 99, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f¹¹ 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 3, masa: 252, radio: 175, estado: 'Sólido', descubrimiento: 1952, aniones: [], cationes: ['Es³⁺'], caracteristicas: 'Sintetizado en pruebas de bombas de hidrógeno.' },
  { simbolo: 'Fm', nombre: 'Fermio', numeroAtomico: 100, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f¹² 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 3, masa: 257, radio: 175, estado: 'Sólido', descubrimiento: 1952, aniones: [], cationes: ['Fm³⁺'], caracteristicas: 'No tiene usos fuera de la investigación científica.' },
  { simbolo: 'Md', nombre: 'Mendelevio', numeroAtomico: 101, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f¹³ 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 3, masa: 258, radio: 175, estado: 'Sólido', descubrimiento: 1955, aniones: [], cationes: ['Md³⁺'], caracteristicas: 'Elemento sintético, extremadamente raro.' },
  { simbolo: 'No', nombre: 'Nobelio', numeroAtomico: 102, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 2, masa: 259, radio: 175, estado: 'Sólido', descubrimiento: 1966, aniones: [], cationes: ['No²⁺'], caracteristicas: 'Elemento sintético, vida media muy corta.' },
  { simbolo: 'Lr', nombre: 'Lawrencio', numeroAtomico: 103, grupo: 3, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹ 7s²', electronegatividad: 1.3, tipo: 'Actínido', valencia: 3, masa: 262, radio: 175, estado: 'Sólido', descubrimiento: 1961, aniones: [], cationes: ['Lr³⁺'], caracteristicas: 'Último elemento de la serie de los actínidos.' },
  { simbolo: 'Rf', nombre: 'Rutherfordio', numeroAtomico: 104, grupo: 4, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d² 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: 4, masa: 267, radio: 150, estado: 'Sólido', descubrimiento: 1969, aniones: [], cationes: ['Rf⁴⁺'], caracteristicas: 'Primer elemento transactínido, altamente radiactivo.' },
  { simbolo: 'Db', nombre: 'Dubnio', numeroAtomico: 105, grupo: 5, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d³ 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: 5, masa: 268, radio: 140, estado: 'Sólido', descubrimiento: 1970, aniones: [], cationes: ['Db⁵⁺'], caracteristicas: 'Elemento sintético, vida media muy corta.' },
  { simbolo: 'Sg', nombre: 'Seaborgio', numeroAtomico: 106, grupo: 6, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d⁴ 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: 6, masa: 271, radio: 130, estado: 'Sólido', descubrimiento: 1974, aniones: [], cationes: ['Sg⁶⁺'], caracteristicas: 'Elemento sintético, nombrado en honor a Glenn T. Seaborg.' },
  { simbolo: 'Bh', nombre: 'Bohrio', numeroAtomico: 107, grupo: 7, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d⁵ 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: 7, masa: 272, radio: 130, estado: 'Sólido', descubrimiento: 1981, aniones: [], cationes: ['Bh⁷⁺'], caracteristicas: 'Elemento sintético, vida media extremadamente corta.' },
  { simbolo: 'Hs', nombre: 'Hassio', numeroAtomico: 108, grupo: 8, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d⁶ 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: 8, masa: 270, radio: 130, estado: 'Sólido', descubrimiento: 1984, aniones: [], cationes: ['Hs⁸⁺'], caracteristicas: 'Elemento sintético, muy inestable.' },
  { simbolo: 'Mt', nombre: 'Meitnerio', numeroAtomico: 109, grupo: 9, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d⁷ 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: null, masa: 276, radio: 130, estado: 'Sólido', descubrimiento: 1982, aniones: [], cationes: [], caracteristicas: 'Elemento sintético, extremadamente inestable.' },
  { simbolo: 'Ds', nombre: 'Darmstatio', numeroAtomico: 110, grupo: 10, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d⁹ 7s¹', electronegatividad: null, tipo: 'Metal de transición', valencia: null, masa: 281, radio: 130, estado: 'Sólido', descubrimiento: 1994, aniones: [], cationes: [], caracteristicas: 'Elemento sintético, vida media de milisegundos.' },
  { simbolo: 'Rg', nombre: 'Roentgenio', numeroAtomico: 111, grupo: 11, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s¹', electronegatividad: null, tipo: 'Metal de transición', valencia: null, masa: 280, radio: 130, estado: 'Sólido', descubrimiento: 1994, aniones: [], cationes: [], caracteristicas: 'Elemento sintético, extremadamente inestable.' },
  { simbolo: 'Cn', nombre: 'Copernicio', numeroAtomico: 112, grupo: 12, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', electronegatividad: null, tipo: 'Metal de transición', valencia: 2, masa: 285, radio: 130, estado: 'Líquido', descubrimiento: 1996, aniones: [], cationes: ['Cn²⁺'], caracteristicas: 'Posiblemente un metal líquido a temperatura ambiente.' },
  { simbolo: 'Nh', nombre: 'Nihonio', numeroAtomico: 113, grupo: 13, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', electronegatividad: null, tipo: 'Metal', valencia: 1, masa: 286, radio: 170, estado: 'Sólido', descubrimiento: 2003, aniones: [], cationes: ['Nh⁺'], caracteristicas: 'Primer elemento descubierto en Asia, muy inestable.' },
  { simbolo: 'Fl', nombre: 'Flerovio', numeroAtomico: 114, grupo: 14, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', electronegatividad: null, tipo: 'Metal', valencia: 2, masa: 289, radio: 160, estado: 'Sólido', descubrimiento: 1998, aniones: [], cationes: ['Fl²⁺'], caracteristicas: 'Puede mostrar propiedades similares a los gases nobles.' },
  { simbolo: 'Mc', nombre: 'Moscovio', numeroAtomico: 115, grupo: 15, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', electronegatividad: null, tipo: 'Metal', valencia: 3, masa: 290, radio: 160, estado: 'Sólido', descubrimiento: 2003, aniones: [], cationes: ['Mc³⁺'], caracteristicas: 'Elemento sintético, extremadamente inestable.' },
  { simbolo: 'Lv', nombre: 'Livermorio', numeroAtomico: 116, grupo: 16, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', electronegatividad: null, tipo: 'Metal', valencia: 2, masa: 293, radio: 160, estado: 'Sólido', descubrimiento: 2000, aniones: [], cationes: ['Lv²⁺'], caracteristicas: 'Elemento sintético, vida media muy corta.' },
  { simbolo: 'Ts', nombre: 'Teneso', numeroAtomico: 117, grupo: 17, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', electronegatividad: null, tipo: 'Halógeno', valencia: 1, masa: 294, radio: 160, estado: 'Sólido', descubrimiento: 2010, aniones: ['Ts⁻'], cationes: ['Ts⁺'], caracteristicas: 'Segundo elemento más reciente descubierto.' },
  { simbolo: 'Og', nombre: 'Oganesón', numeroAtomico: 118, grupo: 18, periodo: 7, configElectronica: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', electronegatividad: null, tipo: 'Gas noble', valencia: 0, masa: 294, radio: 152, estado: 'Gas', descubrimiento: 2002, aniones: [], cationes: [], caracteristicas: 'Elemento más pesado conocido, muy inestable.' }
];

const TablaPeriodica = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<any>(null);

  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const abrirModal = (elemento: any) => {
    setElementoSeleccionado(elemento);
    setModalVisible(true);
  };

  const getElementPosition = (elemento: any) => {
    let left = (elemento.grupo - 1) * 70;
    let top = (elemento.periodo - 1) * 70;

    if (elemento.numeroAtomico >= 57 && elemento.numeroAtomico <= 71) {
      left = (elemento.numeroAtomico - 57 + 3) * 70;
      top = 8 * 70;
    } 
    else if (elemento.numeroAtomico >= 89 && elemento.numeroAtomico <= 103) {
      left = (elemento.numeroAtomico - 89 + 3) * 70;
      top = 9 * 70;
    }

    return { left, top };
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
            contentContainerStyle={[styles.scrollVerticalContainer, {height: 10 * 70 + 20}]}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.grid}>
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

        {/* Modal optimizado sin ScrollView */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {elementoSeleccionado && (
              <View style={[
                styles.modalContent, 
                { 
                  backgroundColor: coloresPorGrupo[elementoSeleccionado.grupo] || '#DDDDDD',
                  borderColor: coloresPorGrupo[elementoSeleccionado.grupo] || '#999999'
                }
              ]}>
                {/* Encabezado */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{elementoSeleccionado.nombre}</Text>
                  <Text style={styles.modalSymbol}>{elementoSeleccionado.simbolo}</Text>
                </View>

                {/* Primera fila de información */}
                <View style={styles.infoRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Número atómico: </Text>{elementoSeleccionado.numeroAtomico}</Text>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Masa atómica: </Text>{elementoSeleccionado.masa} u</Text>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Grupo: </Text>{elementoSeleccionado.grupo}</Text>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Periodo: </Text>{elementoSeleccionado.periodo}</Text>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Estado: </Text>{elementoSeleccionado.estado}</Text>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Radio: </Text>{elementoSeleccionado.radio} pm</Text>
                  </View>
                </View>

                {/* Segunda fila de información */}
                <View style={styles.infoRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Electronegatividad: </Text>{elementoSeleccionado.electronegatividad || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Valencia: </Text>{elementoSeleccionado.valencia}</Text>
                  </View>
                </View>

                {/* Configuración electrónica */}
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Configuración: </Text>{elementoSeleccionado.configElectronica}</Text>
                
                {/* Descubrimiento */}
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Descubierto: </Text>{elementoSeleccionado.descubrimiento}</Text>

                {/* Iones */}
                <View style={styles.infoRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.sectionTitle}>Cationes:</Text>
                    <Text style={styles.infoText}>{elementoSeleccionado.cationes.join(', ') || 'Ninguno'}</Text>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={styles.sectionTitle}>Aniones:</Text>
                    <Text style={styles.infoText}>{elementoSeleccionado.aniones.join(', ') || 'Ninguno'}</Text>
                  </View>
                </View>

                {/* Características */}
                <Text style={styles.sectionTitle}>Características:</Text>
                <Text style={styles.characteristicsText}>{elementoSeleccionado.caracteristicas}</Text>

                {/* Botón de cerrar */}
                <TouchableOpacity
                  style={styles.closeButton}
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
    width: 18 * 70,
    height: 10 * 70,
    marginHorizontal: 10,
  },
  elemento: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    top: 2,
    left: 2,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.9,
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
  },
  modalHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSymbol: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoColumn: {
    width: '48%',
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 5,
    lineHeight: 18,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 3,
  },
  characteristicsText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TablaPeriodica;