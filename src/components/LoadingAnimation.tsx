import { motion, Variants } from "framer-motion";

interface LoadingAnimationProps {
  isLoading?: boolean;
}

const LoadingAnimation = ({ isLoading = true }: LoadingAnimationProps) => {
  const leafVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  const leafVariantsDelayed: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: 0.01,
      },
    },
  };

  const stemVariants: Variants = {
    hidden: { height: 0 },
    visible: {
      height: 100,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] bg-white p-8">
      <div className="relative w-[100px] h-[200px]">
        {/* Stem */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-2 bg-green-500 origin-bottom"
          initial="hidden"
          animate="visible"
          variants={stemVariants}
          style={{ transformOrigin: "bottom center" }}
        />

        {/* Leaves */}
        <motion.div
          className="absolute bottom-[100px] left-1/2 -translate-x-1/2"
          initial="hidden"
          animate="visible"
          variants={leafVariants}
        >
          <div className="relative">
            <div className="absolute w-8 h-8 bg-green-400 rounded-full -left-8 transform -rotate-45" />
            <div className="absolute w-8 h-8 bg-green-400 rounded-full left-0 transform rotate-45" />
          </div>
        </motion.div>

        {/* Additional leaves */}
        <motion.div
          className="absolute bottom-[150px] left-1/2 -translate-x-1/2"
          initial="hidden"
          animate="visible"
          variants={leafVariantsDelayed}
        >
          <div className="relative">
            <div className="absolute w-6 h-6 bg-green-300 rounded-full -left-6 transform -rotate-45" />
            <div className="absolute w-6 h-6 bg-green-300 rounded-full left-0 transform rotate-45" />
          </div>
        </motion.div>
      </div>
      <p className="mt-4 text-green-600 font-medium text-center">
        Identifying your plant...
      </p>
    </div>
  );
};

export default LoadingAnimation;