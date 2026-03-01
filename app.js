const express = require('express');
const path = require('path');
const fs = require('fs');
const multiparty = require('multiparty');
const handlebars = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');

app.engine(
  'hbs',
  handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
  })
);

app.disable('x-powered-by');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`✓ Created uploads directory at ${uploadsDir}`);
}

// Store data in a JSON file
function writeData(newData) {
  let data = [];

  if (fs.existsSync(dataFile)) {
    try {
      const file = fs.readFileSync(dataFile, 'utf8');
      data = JSON.parse(file);
    } catch (error) {
      console.error('Error reading existing data:', error);
      data = [];
    }
  }
  data.push(newData);

  // Write the updated data back to the file
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 4));
}

// Home Page
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home Page' });
});

// Register Page
app.get('/register', (req, res) => {
  res.render('register', { titlePage: 'Register Page' });
});

// Register Handler
app.post('/register', (req, res) => {
  try {
    const form = new multiparty.Form();

    let uploadFilePath = null;

    form.parse(req, (error, fields, files) => {
      if (error) {
        console.error('Form parsing error:', err);
        return res.status(400).render('404', {
          type: 'error',
          pageTitle: 'Error Message',
          message: 'Error parsing the form. Please try again.',
        });
      }

      const name = fields.name ? fields.name[0] : '';
      const email = fields.email ? fields.email[0] : '';
      const course = fields.course ? fields.course[0] : '';

      const uploadedFile = files.image ? files.image : null;

      if (!uploadedFile || uploadedFile.length === 0) {
        console.warn('⚠️ No file was selected for upload');
        return res.status(400).render('404', {
          type: 'error',
          pageTitle: 'Error Message',
          message: 'No file was selected. Please choose an image file.',
        });
      }

      const file = uploadedFile[0];
      const originalFileName = file.originalFilename;
      const tempFilePath = file.path;

      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = path.extname(originalFileName).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        console.warn(`⚠️ Invalid file type: ${fileExtension}`);
        fs.unlinkSync(tempFilePath);
        return res.status(400).render('404', {
          type: 'error',
          pageTitle: 'Error Message',
          message: `Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`,
        });
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${originalFileName}`;
      const finalFilePath = path.join(uploadsDir, fileName);

      try {
        fs.copyFileSync(tempFilePath, finalFilePath);
        fs.unlinkSync(tempFilePath);

        uploadFilePath = `/uploads/${fileName}`;

        const data = {
          name,
          email,
          course,
          imagePath: uploadFilePath,
          originalFileName,
        };

        writeData(data);

        res.render('profile', {
          type: 'file',
          pageTitle: 'Profile Page',
          ...data,
          message: 'Your file was uploaded successfully!',
        });
      } catch (fsError) {
        console.error('❌ File system error:', fsError);
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        res.status(500).render('404', {
          type: 'error',
          pageTitle: 'Error Message',
          message: 'Error saving the file. Please try again.',
        });
      }
    });
  } catch (error) {
    console.error('❌ Error in /register:', error);
    res.status(500).render('404', {
      type: 'error',
      pageTitle: 'Error Message',
      message: 'An error occurred while processing your file upload.',
    });
  }
});

// Not Found Page (Error Page Temporary?)
app.use((req, res) => {
  res.status(404).render('404', {
    type: 'error',
    pageTitle: 'Error Message',
    message: '404 - Page not found. Return to home and try again.',
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
