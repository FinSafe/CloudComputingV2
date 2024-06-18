const { convertBinary, fibonacci, insertStudent, getStudent, registerUser, loginUser, getUsers, createWallet, viewWallet, validateToken, deleteUser, editUser, getUserById, createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } = require('./handler.js');

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
        method: 'GET',
        path: '/users/{user_id}',
        handler: getUserById,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/users/{user_id}',
        handler: deleteUser,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/users/{user_id}',
        handler: editUser,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'POST',
        path: '/income',
        handler: createIncome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/income',
        handler: getIncomes,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/income/{income_id}',
        handler: getIncomeById,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/income/{income_id}',
        handler: updateIncome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/income/{income_id}',
        handler: deleteIncome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'POST',
        path: '/outcome',
        handler: createOutcome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/outcome',
        handler: getOutcomes,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/outcome/{outcome_id}',
        handler: getOutcomeById,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/outcome/{outcome_id}',
        handler: updateOutcome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/outcome/{outcome_id}',
        handler: deleteOutcome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'POST',
        path: '/wallet',
        handler: createWallet,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/wallet',
        handler: getWallets,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/wallet/{wallet_id}',
        handler: getWalletById,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/wallet/{wallet_id}',
        handler: updateWallet,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/wallet/{wallet_id}',
        handler: deleteWallet,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    // {
    //     method: 'POST',
    //     path: '/wallet',
    //     handler: createWallet
    // },
    // {
    //     method: 'GET',
    //     path: '/wallet/{userId}',
    //     handler: viewWallet
    // }
    // {
    //     method: 'POST',
    //     path: '/wallet',
    //     handler: createWallet,
    //     options: {
    //         pre: [{ method: validateToken }]
    //     }
    // },
    // {
    //     method: 'GET',
    //     path: '/wallet',
    //     handler: viewWallet,
    //     options: {
    //         pre: [{ method: validateToken }]
    //     }
    // },
];

module.exports = routes;