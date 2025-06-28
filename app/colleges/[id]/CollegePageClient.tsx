'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Globe, GraduationCap, Briefcase, Phone, Mail, ExternalLink } from 'lucide-react';

interface CollegePageClientProps {
  college: {
    _id: string;
    name: string;
    location: string;
    logoUrl: string;
    description: string;
    website: string;
    bannerImage?: string;
    email?: string;
    phone?: string;
    address?: string;
    establishedYear?: string;
    topRecruiters?: string[];
    courses?: string[];
    placementStats?: {
      placementRate?: string;
      topCTC?: number;
      avgCTC?: number;
    };
  };
}

export default function CollegePageClient({ college }: CollegePageClientProps) {
  const stats = [
    { label: 'Placement Rate', value: college.placementStats?.placementRate || 'N/A' },
    { label: 'Highest Package', value: college.placementStats?.topCTC ? `₹${college.placementStats.topCTC} LPA` : 'N/A' },
    { label: 'Average Package', value: college.placementStats?.avgCTC ? `₹${college.placementStats.avgCTC} LPA` : 'N/A' },
    { label: 'Established', value: college.establishedYear || 'N/A' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/colleges" className="inline-flex items-center text-sm text-blue-600 hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Colleges
        </Link>
      </div>

      {/* College Header */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-50 to-indigo-50">
          {college.bannerImage && (
            <Image
              src={college.bannerImage}
              alt={college.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{college.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{college.location}</span>
              </div>
            </div>
            <div className="hidden md:block bg-white rounded-lg p-3 shadow-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {college.placementStats?.placementRate || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Placement Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="md:w-1/4">
              <div className="relative h-40 w-40 md:h-48 md:w-48 mx-auto md:mx-0 -mt-20 border-4 border-white rounded-2xl shadow-lg overflow-hidden bg-white">
                <Image
                  src={college.logoUrl || '/placeholder-college.png'}
                  alt={`${college.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="mt-4 flex justify-center md:justify-start space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/compare?colleges=${college._id}`}>
                    Compare
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={college.website || '#'} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </Link>
                </Button>
              </div>
            </div>

            <div className="md:flex-1 mt-4 md:mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500">{stat.label}</div>
                    <div className="text-lg font-semibold mt-1">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  About the College
                </h3>
                <p className="text-gray-700">
                  {college.description || 'No description available.'}
                </p>
              </div>

              {college.courses && college.courses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Courses Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.courses.map((course, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                    Placement Highlights
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest Package</span>
                      <span className="font-medium">
                        {college.placementStats?.topCTC ? `₹${college.placementStats.topCTC} LPA` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Package</span>
                      <span className="font-medium">
                        {college.placementStats?.avgCTC ? `₹${college.placementStats.avgCTC} LPA` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Recruiters</span>
                      <span className="font-medium">
                        {college.topRecruiters?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {college.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <a 
                          href={college.website.startsWith('http') ? college.website : `https://${college.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {college.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {college.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`mailto:${college.email}`} className="text-gray-700 hover:text-blue-600">
                          {college.email}
                        </a>
                      </div>
                    )}
                    {college.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`tel:${college.phone.replace(/\D/g, '')}`} className="text-gray-700 hover:text-blue-600">
                          {college.phone}
                        </a>
                      </div>
                    )}
                    {college.address && (
                      <div className="flex">
                        <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-gray-500" />
                        <span className="text-gray-700">{college.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Facilities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Campus Facilities</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Library', 'Laboratories', 'Hostel', 'Cafeteria',
              'Sports Complex', 'Auditorium', 'Medical Facilities', 'WiFi Campus'
            ].map((facility) => (
              <div key={facility} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-700">{facility}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
          <div className="space-y-3">
            {[
              { label: 'Campus Size', value: '25 Acres' },
              { label: 'Total Students', value: '5000+' },
              { label: 'Faculty Members', value: '300+' },
              { label: 'Student Clubs', value: '20+' },
              { label: 'Research Papers', value: '1000+' },
              { label: 'Alumni Network', value: '25,000+' },
            ].map((fact, index) => (
              <div key={index} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">{fact.label}</span>
                <span className="font-medium">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Interested in this college?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get more information about admission process, fees, and scholarship opportunities.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Contact Admission Office
          </Button>
          <Button variant="outline" size="lg">
            Download Brochure
          </Button>
        </div>
      </div>
    </div>
  );
}
