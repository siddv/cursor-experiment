import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface YearSelectorProps {
  onYearSelect: (year: number) => void;
  currentYear: number;
}

export default function YearSelector({ onYearSelect, currentYear }: YearSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const startYear = 1920;
  const endYear = new Date().getFullYear();
  
  // Generate decades starting from most recent
  const decades = Array.from(
    { length: Math.floor((endYear - startYear) / 10) + 1 },
    (_, i) => Math.floor(endYear / 10) * 10 - i * 10
  );

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl text-white font-bold text-2xl shadow-lg flex items-center gap-2 hover:bg-white/15 transition-colors"
      >
        {currentYear}
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUpIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-64 bg-white/10 backdrop-blur-md rounded-xl shadow-xl z-50 max-h-[60vh] overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              {decades.map((decade) => (
                <div key={decade} className="space-y-2">
                  <h3 className="text-white/60 text-sm font-semibold px-2">{decade}s</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 10 }, (_, i) => decade + 9 - i)
                      .filter(year => year <= endYear && year >= startYear)
                      .map((year) => (
                        <motion.button
                          key={year}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            onYearSelect(year);
                            setIsOpen(false);
                          }}
                          className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                            year === currentYear
                              ? 'bg-white/20 shadow-lg'
                              : 'hover:bg-white/10'
                          }`}
                        >
                          {year}
                        </motion.button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 