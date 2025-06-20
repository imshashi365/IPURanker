import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET() {
  await dbConnect();
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipuraner.com';
    const posts = await Blog.find({ status: 'published', isNews: true })
      .select('slug updatedAt publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>${baseUrl}/blog</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
        ${posts
          .map((post) => `
            <url>
              <loc>${baseUrl}/blog/${post.slug}</loc>
              <lastmod>${new Date(post.updatedAt || post.publishedAt).toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `)
          .join('')}
      </urlset>
    `;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
