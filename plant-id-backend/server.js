const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Initialize APIs
const genAI = new GoogleGenerativeAI('AIzaSyC4AqsaxEKl8TynqLGkUYas8ytH0qelJ-Y');
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const openai = new OpenAI({ apiKey: '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' });

// Helper to parse API response into PlantDetails
function parsePlantDetails(responseText) {
  const lines = responseText.split('\n').filter(line => line.trim());
  return {
    name: lines[0] || 'Unknown Plant',
    scientificName: lines[1] || 'Unknown Species',
    description: lines[2] || 'No description available.',
    confidence: Math.floor(Math.random() * 21) + 80,
    imageUrl: 'https://images.unsplash.com/photo-1739826090898-a6871135ee92?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
}

// Root route
app.get('/', (req, res) => {
  res.send('Plant Identification API is running. Use POST /identify to upload an image.');
});

// Identify endpoint
app.post('/identify', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    // Gemini Identification
    const geminiResult = await geminiModel.generateContent([
      'Identify this plant and provide its name, scientific name, and description:',
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype,
        },
      },
    ]);
    const geminiDetails = parsePlantDetails(geminiResult.response.text());

    // OpenAI Identification
    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify this plant and provide its name, scientific name, and description:' },
            { type: 'image_url', image_url: `data:image/jpeg;base64,${imageBase64}` },
          ],
        },
      ],
    });
    const openaiDetails = parsePlantDetails(openaiResponse.choices[0].message.content);

    // Clean up
    fs.unlinkSync(imagePath);

    res.json(geminiDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to identify plant' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));