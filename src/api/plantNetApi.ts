import axios, { AxiosError } from 'axios';

interface PlantSpecies {
  scientificNameWithoutAuthor?: string;
  commonNames?: string[];
  description?: string;
  score?: number;
}

interface PlantImage {
  url?: {
    o?: string;
  };
}

interface PlantResult {
  species?: PlantSpecies;
  images?: PlantImage[];
  score?: number; // Ensure this matches the API response
}

interface PlantResponse {
  results?: PlantResult[];
}

const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';
const API_KEY = '2b10aIN5KjDk02UnYnjeMY3vO';

export const fetchPlantDetails = async (imageFile: File): Promise<{
  name: string;
  scientificName: string;
  description: string;
  confidence: number;
  imageUrl: string;
}> => {
  if (!API_KEY) {
    throw new Error('API key is missing. Please configure your API key.');
  }

  const formData = new FormData();
  formData.append('images', imageFile);
  formData.append('organs', 'leaf');

  try {
    console.log('Sending request to:', PLANTNET_API_URL); // Debug log

    const response = await axios.post<PlantResponse>(PLANTNET_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Api-Key': API_KEY,
      },
      params: {
        lang: 'en',
        includeRelatedImages: true,
      },
    });

    console.log('API Response:', response.data);

    const plantDetails = response.data.results?.[0];
    if (!plantDetails?.species) {
      throw new Error('No plant identified or invalid response from API.');
    }

    return {
      name: plantDetails.species.commonNames?.[0] || 'Unknown Plant',
      scientificName: plantDetails.species.scientificNameWithoutAuthor || 'Unknown',
      description: plantDetails.species.description || 'No description available',
      confidence: (plantDetails.score || 0) * 100, // Ensure 'score' exists in response
      imageUrl: plantDetails.images?.[0]?.url?.o || '',
    };
  } catch (error) {
    console.error('Error fetching plant details:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Unauthorized: Please check your API key or header format.');
      } else if (axiosError.response?.status === 404) {
        throw new Error('API endpoint not found. Check the URL: ' + PLANTNET_API_URL);
      } else if (axiosError.response?.status === 400) {
        throw new Error('Bad request: Check image file and parameters.');
      } else {
        throw new Error(`API Error: ${axiosError.response?.data?.message || axiosError.message}`);
      }
    }
    throw new Error('An unexpected error occurred while identifying the plant.');
  }
};