import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CareInstructionsGrid from "./CareInstructionsGrid";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface PlantDetails {
  name: string;
  scientificName: string;
  description: string;
  confidence: number;
  imageUrl: string;
}

interface PlantResultsProps {
  imageFile?: File;
  isVisible?: boolean;
}

const PlantResults = ({ imageFile, isVisible = true }: PlantResultsProps) => {
  const [plantDetails, setPlantDetails] = useState<PlantDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!imageFile) {
        console.warn("No image file provided.");
        return;
      }

      console.log("Fetching plant details for:", imageFile.name);
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('http://localhost:5000/identify', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data: PlantDetails = await response.json();
        console.log("Fetched plant details:", data);
        setPlantDetails(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imageFile]);

  if (loading) {
    return <div className="text-center py-4">Loading plant details...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error}. Please check the image file and try again.
      </div>
    );
  }

  if (!plantDetails) {
    return <div className="text-center py-4">No plant details available.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <img
              src={plantDetails.imageUrl}
              alt={plantDetails.name}
              className="w-full h-[300px] object-cover rounded-lg"
              onError={(e) => console.error("Image failed to load:", e)}
            />
            <Badge
              className="absolute top-4 right-4 bg-green-500/90"
              variant="secondary"
            >
              {Math.round(plantDetails.confidence)}% Match
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800">
                {plantDetails.name}
              </h1>
              <p className="text-gray-600 italic">
                {plantDetails.scientificName}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {plantDetails.description}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CareInstructionsGrid />
        </div>
      </Card>
    </motion.div>
  );
};

export default PlantResults;