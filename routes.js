const { convertBinary, fibonacci, insertStudent, getStudent, registerUser, loginUser, getUsers, createWallet, viewWallet, validateToken } = require('./handler.js');

// const jwt = require('jsonwebtoken');


const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello, world!';
        }
    },
    {
        path: '/test',
        method: 'GET',
        handler: (request, h) => {
            const response = h.response({
                status: 'success',
                message: 'testing',
            });
            response.code(200);
            return response;
        }
    },

    {
        method: 'POST',
        path: '/register',
        handler: registerUser,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginUser,
    },
    {
        method: 'GET',
        path: '/users',
        handler: getUsers,
    },
    {
        method: 'POST',
        path: '/wallet',
        handler: createWallet,
        options: {
            pre: [{ method: validateToken }]
        }
    },
    {
        method: 'GET',
        path: '/wallet',
        handler: viewWallet,
        options: {
            pre: [{ method: validateToken }]
        }
    },
];

module.exports = routes;