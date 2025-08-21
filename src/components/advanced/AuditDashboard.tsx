import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Zap, 
  Search, 
  Eye, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { AuditResults } from '../AuditForm';

interface AuditDashboardProps {
  results: AuditResults;
  onNewAudit: () => void;
}

const COLORS = {
  critical: 'hsl(var(--destructive))',
  high: 'hsl(var(--destructive))',
  medium: 'hsl(var(--warning))',
  low: 'hsl(var(--success))',
  excellent: 'hsl(var(--success))',
  good: 'hsl(var(--primary))',
  needs_improvement: 'hsl(var(--warning))',
  poor: 'hsl(var(--destructive))'
};

export const AuditDashboard = ({ results, onNewAudit }: AuditDashboardProps) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const overallScore = Math.round(
    (results.security.score + results.performance.score + results.seo.score + results.accessibility.score) / 4
  );

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'needs_improvement';
    return 'poor';
  };

  const categoryScores = [
    { name: 'Security', score: results.security.score, icon: Shield, color: 'hsl(var(--primary))' },
    { name: 'Performance', score: results.performance.score, icon: Zap, color: 'hsl(var(--success))' },
    { name: 'SEO', score: results.seo.score, icon: Search, color: 'hsl(var(--accent))' },
    { name: 'Accessibility', score: results.accessibility.score, icon: Eye, color: 'hsl(var(--warning))' }
  ];

  const vulnerabilityData = results.security.vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(vulnerabilityData).map(([severity, count]) => ({
    name: severity,
    value: count,
    color: COLORS[severity as keyof typeof COLORS]
  }));

  const trendData = [
    { month: 'Jan', security: 85, performance: 78, seo: 82, accessibility: 90 },
    { month: 'Feb', security: 88, performance: 82, seo: 85, accessibility: 92 },
    { month: 'Mar', security: results.security.score, performance: results.performance.score, seo: results.seo.score, accessibility: results.accessibility.score }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Advanced Header */}
      <Card className="shadow-elegant bg-gradient-to-r from-card to-card/80 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Advanced Audit Report
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 text-lg">
                    <span>{results.url}</span>
                    <Badge variant="outline" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(results.timestamp).toLocaleDateString()}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ score: overallScore }]}>
                    <RadialBar
                      dataKey="score"
                      cornerRadius={10}
                      fill={COLORS[getScoreStatus(overallScore) as keyof typeof COLORS]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{overallScore}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
                className="flex items-center space-x-2"
              >
                <PieChart className="h-4 w-4" />
                <span>Overview</span>
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Detailed</span>
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button 
                onClick={onNewAudit}
                className="gradient-primary text-white shadow-elegant hover:shadow-glow"
                size="sm"
              >
                New Audit
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryScores.map((category) => (
              <Card key={category.name} className="shadow-card hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${category.color}20` }}>
                      <category.icon className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: category.color }}>
                        {category.score}
                      </div>
                      <Badge variant={getScoreStatus(category.score) === 'excellent' ? 'default' : 'secondary'}>
                        {getScoreStatus(category.score).replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.score}%</span>
                    </div>
                    <Progress value={category.score} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vulnerability Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>Vulnerability Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(vulnerabilityData).map(([severity, count]) => (
                    <div key={severity} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">{severity}</span>
                        <Badge variant={severity === 'critical' ? 'destructive' : severity === 'high' ? 'destructive' : severity === 'medium' ? 'default' : 'secondary'}>
                          {count}
                        </Badge>
                      </div>
                      <Progress value={(count / results.security.vulnerabilities.length) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score Comparison */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Category Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryScores.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" style={{ color: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="font-bold" style={{ color: category.color }}>
                          {category.score}%
                        </span>
                      </div>
                      <Progress value={category.score} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security Analysis</span>
                <Badge variant="outline">{results.security.vulnerabilities.length} Issues</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.security.vulnerabilities.map((vuln, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-card transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span>{vuln.type}</span>
                    </h4>
                    <Badge variant={vuln.severity === 'critical' ? 'destructive' : vuln.severity === 'high' ? 'destructive' : vuln.severity === 'medium' ? 'default' : 'secondary'}>
                      {vuln.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{vuln.description}</p>
                  <div className="bg-muted/50 rounded-md p-3 border-l-4 border-primary">
                    <p className="text-sm"><strong>💡 Recommendation:</strong> {vuln.recommendation}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-success" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Load Time</span>
                  <span className="text-lg font-bold text-success">{results.performance.loadTime.toFixed(1)}s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Performance Score</span>
                  <span className="text-lg font-bold text-primary">{results.performance.score}/100</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Performance Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.performance.issues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <h4 className="font-medium text-warning">{issue.type}</h4>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    <p className="text-sm font-medium">💡 {issue.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trendData[trendData.length - 1] && Object.entries(trendData[trendData.length - 1]).map(([key, value]) => {
                    if (key === 'month') return null;
                    const category = categoryScores.find(c => c.name.toLowerCase() === key);
                    if (!category) return null;
                    
                    return (
                      <div key={key} className="text-center p-4 bg-muted/20 rounded-lg">
                        <category.icon className="h-6 w-6 mx-auto mb-2" style={{ color: category.color }} />
                        <div className="text-2xl font-bold" style={{ color: category.color }}>
                          {value as number}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">{key}</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Historical Performance</h3>
                  {['security', 'performance', 'seo', 'accessibility'].map((metric) => {
                    const category = categoryScores.find(c => c.name.toLowerCase() === metric);
                    if (!category) return null;
                    
                    const currentValue = trendData[trendData.length - 1][metric as keyof typeof trendData[0]] as number;
                    const previousValue = trendData[trendData.length - 2][metric as keyof typeof trendData[0]] as number;
                    const trend = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'stable';
                    
                    return (
                      <div key={metric} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <category.icon className="h-5 w-5" style={{ color: category.color }} />
                          <span className="font-medium capitalize">{metric}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold" style={{ color: category.color }}>
                            {currentValue}%
                          </span>
                          <div className={`flex items-center space-x-1 text-sm ${
                            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                            {trend === 'down' && <TrendingUp className="h-3 w-3 rotate-180" />}
                            <span>{trend === 'stable' ? '0%' : `${Math.abs(currentValue - previousValue)}%`}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};