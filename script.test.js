const { paginaAnterior, cambiarSeccion, irAPagina } = require('./script');

// ================= MOCKS =================

// Simular window
global.window = {
  scrollTo: jest.fn()
};

// Simular document
global.document = {
  getElementById: jest.fn(() => ({
    innerHTML: "",
    classList: { toggle: jest.fn() },
    style: {}
  }))
};

// Simular fetch (API)
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      info: { pages: 1 },
      results: []
    })
  })
);

// ================= TESTS =================

beforeEach(() => {
  global.numeroPagina = 1;
  global.seccionActual = "character";
});

// 🔹 paginaAnterior

test('paginaAnterior baja si > 1', () => {
  global.numeroPagina = 3;

  paginaAnterior();

  expect(global.numeroPagina).toBe(2);
});

test('paginaAnterior no baja de 1', () => {
  global.numeroPagina = 1;

  paginaAnterior();

  expect(global.numeroPagina).toBe(1);
});

// 🔹 cambiarSeccion

test('cambiarSeccion cambia y resetea página', () => {
  global.numeroPagina = 5;

  cambiarSeccion("episode");

  expect(global.seccionActual).toBe("episode");
  expect(global.numeroPagina).toBe(1);
});

// 🔹 irAPagina

test('irAPagina cambia número de página', () => {
  irAPagina(7);

  expect(global.numeroPagina).toBe(7);
});