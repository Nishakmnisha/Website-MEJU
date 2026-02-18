import { motion } from 'framer-motion'

export function Hero3D() {
  return (
    <div className="hero3d-wrap">
      <div className="orb" />
      <div className="ring ring-a" />
      <div className="ring ring-b" />
      <motion.div className="cube" animate={{ rotateY: 360, rotateX: -18 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
        <div className="face front">AI</div>
        <div className="face back">CMS</div>
        <div className="face right">PLG</div>
        <div className="face left">SEO</div>
        <div className="face top">API</div>
        <div className="face bottom">OPS</div>
      </motion.div>
    </div>
  )
}
