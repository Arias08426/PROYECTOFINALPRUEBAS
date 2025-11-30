import Database from './database.js';

async function setupDatabase() {
    try {
        console.log('Configurando base de datos...'); // eslint-disable-line no-console

        const db = new Database();
        await db.connect();

        // Crear tabla de categorías
        await db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

        // Crear tabla de productos
        await db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                stock INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )
        `);

        await db.close();

        console.log('Base de datos configurada exitosamente'); // eslint-disable-line no-console
        console.log('Tablas creadas: categories, products'); // eslint-disable-line no-console

    } catch (error) {
        console.error('Error configurando la base de datos:', error); // eslint-disable-line no-console
        process.exit(1);
    }
}

setupDatabase();