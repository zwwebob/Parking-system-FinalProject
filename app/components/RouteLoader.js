'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const RouteLoader = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const originalPush = router.push;

        router.push = (...args) => {
            setLoading(true);
            return originalPush(...args);
        };

        return () => {
            router.push = originalPush;
        };
    }, [router]);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 1500); // fallback timeout
        return () => clearTimeout(timeout);
    }, [loading]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                >
                    <motion.span
                        className="inline-block animate-pulse"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                        Đang tải...
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RouteLoader;
