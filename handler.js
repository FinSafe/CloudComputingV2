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
const getUserById = async (request, h) => {
    const { user_id } = request.params;

    try {
        const query = 'SELECT * FROM users WHERE user_id = ?';
        const users = await pool.query(query, [user_id]);

        if (users.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'User tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            result: users[0]
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

const deleteUser = async (request, h) => {
    const { user_id } = request.params;

    try {
        const query = 'DELETE FROM users WHERE user_id = ?';
        const result = await pool.query(query, [user_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'User tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'User berhasil dihapus',
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

const editUser = async (request, h) => {
    const { user_id } = request.params;
    const { nama, email, password } = request.payload;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'UPDATE users SET nama = ?, email = ?, password = ? WHERE user_id = ?';
        const result = await pool.query(query, [nama, email, hashedPassword, user_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'User tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'User berhasil diperbarui',
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
const createIncome = async (request, h) => {
    const { total_income, income_type, note } = request.payload;

    try {
        const created_at = new Date();
        const update_at = created_at;
        const query = 'INSERT INTO income (total_income, income_type, note, created_at, update_at) VALUES (?, ?, ?, ?, ?)';
        await pool.query(query, [total_income, income_type, note, created_at, update_at]);

        const response = h.response({
            status: 'success',
            message: 'Income berhasil ditambahkan'
        });
        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const getIncomes = async (request, h) => {
    try {
        const query = 'SELECT * FROM income';
        const incomes = await pool.query(query);

        const response = h.response({
            status: 'success',
            result: incomes
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const getIncomeById = async (request, h) => {
    const { income_id } = request.params;

    try {
        const query = 'SELECT * FROM income WHERE income_id = ?';
        const incomes = await pool.query(query, [income_id]);

        if (incomes.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Income tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            result: incomes[0]
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const updateIncome = async (request, h) => {
    const { income_id } = request.params;
    const { total_income, income_type, note } = request.payload;

    try {
        const update_at = new Date();
        const query = 'UPDATE income SET total_income = ?, income_type = ?, note = ?, update_at = ? WHERE income_id = ?';
        const result = await pool.query(query, [total_income, income_type, note, update_at, income_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Income tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Income berhasil diperbarui',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const deleteIncome = async (request, h) => {
    const { income_id } = request.params;

    try {
        const query = 'DELETE FROM income WHERE income_id = ?';
        const result = await pool.query(query, [income_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Income tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Income berhasil dihapus',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};

const createOutcome = async (request, h) => {
    const { total_outcome, outcome_type, note } = request.payload;

    try {
        const created_at = new Date();
        const update_at = created_at;
        const query = 'INSERT INTO outcome (total_outcome, outcome_type, note, created_at, update_at) VALUES (?, ?, ?, ?, ?)';
        await pool.query(query, [total_outcome, outcome_type, note, created_at, update_at]);

        const response = h.response({
            status: 'success',
            message: 'Outcome berhasil ditambahkan'
        });
        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const getOutcomes = async (request, h) => {
    try {
        const query = 'SELECT * FROM outcome';
        const outcomes = await pool.query(query);

        const response = h.response({
            status: 'success',
            result: outcomes
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const getOutcomeById = async (request, h) => {
    const { outcome_id } = request.params;

    try {
        const query = 'SELECT * FROM outcome WHERE outcome_id = ?';
        const outcomes = await pool.query(query, [outcome_id]);

        if (outcomes.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Outcome tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            result: outcomes[0]
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const updateOutcome = async (request, h) => {
    const { outcome_id } = request.params;
    const { total_outcome, outcome_type, note } = request.payload;

    try {
        const update_at = new Date();
        const query = 'UPDATE outcome SET total_outcome = ?, outcome_type = ?, note = ?, update_at = ? WHERE outcome_id = ?';
        const result = await pool.query(query, [total_outcome, outcome_type, note, update_at, outcome_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Outcome tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Outcome berhasil diperbarui',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const deleteOutcome = async (request, h) => {
    const { outcome_id } = request.params;

    try {
        const query = 'DELETE FROM outcome WHERE outcome_id = ?';
        const result = await pool.query(query, [outcome_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Outcome tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Outcome berhasil dihapus',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};

const createWallet = async (request, h) => {
    const { user_id, income_id, outcome_id } = request.payload;

    try {
        const query = 'INSERT INTO wallet (user_id, income_id, outcome_id) VALUES (?, ?, ?)';
        await pool.query(query, [user_id, income_id, outcome_id]);

        const response = h.response({
            status: 'success',
            message: 'Wallet berhasil ditambahkan'
        });
        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const getWallets = async (request, h) => {
    try {
        const query = `
            SELECT wallet.wallet_id, wallet.user_id, wallet.income_id, wallet.outcome_id,
            income.total_income, income.income_type, income.note as income_note,
            outcome.total_outcome, outcome.outcome_type, outcome.note as outcome_note
            FROM wallet
            LEFT JOIN income ON wallet.income_id = income.income_id
            LEFT JOIN outcome ON wallet.outcome_id = outcome.outcome_id
        `;
        const wallets = await pool.query(query);

        const response = h.response({
            status: 'success',
            result: wallets
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
const getWalletById = async (request, h) => {
    const { wallet_id } = request.params;

    try {
        const query = 'SELECT * FROM wallet WHERE wallet_id = ?';
        const wallets = await pool.query(query, [wallet_id]);

        if (wallets.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Wallet tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            result: wallets[0]
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const updateWallet = async (request, h) => {
    const { wallet_id } = request.params;
    const { user_id, income_id, outcome_id } = request.payload;

    try {
        const query = 'UPDATE wallet SET user_id = ?, income_id = ?, outcome_id = ? WHERE wallet_id = ?';
        const result = await pool.query(query, [user_id, income_id, outcome_id, wallet_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Wallet tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Wallet berhasil diperbarui',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};
const deleteWallet = async (request, h) => {
    const { wallet_id } = request.params;

    try {
        const query = 'DELETE FROM wallet WHERE wallet_id = ?';
        const result = await pool.query(query, [wallet_id]);

        if (result.affectedRows === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Wallet tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Wallet berhasil dihapus',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
    }
};


// const createWallet = async (request, h) => {
//     const { userId, income, outcome } = request.payload;

//     try {
//         const query = 'INSERT INTO wallet (user_id, income, outcome) VALUES (?, ?, ?)';
//         const result = await pool.query(query, [userId, income, outcome]);

//         const response = h.response({
//             status: 'success',
//             message: 'Wallet created successfully',
//             walletId: result.insertId
//         });
//         response.code(201);
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

// const viewWallet = async (request, h) => {
//     const { userId } = request.params;

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
    getUserById,
    deleteUser,
    editUser,
    createIncome,
    getIncomeById,
    getIncomes,
    updateIncome,
    deleteIncome,
    createOutcome,
    getOutcomes,
    getOutcomeById,
    updateOutcome,
    deleteOutcome,
    createWallet,
    getWallets,
    getWalletById,
    updateWallet,
    deleteWallet,
    // viewWallet
}