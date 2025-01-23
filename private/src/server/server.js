import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add JWT secret to environment
process.env.JWT_SECRET = process.env.JWT_SECRET || 'hotelonline-secret-key';

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://37.27.142.148:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.text()); // Add text parser middleware globally

// Debug middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// API Routes FIRST - before any static file handling
app.use('/auth', authRoutes);

// Email settings endpoints
app.get('/veraclub/emails', authenticateToken, async (req, res) => {
  const filePath = join(__dirname, 'data', 'settings.txt');
  try {
    let data = '';
    try {
      data = await fs.readFile(filePath, 'utf8');
      // Convert text file content to array of emails
      const emails = data.split('\n').filter(email => email.trim());
      res.json(emails);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Create directory if it doesn't exist
        await fs.mkdir(join(__dirname, 'data'), { recursive: true });
        await fs.writeFile(filePath, '');
        res.json([]);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ message: 'Error reading settings file' });
  }
});

app.post('/veraclub/emails', authenticateToken, async (req, res) => {
  const filePath = join(__dirname, 'data', 'settings.txt');
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let emails = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      emails = data.split('\n').filter(e => e.trim());
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    if (!emails.includes(email)) {
      emails.push(email);
      await fs.mkdir(join(__dirname, 'data'), { recursive: true });
      await fs.writeFile(filePath, emails.join('\n'));
    }

    res.json({ message: 'Email added successfully' });
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({ message: 'Error saving email' });
  }
});

app.delete('/veraclub/emails/:email', authenticateToken, async (req, res) => {
  const filePath = join(__dirname, 'data', 'settings.txt');
  try {
    const emailToDelete = decodeURIComponent(req.params.email);
    let data = await fs.readFile(filePath, 'utf8');
    const emails = data.split('\n').filter(email => email.trim() && email !== emailToDelete);
    await fs.writeFile(filePath, emails.join('\n'));
    res.json({ message: 'Email removed successfully' });
  } catch (error) {
    console.error('Error removing email:', error);
    res.status(500).json({ message: 'Error removing email' });
  }
});

// Other API routes
app.post('/ezee/bookings', authenticateToken, async (req, res) => {
  try {
    const { hotelId, authKey, bookingId, roomNo, guest, identityNo, guestEmail, guestMobileNo, guestRegistrationNo } = req.body;

    if (!hotelId || !authKey || !bookingId) {
      return res.status(400).json({ 
        message: 'Hotel ID, Auth Key and Booking ID are required' 
      });
    }

    console.log('Forwarding booking request to internal API');
    console.log('Using Authorization header:', req.headers.authorization);

    const response = await axios.post(`${process.env.API_BASE_URL}/ezee/bookings`, {
      hotelId,
      authKey,
      bookingId,
      roomNo,
      guest,
      identityNo,
      guestEmail,
      guestMobileNo,
      guestRegistrationNo
    }, {
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    console.log('Internal API response:', response.data);
    res.json(response.data);

  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { 
      message: error.message || 'Failed to fetch booking data'
    });
  }
});

app.post('/email/send', authenticateToken, async (req, res) => {
  console.log('Received email request');
  const { to, subject, text, html, attachments } = req.body;
  
  console.log('Email request validation:', {
    hasTo: !!to,
    hasSubject: !!subject,
    hasText: !!text,
    hasHtml: !!html,
    hasAttachments: !!attachments,
    attachmentCount: attachments?.length,
    toEmail: to,
    subject: subject
  });
  
  if (!to || !subject || (!text && !html)) {
    console.log('Missing required fields:', { to, subject, text: !!text, html: !!html });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Email request details:', {
      to,
      subject,
      hasText: !!text,
      hasHtml: !!html,
      hasAttachments: !!attachments,
      attachmentsCount: attachments?.length
    });

    const token = req.headers.authorization;
    console.log('Forwarding email request to internal API:', process.env.API_BASE_URL);
    console.log('Email request payload:', {
      to,
      subject,
      text,
      attachmentsSize: attachments?.[0]?.content?.length
    });
    
    const response = await axios.post(`${process.env.API_BASE_URL}/email/send`, {
      to,
      subject,
      text,
      html,
      attachments
    }, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    console.log('Email API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Email API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message || 'Failed to send email'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files LAST - after all API routes
app.use(express.static(join(__dirname, '../../dist')));

// Catch-all route for SPA - this should be the very last route
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API URL: ${process.env.API_BASE_URL}`);
  console.log(`CORS Origin: ${corsOptions.origin}`);
}); 