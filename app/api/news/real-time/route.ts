import { NextRequest, NextResponse } from 'next/server';

// Types for NewsAPI response
interface NewsAPIArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'education';
    const limit = parseInt(searchParams.get('limit') || '12');

    // Using NewsAPI for real-time news
    // You can get a free API key from https://newsapi.org/
    const API_KEY = process.env.NEWS_API_KEY || ''; // Add your NewsAPI key to .env.local
    
    if (!API_KEY) {
      // Fallback to mock data if no API key
      return NextResponse.json({
        success: true,
        articles: getMockEducationNews()
      });
    }

    // Education and student-related keywords
    const educationQueries = {
      education: 'education OR university OR college OR student OR academic',
      admission: 'college admission OR university admission OR entrance exam',
      scholarship: 'scholarship OR financial aid OR student grants',
      technology: 'technology education OR coding OR programming OR STEM',
      career: 'career guidance OR job placement OR internship',
      all: 'education OR university OR college OR student OR scholarship OR career'
    };

    const query = educationQueries[category as keyof typeof educationQueries] || educationQueries.education;

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${API_KEY}`,
      {
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data: NewsAPIResponse = await response.json();
    
    // Filter and enhance articles
    const enhancedArticles = data.articles
      .filter(article => 
        article.title && 
        article.description && 
        article.urlToImage &&
        !article.title.toLowerCase().includes('[removed]')
      )
      .map(article => ({
        id: Math.random().toString(36).substr(2, 9),
        title: article.title,
        description: article.description,
        excerpt: article.description?.substring(0, 150) + '...',
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        author: article.author,
        category: getCategoryFromTitle(article.title)
      }));

    return NextResponse.json({
      success: true,
      articles: enhancedArticles
    });

  } catch (error) {
    console.error('Error fetching real-time news:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      articles: getMockEducationNews()
    });
  }
}

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('admission') || lowerTitle.includes('entrance')) return 'admission';
  if (lowerTitle.includes('scholarship') || lowerTitle.includes('grant')) return 'scholarship';
  if (lowerTitle.includes('technology') || lowerTitle.includes('coding')) return 'technology';
  if (lowerTitle.includes('career') || lowerTitle.includes('job')) return 'career';
  if (lowerTitle.includes('exam') || lowerTitle.includes('test')) return 'exam';
  
  return 'education';
}

function getMockEducationNews() {
  return [
    {
      id: '1',
      title: 'New Education Policy 2024: Major Changes in Higher Education',
      description: 'The latest education policy brings significant reforms to the higher education sector, focusing on flexibility and skill development.',
      excerpt: 'The latest education policy brings significant reforms to the higher education sector, focusing on flexibility and skill development...',
      url: '#',
      imageUrl: 'https://picsum.photos/500/300?random=1',
      publishedAt: new Date().toISOString(),
      source: 'Education Times',
      author: 'Education Desk',
      category: 'education'
    },
    {
      id: '2',
      title: 'Engineering Admission 2024: New Counseling Process Announced',
      description: 'Engineering colleges introduce a streamlined counseling process for better seat allocation and transparency.',
      excerpt: 'Engineering colleges introduce a streamlined counseling process for better seat allocation and transparency...',
      url: '#',
      imageUrl: 'https://picsum.photos/500/300?random=2',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: 'Engineering Today',
      author: 'Admission Desk',
      category: 'admission'
    },
    {
      id: '3',
      title: 'Scholarship Alert: ₹50 Crore Fund for Meritorious Students',
      description: 'Government announces a massive scholarship program to support talented students from economically weaker sections.',
      excerpt: 'Government announces a massive scholarship program to support talented students from economically weaker sections...',
      url: '#',
      imageUrl: 'https://picsum.photos/500/300?random=3',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: 'Scholarship Portal',
      author: 'Policy Desk',
      category: 'scholarship'
    },
    {
      id: '4',
      title: 'Tech Giants Launch Campus Recruitment Drive 2024',
      description: 'Major technology companies announce early campus placements with attractive packages for fresh graduates.',
      excerpt: 'Major technology companies announce early campus placements with attractive packages for fresh graduates...',
      url: '#',
      imageUrl: 'https://picsum.photos/500/300?random=4',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: 'Career Hub',
      author: 'Placement Desk',
      category: 'career'
    },
    {
      id: '5',
      title: 'GGSIPU Announces New Academic Session Guidelines',
      description: 'Updated guidelines for the upcoming academic session include revised examination patterns and assessment methods.',
      excerpt: 'Updated guidelines for the upcoming academic session include revised examination patterns and assessment methods...',
      url: '#',
      imageUrl: 'https://picsum.photos/500/300?random=5',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: 'IPU Official',
      author: 'Academic Office',
      category: 'education'
    },
    {
      id: '6',
      title: 'Industry 4.0 Skills Training Program Launched',
      description: 'New skill development program focuses on emerging technologies and industry-ready competencies for students.',
      excerpt: 'New skill development program focuses on emerging technologies and industry-ready competencies for students...',
      url: '#',
      imageUrl: 'https://picsum.photos/500/300?random=6',
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      source: 'Skill Development',
      author: 'Training Desk',
      category: 'technology'
    }
  ];
}
