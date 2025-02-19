import axios from 'axios';

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
  score?: number;
}

interface PlantResponse {
  results?: PlantResult[];
}

const PLANTNET_API_URL = 'https://my-api.plantnet.org/';
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
  formData.append('flower', 'leaf');

  try {
    const response = await axios.post<PlantResponse>(PLANTNET_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${API_KEY}`,
      },
      params: {
        lang: 'en',
        includeRelatedImages: true,
      },
    });

    const plantDetails = response.data.results?.[0];
    if (!plantDetails?.species) {
      throw new Error('No plant identified or invalid response from API.');
    }

    return {
      name: plantDetails.species.commonNames?.[0] || 'Unknown',
      scientificName: plantDetails.species.scientificNameWithoutAuthor || 'Unknown',
      description: plantDetails.species.description || 'No description available',
      confidence: (plantDetails.score || 0) * 100,
      imageUrl: plantDetails.images?.[0]?.url?.o || '',
    };
  } catch (error) {
    console.error('Error fetching plant details:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('An unexpected error occurred while identifying the plant.');
  }
};