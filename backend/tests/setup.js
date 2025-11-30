// Setup global para las pruebas Jest
const path = require('path');

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = path.join(__dirname, 'test.db');

// Configurar timeout global para pruebas
jest.setTimeout(30000);

// Mock global para console.log en pruebas (opcional)
const originalConsoleError = console.error; // eslint-disable-line no-console
const originalConsoleWarn = console.warn; // eslint-disable-line no-console

beforeAll(() => {
    // Silenciar logs en pruebas (opcional)
    console.error = jest.fn(); // eslint-disable-line no-console
    console.warn = jest.fn(); // eslint-disable-line no-console
});

afterAll(() => {
    // Restaurar console original
    console.error = originalConsoleError; // eslint-disable-line no-console
    console.warn = originalConsoleWarn; // eslint-disable-line no-console
});

// Limpiar mocks después de cada prueba
afterEach(() => {
    jest.clearAllMocks();
});

// Configuración global para manejo de promesas rechazadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason); // eslint-disable-line no-console
    // En pruebas, podemos ser más estrictos
    if (process.env.NODE_ENV === 'test') {
        throw reason;
    }
});

// Helper functions para pruebas
global.testHelpers = {
    // Función para esperar un tiempo determinado
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Función para crear datos de prueba
    createTestCategory: (name = 'Test Category') => ({
        name: name
    }),

    createTestProduct: (categoryId = 1, name = 'Test Product') => ({
        name: name,
        description: 'Test product description',
        price: 99.99,
        stock: 10,
        category_id: categoryId // eslint-disable-line camelcase
    })
};
