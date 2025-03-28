import { motion } from 'framer-motion';
import { HistoricalEvent } from '@/types';

interface HistoricalEventsProps {
  events: HistoricalEvent[];
}

export default function HistoricalEvents({ events }: HistoricalEventsProps) {
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <motion.div
          key={event.date}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8 border-l-2 border-white/20"
        >
          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/20" />
          <div className="mb-2">
            <span className="text-sm text-white/60">{event.date}</span>
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/10 text-white/80">
              {event.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-white/80">{event.description}</p>
        </motion.div>
      ))}
    </div>
  );
} 