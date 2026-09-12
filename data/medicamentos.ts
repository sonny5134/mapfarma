// data/medicamentos.ts
import { Medicamento } from '../types';

// TODO: reemplazar por datos reales (los medicamentos que cada farmacia publique desde "Agregar medicamento")
// En la Clase 5 esto se reemplaza por una consulta real a Firebase (ver hooks/useMedicamentos.ts)
export const medicamentos: Medicamento[] = [
  {
    id: 'med-1',
    nombre: 'Ibuprofeno 400mg',
    categoria: 'Analgésicos',
    precio: 1850,
    stock: 48,
    descripcion: 'Antiinflamatorio y analgésico. Ideal para dolor de cabeza, muscular y fiebre.',
    requiereReceta: false,
    farmaciaId: 'farm-3',
  },
  {
    id: 'med-2',
    nombre: 'Paracetamol 500mg',
    categoria: 'Analgésicos',
    precio: 980,
    stock: 60,
    descripcion: 'Analgésico y antifebril de uso común.',
    requiereReceta: false,
    farmaciaId: 'farm-1',
  },
  {
    id: 'med-3',
    nombre: 'Amoxicilina 500mg',
    categoria: 'Antibióticos',
    precio: 3200,
    stock: 20,
    descripcion: 'Antibiótico de amplio espectro. Requiere receta médica.',
    requiereReceta: true,
    farmaciaId: 'farm-1',
  },
  {
    id: 'med-4',
    nombre: 'Omeprazol 20mg',
    categoria: 'Gastro',
    precio: 1640,
    stock: 35,
    descripcion: 'Reduce la acidez estomacal. Uso bajo indicación.',
    requiereReceta: false,
    farmaciaId: 'farm-3',
  },
  {
    id: 'med-5',
    nombre: 'Loratadina 10mg',
    categoria: 'Antialérgicos',
    precio: 1290,
    stock: 0, // Caso edge: sin stock, para conditional rendering ("Agotado")
    descripcion: 'Antihistamínico para alergias estacionales. Actualmente sin stock.',
    requiereReceta: false,
    farmaciaId: 'farm-2',
  },
  {
    id: 'med-6',
    nombre: 'Ciprofloxacina 500mg',
    categoria: 'Antibióticos',
    precio: 4100,
    stock: 0, // Caso edge: sin stock, además requiere receta
    descripcion: 'Antibiótico de segunda línea. Requiere receta. Sin stock por el momento.',
    requiereReceta: true,
    farmaciaId: 'farm-1',
  },
  {
    id: 'med-7',
    nombre: 'Diclofenac 75mg',
    categoria: 'Analgésicos',
    precio: 2100,
    stock: 15,
    descripcion: 'Antiinflamatorio no esteroideo, uso en dolores musculares y articulares.',
    requiereReceta: false,
    farmaciaId: 'farm-2',
  },
  {
    id: 'med-8',
    nombre: 'Ranitidina 150mg',
    categoria: 'Gastro',
    precio: 890,
    stock: 22,
    descripcion: 'Reduce la producción de ácido estomacal.',
    requiereReceta: false,
    farmaciaId: 'farm-3',
  },
];
