import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

// Colores por grupo con tonos neón más vibrantes
const coloresPorGrupo: Record<number, string> = {
  1: '#ff007f', // Metales alcalinos - Rosa fuerte
  2: '#ff4500', // Metales alcalinotérreos - Naranja intenso
  3: '#ffd700', // Metales de transición - Amarillo brillante
  4: '#00ff7f', // Metaloides - Verde neón
  5: '#00ffff', // No metales - Cian eléctrico
  6: '#8a2be2', // Halógenos - Púrpura vibrante
  7: '#1e90ff', // Gases nobles - Azul brillante
  8: '#a9a9a9', // Lantánidos y Actínidos - Gris neutro
};

// Lista completa de los 118 elementos de la tabla periódica
const elementos = [
  { simbolo: 'H', nombre: 'Hidrógeno', numeroAtomico: 1, grupo: 1, periodo: 1 },
  { simbolo: 'He', nombre: 'Helio', numeroAtomico: 2, grupo: 18, periodo: 1 },
  { simbolo: 'Li', nombre: 'Litio', numeroAtomico: 3, grupo: 1, periodo: 2 },
  { simbolo: 'Be', nombre: 'Berilio', numeroAtomico: 4, grupo: 2, periodo: 2 },
  { simbolo: 'B', nombre: 'Boro', numeroAtomico: 5, grupo: 13, periodo: 2 },
  { simbolo: 'C', nombre: 'Carbono', numeroAtomico: 6, grupo: 14, periodo: 2 },
  { simbolo: 'N', nombre: 'Nitrógeno', numeroAtomico: 7, grupo: 15, periodo: 2 },
  { simbolo: 'O', nombre: 'Oxígeno', numeroAtomico: 8, grupo: 16, periodo: 2 },
  { simbolo: 'F', nombre: 'Flúor', numeroAtomico: 9, grupo: 17, periodo: 2 },
  { simbolo: 'Ne', nombre: 'Neón', numeroAtomico: 10, grupo: 18, periodo: 2 },
  { simbolo: 'Na', nombre: 'Sodio', numeroAtomico: 11, grupo: 1, periodo: 3 },
  { simbolo: 'Mg', nombre: 'Magnesio', numeroAtomico: 12, grupo: 2, periodo: 3 },
  { simbolo: 'Al', nombre: 'Aluminio', numeroAtomico: 13, grupo: 13, periodo: 3 },
  { simbolo: 'Si', nombre: 'Silicio', numeroAtomico: 14, grupo: 14, periodo: 3 },
  { simbolo: 'P', nombre: 'Fósforo', numeroAtomico: 15, grupo: 15, periodo: 3 },
  { simbolo: 'S', nombre: 'Azufre', numeroAtomico: 16, grupo: 16, periodo: 3 },
  { simbolo: 'Cl', nombre: 'Cloro', numeroAtomico: 17, grupo: 17, periodo: 3 },
  { simbolo: 'Ar', nombre: 'Argón', numeroAtomico: 18, grupo: 18, periodo: 3 },
  { simbolo: 'K', nombre: 'Potasio', numeroAtomico: 19, grupo: 1, periodo: 4 },
  { simbolo: 'Ca', nombre: 'Calcio', numeroAtomico: 20, grupo: 2, periodo: 4 },
  { simbolo: 'Sc', nombre: 'Escandio', numeroAtomico: 21, grupo: 3, periodo: 4 },
  { simbolo: 'Ti', nombre: 'Titanio', numeroAtomico: 22, grupo: 4, periodo: 4 },
  { simbolo: 'V', nombre: 'Vanadio', numeroAtomico: 23, grupo: 5, periodo: 4 },,
  // Agrega los 88 elementos restantes aquí...
];

// Componente principal
const TablaPeriodica = () => {
  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Text style={styles.title}> Tabla Periódica Neón </Text>
        <View style={styles.grid}>
          {elementos.map((elemento, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.elemento,
                {
                  backgroundColor: coloresPorGrupo[elemento.grupo] || '#FFFFFF',
                  left: elemento.grupo * 65,
                  top: elemento.periodo * 65,
                  borderColor: coloresPorGrupo[elemento.grupo], // Borde neón
                },
              ]}
            >
              <Text style={styles.simbolo}>{elemento.simbolo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Estilos con efectos de neón
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    color: '#00eaff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00eaff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  grid: {
    position: 'relative',
    width: 900,
    height: 400,
  },
  elemento: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3, // Borde para resaltar neón
    shadowColor: '#00eaff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  simbolo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#00eaff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
});

export default TablaPeriodica;


