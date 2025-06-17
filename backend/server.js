const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware CORS để cho phép yêu cầu từ http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware để parse JSON body
app.use(express.json({ limit: '10mb' }));

// Middleware để phục vụ file tĩnh từ thư mục public
app.use('/public', express.static('public'));

// API để chụp ảnh dashboard từ URL
app.post('/api/capture-dashboard', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Khởi chạy Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Đặt kích thước viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Mở URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Chụp ảnh màn hình
    const screenshot = await page.screenshot({ type: 'png', fullPage: false });

    // Đóng browser
    await browser.close();

    // Chuyển ảnh thành base64
    const imageBase64 = screenshot.toString('base64');

    // Trả về ảnh base64
    res.json({ imageBase64 });
  } catch (error) {
    console.error('Error capturing dashboard:', error);
    res.status(500).json({ error: 'Failed to capture dashboard' });
  }
});

// Endpoint để nhận HTML và tạo PDF
app.post('/api/save-report', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  try {
    // Khởi chạy Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Đặt nội dung HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Tạo PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    // Đóng browser
    await browser.close();

    // Gửi PDF về client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});