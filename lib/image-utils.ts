export function generatePlaceholderImage(width: number, height: number, category = 'education'): string {
  const categoryColors = {
    education: '4F46E5', // Indigo
    admission: '059669', // Green
    scholarship: '7C3AED', // Purple
    technology: 'EA580C', // Orange
    career: 'DC2626', // Red
    exam: 'CA8A04', // Yellow
    default: '6B7280' // Gray
  }

  const color = categoryColors[category as keyof typeof categoryColors] || categoryColors.default
  const textColor = 'FFFFFF'
  
  // Use a more reliable placeholder service with proper encoding
  return `https://via.placeholder.com/${width}x${height}/${color}/${textColor}?text=${encodeURIComponent(category.toUpperCase())}`
}

export function getEducationPlaceholders() {
  return [
    'https://picsum.photos/400/300?random=100', // Books and study
    'https://picsum.photos/400/300?random=101', // University campus
    'https://picsum.photos/400/300?random=102', // Students
    'https://picsum.photos/400/300?random=103', // Graduation
    'https://picsum.photos/400/300?random=104', // Technology
    'https://picsum.photos/400/300?random=105', // Library
  ]
}
