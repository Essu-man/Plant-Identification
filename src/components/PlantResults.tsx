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

const defaultPlantDetails: PlantDetails = {
  name: "Monstera Deliciosa",
  scientificName: "Monstera deliciosa",
  description:
    "The Swiss Cheese Plant is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has large, glossy, perforated leaves that develop unique holes as they mature.",
  confidence: 95,
  imageUrl:
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3",
};

const PlantResults = ({ imageFile, isVisible = true }: PlantResultsProps) => {
  const [plantDetails, setPlantDetails] = useState<PlantDetails>(defaultPlantDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check if imageFile exists
      if (!imageFile) {
        console.warn("No image file provided, using default details.");
        return;
      }

      console.log("Attempting to fetch plant details for image:", imageFile.name);

      setLoading(true);
      setError(null);

      try {
        // Simulate fetching plant details
        const details = defaultPlantDetails;
        console.log("Successfully fetched plant details:", details);
        setPlantDetails(details);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Failed to fetch plant details:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log("Fetch operation completed. Loading:", loading, "Error:", error);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      console.log("Cleaning up useEffect for imageFile:", imageFile?.name);
    };
  }, [imageFile]); // Dependency array

  // Log the current state for debugging
  console.log("Current plantDetails:", plantDetails);
  console.log("Current loading state:", loading);
  console.log("Current error state:", error);

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