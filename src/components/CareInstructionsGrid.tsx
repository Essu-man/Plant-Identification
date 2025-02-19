import React from "react";
import { Card } from "./ui/card";
import { Droplet, Sun, Sprout, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CareInstruction {
  title: string;
  description: string;
  icon: React.ReactNode;
  tooltip: string;
}

interface CareInstructionsGridProps {
  instructions?: CareInstruction[];
}

const defaultInstructions: CareInstruction[] = [
  {
    title: "Watering Needs",
    description:
      "Water every 7-10 days, allowing soil to dry between waterings",
    icon: <Droplet className="h-6 w-6 text-blue-500" />,
    tooltip: "Maintain consistent but not excessive moisture",
  },
  {
    title: "Sunlight Requirements",
    description: "Bright, indirect light. Avoid direct afternoon sun",
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    tooltip: "Place in a well-lit area away from direct sunlight",
  },
  {
    title: "Growth Timeline",
    description: "Moderate growth rate, reaching maturity in 2-3 years",
    icon: <Sprout className="h-6 w-6 text-green-500" />,
    tooltip: "Expected growth pattern and timeline",
  },
  {
    title: "Additional Care",
    description: "Monthly fertilization during growing season",
    icon: <Info className="h-6 w-6 text-purple-500" />,
    tooltip: "Extra care tips for optimal growth",
  },
];

const CareInstructionsGrid = ({
  instructions = defaultInstructions,
}: CareInstructionsGridProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">
        Plant Care Instructions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instructions.map((instruction, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <TooltipTrigger>
                    <div className="p-2 rounded-full bg-gray-50">
                      {instruction.icon}
                    </div>
                  </TooltipTrigger>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-900">
                      {instruction.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {instruction.description}
                    </p>
                  </div>
                </div>
              </Card>
              <TooltipContent>
                <p>{instruction.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default CareInstructionsGrid;
