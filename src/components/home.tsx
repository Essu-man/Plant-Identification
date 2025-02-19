import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import LoadingAnimation from "./LoadingAnimation";
import PlantResults from "./PlantResults";

interface HomeProps {
  initialStep?: "upload" | "loading" | "results";
}

const Home = ({ initialStep = "upload" }: HomeProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setCurrentStep("loading");
    // Simulate API call
    setTimeout(() => {
      setCurrentStep("results");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Plant Identification Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Upload a photo of your plant to get detailed care instructions
          </p>
        </header>

        <div className="flex justify-center">
          {currentStep === "upload" && (
            <div className="w-full max-w-xl">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          )}

          {currentStep === "loading" && (
            <div className="w-full max-w-xl">
              <LoadingAnimation />
            </div>
          )}

          {currentStep === "results" && (
            <div className="w-full">
              <PlantResults />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep("upload")}
                  className="text-green-600 hover:text-green-700 underline"
                >
                  Identify Another Plant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
