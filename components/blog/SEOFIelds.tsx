import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMemo } from 'react';

interface SEOFieldsProps {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  onFieldChange: (field: string, value: string) => void;
  className?: string;
}

export const SEOFields = ({
  metaTitle,
  metaDescription,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  onFieldChange,
  className = '',
}: SEOFieldsProps) => {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onFieldChange(field, e.target.value);
  };

  const previewTitle = useMemo(() => 
    metaTitle || 'Your page title will appear here',
    [metaTitle]
  );

  const previewDescription = useMemo(() => 
    metaDescription || 'Your page description will appear here. This is what will show up in search results.',
    [metaDescription]
  );

  const previewUrl = useMemo(() => 
    canonicalUrl || 'yourwebsite.com/your-page-url',
    [canonicalUrl]
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            SEO Settings
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>These settings help search engines understand your content and display it in search results.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <span className="text-xs text-muted-foreground">
                {metaTitle.length}/60
              </span>
            </div>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={handleChange('metaTitle')}
              placeholder="Enter meta title (recommended: 50-60 characters)"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              This is the title that will appear in search engine results.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <span className="text-xs text-muted-foreground">
                {metaDescription.length}/160
              </span>
            </div>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={handleChange('metaDescription')}
              rows={3}
              placeholder="Enter meta description (recommended: 150-160 characters)"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              This is the description that will appear in search engine results.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              value={canonicalUrl}
              onChange={handleChange('canonicalUrl')}
              placeholder="https://yourwebsite.com/your-page"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              The preferred URL where this content can be found. Leave blank to use the current URL.
            </p>
          </div>

          <div className="border-t pt-6 space-y-6">
            <h3 className="font-medium">Social Sharing</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Open Graph (Facebook, LinkedIn, etc.)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>These settings control how your content appears when shared on social media platforms.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  <Input
                    value={ogTitle}
                    onChange={handleChange('ogTitle')}
                    placeholder="Open Graph title (defaults to meta title if empty)"
                  />
                  <Textarea
                    value={ogDescription}
                    onChange={handleChange('ogDescription')}
                    placeholder="Open Graph description (defaults to meta description if empty)"
                    rows={2}
                  />
                  <Input
                    value={ogImage}
                    onChange={handleChange('ogImage')}
                    placeholder="Open Graph image URL (recommended: 1200x630px)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Twitter Card</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>These settings control how your content appears when shared on Twitter.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  <Input
                    value={twitterTitle}
                    onChange={handleChange('twitterTitle')}
                    placeholder="Twitter title (defaults to Open Graph title if empty)"
                  />
                  <Textarea
                    value={twitterDescription}
                    onChange={handleChange('twitterDescription')}
                    placeholder="Twitter description (defaults to Open Graph description if empty)"
                    rows={2}
                  />
                  <Input
                    value={twitterImage}
                    onChange={handleChange('twitterImage')}
                    placeholder="Twitter image URL (recommended: 1200x600px, 2:1 aspect ratio)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Search Result Preview</h3>
            <div className="border rounded-md p-4 bg-muted/20">
              <div className="max-w-2xl">
                <h4 className="text-blue-700 dark:text-blue-500 text-lg font-medium line-clamp-1">
                  {previewTitle}
                </h4>
                <div className="text-green-700 dark:text-green-500 text-sm mb-1">
                  {previewUrl}
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {previewDescription}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                This is an approximate preview of how your page might appear in search results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOFields;
