// __tests__/MedicamentoCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MedicamentoCard } from '../components/MedicamentoCard';
import { Medicamento } from '../types';

// Mock de los íconos: en Jest no existe el registro de assets de Metro,
// así que cargar la fuente del ícono falla con "missing from the asset registry".
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  const Icon = (props: { name?: string }) => <Text>{props.name}</Text>;
  return new Proxy({}, { get: () => Icon });
});

const medicamento: Medicamento = {
  id: 'med-1',
  nombre: 'Ibuprofeno 400mg',
  categoria: 'Analgésicos',
  precio: 1850,
  stock: 48,
  descripcion: 'Antiinflamatorio y analgésico.',
  requiereReceta: false,
  farmaciaId: 'farm-1',
};

describe('MedicamentoCard', () => {
  it('muestra el nombre, la categoría y el precio', async () => {
    await render(<MedicamentoCard medicamento={medicamento} />);

    expect(screen.getByText('Ibuprofeno 400mg')).toBeTruthy();
    expect(screen.getByText('Analgésicos')).toBeTruthy();
    expect(screen.getByText(/\$1[.,]?850/)).toBeTruthy();
  });

  it('llama a onAgregar con el medicamento al tocar el botón "+"', async () => {
    const onAgregar = jest.fn();
    await render(<MedicamentoCard medicamento={medicamento} onAgregar={onAgregar} />);

    // Lo encontramos por su accessibilityLabel: la accesibilidad también sirve para testear
    await fireEvent.press(screen.getByLabelText('Agregar Ibuprofeno 400mg al carrito'));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(medicamento);
  });

  it('llama a onPress al tocar la tarjeta (para ir al detalle)', async () => {
    const onPress = jest.fn();
    await render(<MedicamentoCard medicamento={medicamento} onPress={onPress} />);

    await fireEvent.press(screen.getByLabelText(/^Ibuprofeno 400mg, Analgésicos/));

    expect(onPress).toHaveBeenCalledWith(medicamento);
  });

  it('con stock 0 muestra "Agotado" y oculta el botón de agregar (conditional rendering)', async () => {
    await render(<MedicamentoCard medicamento={{ ...medicamento, stock: 0 }} />);

    expect(screen.getByText('Agotado')).toBeTruthy();
    expect(screen.queryByLabelText('Agregar Ibuprofeno 400mg al carrito')).toBeNull();
  });

  it('muestra la etiqueta "Receta" si requiere receta médica', async () => {
    await render(<MedicamentoCard medicamento={{ ...medicamento, requiereReceta: true }} />);

    expect(screen.getByText('Receta')).toBeTruthy();
  });
});