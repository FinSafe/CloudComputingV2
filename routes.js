const { convertBinary, fibonacci, insertStudent, getStudent, registerUser, loginUser, getUsers, createWallet, viewWallet, validateToken, deleteUser, editUser, getUserById, createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome, createOutcome, getOutcomes, getWallets, updateWallet, deleteWallet, createRekomendasi, getRekomendasi, updateRekomendasi, deleteRekomendasi, createPrediction, getPrediction, updatePrediction, deletePrediction, createPertanyaan, getPertanyaan, updatePertanyaan, deletePertanyaan } = require('./handler.js');

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
        handler: getIncomeById,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/outcome/{outcome_id}',
        handler: updateIncome,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/outcome/{outcome_id}',
        handler: deleteIncome,
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
        handler: getIncomeById,
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
    {
        method: 'POST',
        path: '/rekomendasi',
        handler: createRekomendasi,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/rekomendasi',
        handler: getRekomendasi,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/rekomendasi/{rekomendasi_id}',
        handler: updateRekomendasi,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/rekomendasi/{rekomendasi_id}',
        handler: deleteRekomendasi,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'POST',
        path: '/prediction',
        handler: createPrediction,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/prediction',
        handler: getPrediction,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/prediction/{prediction_id}',
        handler: updatePrediction,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/prediction/{prediction_id}',
        handler: deletePrediction,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'POST',
        path: '/pertanyaan',
        handler: createPertanyaan,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'GET',
        path: '/pertanyaan',
        handler: getPertanyaan,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'PUT',
        path: '/pertanyaan/{pertanyaan_id}',
        handler: updatePertanyaan,
        options: {
            pre: [{ method: validateToken }],
        },
    },
    {
        method: 'DELETE',
        path: '/pertanyaan/{pertanyaan_id}',
        handler: deletePertanyaan,
        options: {
            pre: [{ method: validateToken }],
        },
    }

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