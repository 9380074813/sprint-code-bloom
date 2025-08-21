import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Shield, Zap, Search, Eye } from 'lucide-react';

interface AuditFormProps {
  onAuditComplete: (results: AuditResults) => void;
}

export interface AuditResults {
  url: string;
  timestamp: string;
  security: {
    score: number;
    vulnerabilities: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      recommendation: string;
    }>;
  };
  performance: {
    score: number;
    loadTime: number;
    issues: Array<{
      type: string;
      description: string;
      recommendation: string;
    }>;
  };
  seo: {
    score: number;
    issues: Array<{
      type: string;
      description: string;
      recommendation: string;
    }>;
  };
  accessibility: {
    score: number;
    issues: Array<{
      type: string;
      description: string;
      recommendation: string;
    }>;
  };
}

export const AuditForm = ({ onAuditComplete }: AuditFormProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const mockAuditResults = (targetUrl: string): AuditResults => ({
    url: targetUrl,
    timestamp: new Date().toISOString(),
    security: {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      vulnerabilities: [
        {
          type: 'Missing HTTPS',
          severity: 'medium' as const,
          description: 'Website is not using HTTPS encryption',
          recommendation: 'Implement SSL certificate and redirect HTTP traffic to HTTPS'
        },
        {
          type: 'Outdated Dependencies',
          severity: 'high' as const,
          description: 'JavaScript libraries contain known vulnerabilities',
          recommendation: 'Update all dependencies to latest secure versions'
        }
      ]
    },
    performance: {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      loadTime: Math.random() * 3 + 1, // 1-4 seconds
      issues: [
        {
          type: 'Large Images',
          description: 'Unoptimized images are slowing down page load',
          recommendation: 'Compress images and use modern formats like WebP'
        },
        {
          type: 'Render Blocking Resources',
          description: 'CSS and JavaScript are blocking page rendering',
          recommendation: 'Defer non-critical resources and inline critical CSS'
        }
      ]
    },
    seo: {
      score: Math.floor(Math.random() * 25) + 75, // 75-100
      issues: [
        {
          type: 'Missing Meta Description',
          description: 'Page lacks meta description tag',
          recommendation: 'Add descriptive meta description under 160 characters'
        },
        {
          type: 'No Structured Data',
          description: 'Missing schema markup for search engines',
          recommendation: 'Implement JSON-LD structured data for better SEO'
        }
      ]
    },
    accessibility: {
      score: Math.floor(Math.random() * 20) + 80, // 80-100
      issues: [
        {
          type: 'Missing Alt Text',
          description: 'Images missing descriptive alt attributes',
          recommendation: 'Add meaningful alt text to all images'
        },
        {
          type: 'Low Color Contrast',
          description: 'Text contrast ratio below WCAG guidelines',
          recommendation: 'Increase contrast between text and background colors'
        }
      ]
    }
  });

  const runAudit = async () => {
    if (!url) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const steps = [
      'Analyzing website structure...',
      'Checking security vulnerabilities...',
      'Testing performance metrics...',
      'Evaluating SEO factors...',
      'Assessing accessibility compliance...',
      'Generating report...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i / (steps.length - 1)) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    }

    const results = mockAuditResults(url);
    setIsLoading(false);
    setCurrentStep('');
    onAuditComplete(results);
    toast.success('Website audit completed successfully!');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-glow">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Website Security & Performance Audit</CardTitle>
        <CardDescription className="text-base">
          Get a comprehensive analysis of your website's security, performance, SEO, and accessibility
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            Website URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
            className="text-base"
          />
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">{currentStep}</span>
            </div>
          </div>
        )}

        <Button
          onClick={runAudit}
          disabled={isLoading || !url}
          className="w-full h-12 text-base font-semibold gradient-primary text-white border-0 shadow-elegant hover:shadow-glow transition-all duration-300"
        >
          {isLoading ? 'Analyzing Website...' : 'Start Security Audit'}
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Security</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm font-medium">Performance</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <span className="text-sm font-medium">SEO</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-warning" />
            </div>
            <span className="text-sm font-medium">Accessibility</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};