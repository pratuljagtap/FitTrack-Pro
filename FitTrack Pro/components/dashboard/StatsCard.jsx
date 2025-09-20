import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, unit, icon: Icon, color, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full transform translate-x-8 -translate-y-8`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
                {unit && <span className="text-sm text-gray-500">{unit}</span>}
              </div>
              {trend && (
                <p className="text-sm text-green-600 mt-2 font-medium">{trend}</p>
              )}
            </div>
            <div className={`p-3 ${color} bg-opacity-10 rounded-xl`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
