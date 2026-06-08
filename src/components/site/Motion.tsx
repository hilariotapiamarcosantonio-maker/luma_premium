'use client';

import { useSyncExternalStore } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// Wrappers reutilizables de animación de entrada.
// Respetan prefers-reduced-motion y evitan hydration mismatch:
// durante SSR / primer render se muestra el contenido estático (sin estilos
// de animación). Tras montar en cliente, framer-motion toma el control.

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Detecta el montaje en cliente sin setState-en-effect (evita hydration
// mismatch de framer-motion). En servidor devuelve false; en cliente, true.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Fade-up suave de un bloque al entrar en viewport.
 */
export function MotionSection({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section';
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const Cmp = as === 'section' ? motion.section : motion.div;
  const Plain = as === 'section' ? 'section' : 'div';

  if (!mounted) {
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Cmp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Cmp>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

/**
 * Contenedor que escalona la aparición de sus MotionItem hijos.
 */
export function MotionStagger({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Item escalonado dentro de un MotionStagger.
 */
export function MotionItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
