const Hapi = require('@hapi/hapi');
const routes = require('./routes.js');
const jwt = require('jsonwebtoken'); // Tambahkan baris ini

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // await server.register(require('hapi-auth-jwt2'));

    // server.auth.strategy('jwt', 'jwt', {
    //     key: process.env.JWT_SECRET,
    //     validate: async (decoded, request, h) => {
    //         try {
    //             const query = 'SELECT * FROM users WHERE id = ?';
    //             const users = await pool.query(query, [decoded.id]);

    //             if (users.length === 0) {
    //                 return { isValid: false };
    //             }

    //             return { isValid: true };
    //         } catch (error) {
    //             return { isValid: false };
    //         }
    //     }
    // });

    // server.auth.default('jwt');

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();