// data/medicamentos.ts
import { Medicamento } from '../types';

// TODO: reemplazar por datos reales (los medicamentos que cada farmacia publique desde "Agregar medicamento")
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
];
