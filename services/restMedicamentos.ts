// services/restMedicamentos.ts
// Versión alternativa del servicio de medicamentos que consume una API REST con Axios.
// Cumple el MISMO contrato que firestoreMedicamentos (ver services/contratos.ts),
// por eso los hooks y las pantallas no notan la diferencia.
import { api } from './api';
import { Medicamento } from '../types';
import { MedicamentosService, Unsubscribe } from './contratos';

// Forma de los datos tal como los devuelve la API (DummyJSON)
interface ProductoApi {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail?: string;
}

// Traduce el producto de la API al tipo Medicamento que entiende la app
function mapear(p: ProductoApi): Medicamento {
  return {
    id: String(p.id),
    nombre: p.title,
    categoria: 'Otros',
    precio: Math.round(p.price),
    stock: p.stock,
    descripcion: p.description,
    requiereReceta: false,
    imagenUrl: p.thumbnail,
    farmaciaId: 'rest',
  };
}

export const restMedicamentosService: MedicamentosService = {
  // Una API REST no avisa los cambios sola: pedimos los datos una vez y los entregamos.
  subscribeAll(onData, onError): Unsubscribe {
    let activo = true; // evita actualizar el estado si la pantalla ya se cerró

    api
      .get<{ products: ProductoApi[] }>('/products', { params: { limit: 20 } })
      .then((res) => {
        if (activo) onData(res.data.products.map(mapear));
      })
      .catch((err) => {
        if (activo) onError(err.message);
      });

    return () => {
      activo = false;
    };
  },

  async getById(id) {
    try {
      const res = await api.get<ProductoApi>(`/products/${id}`);
      return mapear(res.data);
    } catch {
      return null;
    }
  },
};
