const PORT = process.env.NODE_ENV === 'development' ? 8080 : process.env.NODE_ENV === 'production' ? 9092 : 8080
0
const HOST = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : process.env.NODE_ENV === 'production' ? 'http://120.26.146.156' : 'http://127.0.0.1'

const SOCKET_PORT = process.env.NODE_ENV === 'development' ? 9094 : process.env.NODE_ENV === 'production' ? 9094 : 9094

export const port = PORT;

export const host = HOST;

export const socketPort = SOCKET_PORT;