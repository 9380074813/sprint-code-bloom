import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuditResults } from './AuditForm';
import { 
  Shield, 
  Zap, 
  Search, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AuditReportProps {
  results: AuditResults;
  onNewAudit: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-destructive';
};

const getScoreBackground = (score: number) => {
  if (score >= 90) return 'bg-success/10';
  if (score >= 70) return 'bg-warning/10';
  return 'bg-destructive/10';
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'warning';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return <XCircle className="h-4 w-4" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4" />;
    case 'low':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
};

export const AuditReport = ({ results, onNewAudit }: AuditReportProps) => {
  const overallScore = Math.round(
    (results.security.score + results.performance.score + results.seo.score + results.accessibility.score) / 4
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">Audit Report</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>{results.url}</span>
                <ExternalLink className="h-4 w-4" />
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                Generated on {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${getScoreBackground(results.security.score)}`}>
                <Shield className={`h-6 w-6 ${getScoreColor(results.security.score)}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security</p>
                <p className={`text-2xl font-bold ${getScoreColor(results.security.score)}`}>
                  {results.security.score}
                </p>
              </div>
            </div>
            <Progress value={results.security.score} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${getScoreBackground(results.performance.score)}`}>
                <Zap className={`h-6 w-6 ${getScoreColor(results.performance.score)}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className={`text-2xl font-bold ${getScoreColor(results.performance.score)}`}>
                  {results.performance.score}
                </p>
              </div>
            </div>
            <Progress value={results.performance.score} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              Load time: {results.performance.loadTime.toFixed(1)}s
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${getScoreBackground(results.seo.score)}`}>
                <Search className={`h-6 w-6 ${getScoreColor(results.seo.score)}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">SEO</p>
                <p className={`text-2xl font-bold ${getScoreColor(results.seo.score)}`}>
                  {results.seo.score}
                </p>
              </div>
            </div>
            <Progress value={results.seo.score} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${getScoreBackground(results.accessibility.score)}`}>
                <Eye className={`h-6 w-6 ${getScoreColor(results.accessibility.score)}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accessibility</p>
                <p className={`text-2xl font-bold ${getScoreColor(results.accessibility.score)}`}>
                  {results.accessibility.score}
                </p>
              </div>
            </div>
            <Progress value={results.accessibility.score} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Issues */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Security Vulnerabilities</span>
              <Badge variant="outline">{results.security.vulnerabilities.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.security.vulnerabilities.map((vuln, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center space-x-2">
                    {getSeverityIcon(vuln.severity)}
                    <span>{vuln.type}</span>
                  </h4>
                  <Badge variant={getSeverityColor(vuln.severity) as any}>
                    {vuln.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{vuln.description}</p>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm"><strong>Recommendation:</strong> {vuln.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Issues */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-success" />
              <span>Performance Issues</span>
              <Badge variant="outline">{results.performance.issues.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.performance.issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>{issue.type}</span>
                </h4>
                <p className="text-sm text-muted-foreground">{issue.description}</p>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm"><strong>Recommendation:</strong> {issue.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SEO Issues */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-accent" />
              <span>SEO Optimization</span>
              <Badge variant="outline">{results.seo.issues.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.seo.issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>{issue.type}</span>
                </h4>
                <p className="text-sm text-muted-foreground">{issue.description}</p>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm"><strong>Recommendation:</strong> {issue.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Accessibility Issues */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-warning" />
              <span>Accessibility</span>
              <Badge variant="outline">{results.accessibility.issues.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.accessibility.issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>{issue.type}</span>
                </h4>
                <p className="text-sm text-muted-foreground">{issue.description}</p>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm"><strong>Recommendation:</strong> {issue.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Next Steps</h3>
              <p className="text-sm text-muted-foreground">
                Download the full report or run a new audit
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </Button>
              <Button 
                onClick={onNewAudit}
                className="gradient-primary text-white flex items-center space-x-2 shadow-elegant hover:shadow-glow"
              >
                <RefreshCw className="h-4 w-4" />
                <span>New Audit</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};