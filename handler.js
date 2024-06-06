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
    });
};

let pool;
(async () => {
    pool = await createUnixSocketPool();
})();

const registerUser = async (request, h) => {
    const { name, email, password } = request.payload;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await pool.query(query, [name, email, hashedPassword]);

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

const insertStudent = async (request, h) => {

    const { name, univ, semester } = request.payload;

    try {

        const query = 'INSERT INTO student(name, univ, semester) VALUES(?, ?, ?)';
        const queryResult = await pool.query(query, [name, univ, semester]);

        const response = h.response({
            status: 'success',
            message: 'Data berhasil diinput ke database'
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
}

const getStudent = async (request, h) => {

    try {

        const query = 'SELECT * FROM student';
        const queryResult = await pool.query(query);

        const response = h.response({
            status: 'success',
            result: queryResult
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
}


// const convertBinary = async (request, h) => {

//     const { data } = request.payload;
//     let resultBinary = '';

//     if (typeof data !== 'number' || !Number.isInteger(data)) {
//         const response = h.response({
//             status: 'fail',
//             message: 'Input harus angka dan bilangan bulat!',
//         });
//         response.code(400);
//         return response;
//     }

//     if (data === 0) {
//         resultBinary = '0';
//     }

//     else {
//         let num = data;
//         while(num > 0) {
//             resultBinary = (num % 2) + resultBinary;
//             num = Math.floor(num / 2);
//         }
//     }

//     const response = h.response({
//         status: 'success',
//         result: resultBinary,
//     });
//     response.code(200);
//     return response;
// }

// const fibonacci = async (request, h) => {

//     const { n } = request.payload;

//     let num = n;
//     let num1 = 0, num2 = 1;

//     function add_fibonacci (i) {
//         if (i == 1) {
//             return 0;
//         }
//         else if (i == 2) {
//             return 1;
//         }
//         else {
//             while(i != 2){
//                 total = num1 + num2;
//                 num1 = num2;
//                 num2 = total;
//                 i--;
//             }
//             return total;
//         }
//     }

//     resultFibo = add_fibonacci(num);

//     const response = h.response({
//         status: 'success',
//         result: resultFibo,
//     });
//     response.code(200);
//     return response;
// }

module.exports = {
    // convertBinary,
    // fibonacci,
    insertStudent,
    getStudent,
    loginUser,
    registerUser,
    getUsers
}