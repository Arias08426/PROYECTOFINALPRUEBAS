export default {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/database/migrate.js'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true,
    maxWorkers: 1,  // Ejecutar tests secuencialmente para evitar conflictos de BD
    transform: {}  // Necesario para que Jest no intente transformar los módulos ES
};
