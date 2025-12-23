// Icon mapping for different tech stacks and topics
// Prefer brand/simple-icons for well-known tech, fallback to Lucide
export const tagIcons: Record<string, string> = {
  // Brand icons
  'rust': 'i-simple-icons-rust',
  'docker': 'i-simple-icons-docker',
  'nodejs': 'i-simple-icons-nodedotjs',
  'typescript': 'i-simple-icons-typescript',
  'javascript': 'i-simple-icons-javascript',
  'python': 'i-simple-icons-python',
  'vue': 'i-simple-icons-vuedotjs',
  'react': 'i-simple-icons-react',
  'nuxt': 'i-simple-icons-nuxtdotjs',
  'tailwind': 'i-simple-icons-tailwindcss',
  'kubernetes': 'i-simple-icons-kubernetes',
  'mysql': 'i-simple-icons-mysql',
  'cpp': 'i-simple-icons-cplusplus',
  'c++': 'i-simple-icons-cplusplus',

  // Generic / fallback icons (Lucide)
  'lua': 'i-lucide-file-code',
  'sql': 'i-lucide-database',
  'game-dev': 'i-lucide-gamepad-2',
  'cli': 'i-lucide-terminal',
  'devtools': 'i-lucide-wrench',
  'tutorial': 'i-lucide-graduation-cap',
  'guide': 'i-lucide-book-open',
  'tips': 'i-lucide-lightbulb',
  'features': 'i-lucide-sparkles',
  'performance': 'i-lucide-zap',
  'security': 'i-lucide-shield',
  'database': 'i-lucide-database',
  'api': 'i-lucide-cloud',
  'web': 'i-lucide-globe',
  'mobile': 'i-lucide-smartphone',
  'backend': 'i-lucide-server',
  'automation': 'i-lucide-workflow',
  'scripting': 'i-lucide-file-code-2',
  'azerothcore': 'i-lucide-gamepad-2',
}

export const useTagIcons = () => {
  const getTagIcon = (tag: string): string => {
    return tagIcons[tag.toLowerCase()] || 'i-lucide-tag'
  }

  return {
    tagIcons,
    getTagIcon,
  }
}
