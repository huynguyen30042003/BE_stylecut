const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors'); // Importing cors
const http = require('http');
const setupSocket = require('./config/socket');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const comboRoutes = require('./routes/comboRoutes');
const contactRoutes = require('./routes/contactRoutes');
const locationRoutes = require('./routes/locationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const salonRoutes = require('./routes/salonRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const showTimeRoutes = require('./routes/showTimeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');
const statisticRoutes = require('./routes/statisticRoutes');

dotenv.config();
connectDB();

const app = express();

// const corsOptions = {
//     origin: process.env.CLIENT_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// };

// Đặt giới hạn kích thước yêu cầu là 50MB (đơn vị: bytes)
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors({ origin: true }));
// app.use(cors(corsOptions));

const server = http.createServer(app);
setupSocket(server);

app.use(express.json());

app.use('/api/accounts', accountRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/show-times', showTimeRoutes);
app.use('/api/images', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/statistics', statisticRoutes);
// app.use('/api/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
