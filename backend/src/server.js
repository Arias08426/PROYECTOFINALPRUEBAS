import createApp from './app.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const { app, db } = await createApp();

        const server = app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`); // eslint-disable-line no-console
            console.log(`API disponible en http://localhost:${PORT}/api`); // eslint-disable-line no-console
            console.log(`Health check: http://localhost:${PORT}/health`); // eslint-disable-line no-console
            console.log('Base de datos SQLite conectada'); // eslint-disable-line no-console
        });

        process.on('SIGTERM', async () => {
            console.log('SIGTERM recibido, cerrando servidor...'); // eslint-disable-line no-console
            server.close(async () => {
                await db.close();
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('SIGINT recibido, cerrando servidor...'); // eslint-disable-line no-console
            server.close(async () => {
                await db.close();
                process.exit(0);
            });
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error); // eslint-disable-line no-console
        process.exit(1);
    }
}

startServer();
