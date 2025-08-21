import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Shield, 
  Zap, 
  Search, 
  Eye, 
  Globe, 
  Monitor, 
  Smartphone, 
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AuditResults } from '../AuditForm';

interface EnhancedAuditFormProps {
  onAuditComplete: (results: AuditResults) => void;
}

interface AuditConfig {
  url: string;
  auditTypes: {
    security: boolean;
    performance: boolean;
    seo: boolean;
    accessibility: boolean;
  };
  device: 'desktop' | 'mobile' | 'tablet';
  location: string;
  depth: 'shallow' | 'medium' | 'deep';
  customHeaders: string;
  ignoreCertificateErrors: boolean;
  followRedirects: boolean;
}

const AUDIT_STEPS = [
  { id: 'init', name: 'Initializing scan...', icon: Settings },
  { id: 'crawl', name: 'Crawling website structure...', icon: Globe },
  { id: 'security', name: 'Analyzing security vulnerabilities...', icon: Shield },
  { id: 'performance', name: 'Testing performance metrics...', icon: Zap },
  { id: 'seo', name: 'Evaluating SEO factors...', icon: Search },
  { id: 'accessibility', name: 'Checking accessibility compliance...', icon: Eye },
  { id: 'compile', name: 'Compiling comprehensive report...', icon: CheckCircle }
];

export const EnhancedAuditForm = ({ onAuditComplete }: EnhancedAuditFormProps) => {
  const [config, setConfig] = useState<AuditConfig>({
    url: '',
    auditTypes: {
      security: true,
      performance: true,
      seo: true,
      accessibility: true
    },
    device: 'desktop',
    location: 'us-east',
    depth: 'medium',
    customHeaders: '',
    ignoreCertificateErrors: false,
    followRedirects: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const generateAdvancedResults = (targetUrl: string): AuditResults => {
    const baseScore = Math.floor(Math.random() * 20) + 70;
    
    return {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      security: {
        score: baseScore + Math.floor(Math.random() * 10),
        vulnerabilities: [
          {
            type: 'Missing Content Security Policy',
            severity: 'high' as const,
            description: 'No CSP header found, making the site vulnerable to XSS attacks',
            recommendation: 'Implement a comprehensive Content Security Policy header to prevent XSS attacks'
          },
          {
            type: 'Weak SSL Configuration',
            severity: 'medium' as const,
            description: 'SSL certificate uses weak cipher suites',
            recommendation: 'Update SSL configuration to use only strong cipher suites and disable weak protocols'
          },
          {
            type: 'Missing Security Headers',
            severity: 'medium' as const,
            description: 'Several security headers are missing (X-Frame-Options, X-Content-Type-Options)',
            recommendation: 'Add comprehensive security headers to protect against common attacks'
          },
          {
            type: 'Exposed Server Information',
            severity: 'low' as const,
            description: 'Server banner reveals version information',
            recommendation: 'Configure server to hide version information in HTTP headers'
          }
        ]
      },
      performance: {
        score: baseScore + Math.floor(Math.random() * 15),
        loadTime: Math.random() * 2 + 1.2,
        issues: [
          {
            type: 'Large Bundle Size',
            description: 'JavaScript bundle size exceeds recommended limits',
            recommendation: 'Implement code splitting and tree shaking to reduce bundle size'
          },
          {
            type: 'Unoptimized Images',
            description: 'Images are not using modern formats or proper compression',
            recommendation: 'Convert images to WebP format and implement responsive image loading'
          },
          {
            type: 'Missing Resource Hints',
            description: 'Critical resources lack preload hints',
            recommendation: 'Add preload hints for critical fonts, CSS, and JavaScript files'
          },
          {
            type: 'Inefficient Caching',
            description: 'Static resources have suboptimal cache headers',
            recommendation: 'Implement long-term caching for static assets with proper versioning'
          }
        ]
      },
      seo: {
        score: baseScore + Math.floor(Math.random() * 12),
        issues: [
          {
            type: 'Missing Schema Markup',
            description: 'No structured data found for better search visibility',
            recommendation: 'Implement JSON-LD schema markup for organization, articles, and products'
          },
          {
            type: 'Suboptimal Meta Tags',
            description: 'Meta descriptions and titles need optimization',
            recommendation: 'Craft unique, keyword-rich meta descriptions under 160 characters'
          },
          {
            type: 'Missing Open Graph Tags',
            description: 'Social media sharing tags are incomplete',
            recommendation: 'Add comprehensive Open Graph and Twitter Card meta tags'
          },
          {
            type: 'Internal Linking Issues',
            description: 'Poor internal link structure affects page authority distribution',
            recommendation: 'Implement strategic internal linking with descriptive anchor text'
          }
        ]
      },
      accessibility: {
        score: baseScore + Math.floor(Math.random() * 8),
        issues: [
          {
            type: 'Missing ARIA Labels',
            description: 'Interactive elements lack proper ARIA labeling',
            recommendation: 'Add ARIA labels and descriptions to all interactive components'
          },
          {
            type: 'Color Contrast Issues',
            description: 'Several text elements fail WCAG AA contrast requirements',
            recommendation: 'Ensure all text has a contrast ratio of at least 4.5:1 with background'
          },
          {
            type: 'Keyboard Navigation Problems',
            description: 'Some elements are not accessible via keyboard navigation',
            recommendation: 'Ensure all interactive elements are reachable and usable with keyboard only'
          },
          {
            type: 'Missing Skip Links',
            description: 'No skip navigation links for screen readers',
            recommendation: 'Add skip links to main content and navigation sections'
          }
        ]
      }
    };
  };

  const runAdvancedAudit = async () => {
    if (!config.url) {
      toast.error('Please enter a valid URL to audit');
      return;
    }

    if (!Object.values(config.auditTypes).some(enabled => enabled)) {
      toast.error('Please select at least one audit type');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentStepIndex(0);

    // Simulate advanced audit process
    for (let i = 0; i < AUDIT_STEPS.length; i++) {
      setCurrentStep(AUDIT_STEPS[i].name);
      setCurrentStepIndex(i);
      setProgress((i / (AUDIT_STEPS.length - 1)) * 100);
      
      // Variable delay based on step complexity
      const delay = i === 2 || i === 3 ? 2000 : 1500; // Security and performance take longer
      await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 1000));
    }

    const results = generateAdvancedResults(config.url);
    setIsLoading(false);
    setCurrentStep('');
    onAuditComplete(results);
    toast.success('Advanced website audit completed successfully!');
  };

  const updateAuditType = (type: keyof typeof config.auditTypes, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      auditTypes: {
        ...prev.auditTypes,
        [type]: enabled
      }
    }));
  };

  const enabledAuditCount = Object.values(config.auditTypes).filter(Boolean).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-elegant bg-gradient-to-br from-card to-card/80 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow animate-pulse">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Advanced Website Audit Suite
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Comprehensive security, performance, SEO, and accessibility analysis with advanced configuration options
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Setup</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              <TabsTrigger value="audit">Audit Types</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-base font-semibold">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={config.url}
                    onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                    disabled={isLoading}
                    className="text-base h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Device Type</Label>
                    <Select value={config.device} onValueChange={(value: any) => setConfig(prev => ({ ...prev, device: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desktop">
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4" />
                            <span>Desktop</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="mobile">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>Mobile</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="tablet">
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4" />
                            <span>Tablet</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Scan Depth</Label>
                    <Select value={config.depth} onValueChange={(value: any) => setConfig(prev => ({ ...prev, depth: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shallow">Shallow (1-2 pages)</SelectItem>
                        <SelectItem value="medium">Medium (5-10 pages)</SelectItem>
                        <SelectItem value="deep">Deep (20+ pages)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Testing Location</Label>
                  <Select value={config.location} onValueChange={(value) => setConfig(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east">US East (Virginia)</SelectItem>
                      <SelectItem value="us-west">US West (California)</SelectItem>
                      <SelectItem value="eu-west">Europe West (Ireland)</SelectItem>
                      <SelectItem value="asia-east">Asia East (Tokyo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headers" className="text-base font-semibold">Custom Headers (JSON)</Label>
                  <Textarea
                    id="headers"
                    value={config.customHeaders}
                    onChange={(e) => setConfig(prev => ({ ...prev, customHeaders: e.target.value }))}
                    placeholder='{"Authorization": "Bearer token", "User-Agent": "Custom Agent"}'
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ignore-cert" className="text-base font-semibold">Ignore Certificate Errors</Label>
                    <Switch
                      id="ignore-cert"
                      checked={config.ignoreCertificateErrors}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, ignoreCertificateErrors: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="follow-redirect" className="text-base font-semibold">Follow Redirects</Label>
                    <Switch
                      id="follow-redirect"
                      checked={config.followRedirects}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, followRedirects: checked }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(config.auditTypes).map(([type, enabled]) => {
                  const icons = {
                    security: Shield,
                    performance: Zap,
                    seo: Search,
                    accessibility: Eye
                  };
                  const colors = {
                    security: 'text-primary',
                    performance: 'text-success',
                    seo: 'text-accent',
                    accessibility: 'text-warning'
                  };
                  const Icon = icons[type as keyof typeof icons];
                  
                  return (
                    <Card key={type} className={`border-2 transition-all duration-200 ${enabled ? 'border-primary shadow-card' : 'border-muted'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-opacity-10 ${enabled ? 'bg-primary' : 'bg-muted'}`}>
                              <Icon className={`h-5 w-5 ${enabled ? colors[type as keyof typeof colors] : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">{type}</h3>
                              <p className="text-sm text-muted-foreground">
                                {type === 'security' && 'Vulnerability scanning & security analysis'}
                                {type === 'performance' && 'Speed & optimization testing'}
                                {type === 'seo' && 'Search engine optimization check'}
                                {type === 'accessibility' && 'WCAG compliance testing'}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => updateAuditType(type as keyof typeof config.auditTypes, checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="text-center">
                <Badge variant="outline" className="text-base px-4 py-2">
                  {enabledAuditCount} audit type{enabledAuditCount !== 1 ? 's' : ''} selected
                </Badge>
              </div>
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="space-y-6">
              <Progress value={progress} className="w-full h-3" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  <span className="text-lg font-medium">{currentStep}</span>
                </div>
                
                <div className="flex justify-center space-x-2">
                  {AUDIT_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          index < currentStepIndex 
                            ? 'bg-primary border-primary text-white' 
                            : index === currentStepIndex 
                            ? 'border-primary text-primary animate-pulse' 
                            : 'border-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={runAdvancedAudit}
            disabled={isLoading || !config.url || enabledAuditCount === 0}
            className="w-full h-14 text-lg font-semibold gradient-primary text-white border-0 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 animate-spin" />
                <span>Running Advanced Audit...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Start Advanced Audit</span>
              </div>
            )}
          </Button>

          {!isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {Object.entries(config.auditTypes).map(([type, enabled]) => {
                const icons = {
                  security: Shield,
                  performance: Zap,
                  seo: Search,
                  accessibility: Eye
                };
                const colors = {
                  security: 'text-primary',
                  performance: 'text-success',
                  seo: 'text-accent',
                  accessibility: 'text-warning'
                };
                const Icon = icons[type as keyof typeof icons];
                
                return (
                  <div key={type} className={`flex flex-col items-center space-y-2 p-3 rounded-lg ${enabled ? 'bg-primary/5' : 'opacity-50'}`}>
                    <div className={`w-10 h-10 bg-opacity-10 rounded-lg flex items-center justify-center ${enabled ? 'bg-primary' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${enabled ? colors[type as keyof typeof colors] : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};