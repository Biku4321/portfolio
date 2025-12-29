import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Download, Mail, Phone, MapPin, Calendar, Users, Trophy, Code } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const Hero = () => {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axiosInstance.get('/about');
        setAboutData(response.data);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) return <div>Loading…</div>;
  if (!aboutData) return null;

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold">{aboutData?.name || 'Your Name'}</h1>
      <p className="mt-2 text-gray-600">{aboutData?.objective}</p>
    </section>
  );
};

export default Hero;
