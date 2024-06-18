const mysql = require('promise-mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// createUnixSocketPool initializes a Unix socket connection pool for
// a Cloud SQL instance of MySQL.
const createUnixSocketPool = async config => {
    return mysql.createPool({
        user: process.env.DB_USER, // e.g. 'my-db-user'
        password: process.env.DB_PASS, // e.g. 'my-db-password'
        database: process.env.DB_NAME, // e.g. 'my-database'
        socketPath: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'
        jwtsecret: process.env.JWT_SECRET
    });
};

let pool;
(async () => {
    pool = await createUnixSocketPool();
})();

const validateToken = async (request, h) => {
    try {
        const authorization = request.headers.authorization;
        if (!authorization) {
            throw new Error('Missing authentication');
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            throw new Error('Invalid token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.auth.credentials = decoded;
        return h.continue;
    } catch (error) {
        return h.response({
            statusCode: 401,
            error: 'Unauthorized',
            message: error.message
        }).code(401);
    }
};

const registerUser = async (request, h) => {
    const { nama, email, password } = request.payload;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)';
        await pool.query(query, [nama, email, hashedPassword]);

        const response = h.response({
            status: 'success',
            message: 'User berhasil didaftarkan'
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            result: error.message,
        });
        response.code(400);
        return response;
    }
};

const loginUser = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const users = await pool.query(query, [email]);

        if (users.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Email atau password salah',
            });
            response.code(401);
            return response;
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const response = h.response({
                status: 'fail',
                message: 'Email atau password salah',
            });
            response.code(401);
            return response;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = h.response({
            status: 'success',
            message: 'Login berhasil',
            token,
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            result: error.message,
        });
        response.code(400);
        return response;
    }
};
const getUsers = async (request, h) => {
    try {
        const query = 'SELECT * FROM users';
        const users = await pool.query(query);

        const response = h.response({
            status: 'success',
            result: users
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            result: error.message,
        });
        response.code(400);
        return response;
    }
};

const createWallet = async (request, h) => {
    const { userId, income, outcome } = request.payload;

    try {
        const query = 'INSERT INTO wallet (user_id, income, outcome) VALUES (?, ?, ?)';
        const result = await pool.query(query, [userId, income, outcome]);

        const response = h.response({
            status: 'success',
            message: 'Wallet created successfully',
            walletId: result.insertId
        });
        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            result: error.message
        });
        response.code(400);
        return response;
    }
};

const viewWallet = async (request, h) => {
    const { userId } = request.params;

    try {
        const query = 'SELECT * FROM wallet WHERE user_id = ?';
        const wallets = await pool.query(query, [userId]);

        const response = h.response({
            status: 'success',
            result: wallets
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            result: error.message
        });
        response.code(400);
        return response;
    }
};


// const createWallet = async (request, h) => {
//     const { income, outcome } = request.payload;
//     const userId = request.auth.credentials.id;

//     try {
//         const userCheckQuery = 'SELECT * FROM users WHERE id = ?';
//         const users = await pool.query(userCheckQuery, [userId]);
//         if (users.length === 0) {
//             const response = h.response({
//                 status: 'fail',
//                 message: 'User tidak ditemukan'
//             });
//             response.code(404);
//             return response;
//         }

//         const query = 'INSERT INTO wallet (user_id, income, outcome) VALUES (?, ?, ?)';
//         const result = await pool.query(query, [userId, income, outcome]);

//         const response = h.response({
//             status: 'success',
//             message: 'Wallet berhasil dibuat',
//             walletId: result.insertId
//         });
//         response.code(201);
//         return response;
//     } catch (error) {
//         const response = h.response({
//             status: 'fail',
//             message: error.message
//         });
//         response.code(400);
//         return response;
//     }
// };
// const viewWallet = async (request, h) => {
//     const userId = request.auth.credentials.id;

//     try {
//         const query = 'SELECT * FROM wallet WHERE user_id = ?';
//         const wallets = await pool.query(query, [userId]);

//         const response = h.response({
//             status: 'success',
//             result: wallets
//         });
//         response.code(200);
//         return response;
//     } catch (error) {
//         const response = h.response({
//             status: 'fail',
//             result: error.message
//         });
//         response.code(400);
//         return response;
//     }
// };

module.exports = {
    validateToken,
    loginUser,
    registerUser,
    getUsers,
    createWallet,
    viewWallet
}