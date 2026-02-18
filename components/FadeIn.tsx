'use client'

import { motion } from 'framer-motion'

export default function FadeIn({
    children,
    delay = 0,
    className = '',
    direction = 'up',
}: {
    children: React.ReactNode
    delay?: number
    className?: string
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.25, 0, 1] as any,
                delay: delay,
            },
        },
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    )
}
