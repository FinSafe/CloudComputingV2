const { convertBinary, fibonacci, insertStudent, getStudent, registerUser, loginUser, getUsers } = require('./handler.js');

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
    // {
    //     path: '/convert-binary',
    //     method: 'POST',
    //     handler: convertBinary
    // },
    // {
    //     path: '/fibonacci',
    //     method: 'POST',
    //     handler: fibonacci
    // },
    {
        path: '/insertStudent',
        method: 'POST',
        handler: insertStudent
    },
    {
        path: '/getStudent',
        method: 'GET',
        handler: getStudent
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
    }
];

module.exports = routes;