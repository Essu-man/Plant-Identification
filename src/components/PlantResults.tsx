import { motion } from "framer-motion";
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
  plantDetails?: PlantDetails;
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

const PlantResults = ({
  plantDetails = defaultPlantDetails,
  isVisible = true,
}: PlantResultsProps) => {
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
            />
            <Badge
              className="absolute top-4 right-4 bg-green-500/90"
              variant="secondary"
            >
              {plantDetails.confidence}% Match
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
