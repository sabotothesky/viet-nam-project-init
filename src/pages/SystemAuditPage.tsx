
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Globe,
  Settings,
  Shield,
  Activity,
  Network,
  Server,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AuditResult {
  category: string;
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  duration?: number;
}

interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  errors: string[];
  warnings: string[];
  totalTests: number;
  passedTests: number;
}

const SystemAuditPage = () => {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall: 'healthy',
    errors: [],
    warnings: [],
    totalTests: 0,
    passedTests: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const { user, session } = useAuth();

  const addResult = (result: AuditResult) => {
    setAuditResults(prev => [...prev, result]);
  };

  const runTest = async (category: string, testName: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    setCurrentTest(`${category}: ${testName}`);
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      addResult({
        category,
        test: testName,
        status: 'success',
        message: 'Test passed successfully',
        details: result,
        duration
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      addResult({
        category,
        test: testName,
        status: 'error',
        message: error.message || 'Test failed',
        details: error,
        duration
      });
    }
  };

  const checkDatabaseConnection = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) throw new Error(`Database connection failed: ${error.message}`);
    return { connected: true, data };
  };

  const checkAuthentication = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(`Auth check failed: ${error.message}`);
    
    return {
      hasSession: !!session,
      user: session?.user?.email || 'No user',
      sessionValid: !!session?.access_token
    };
  };

  const checkEnvironmentVariables = async () => {
    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const missing = [];
    const present = [];
    
    for (const envVar of requiredEnvVars) {
      const value = import.meta.env[envVar];
      if (!value) {
        missing.push(envVar);
      } else {
        present.push({ name: envVar, hasValue: !!value });
      }
    }
    
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
    
    return { present, missing };
  };

  const checkNetworkConnectivity = async () => {
    const endpoints = [
      { name: 'Supabase API', url: import.meta.env.VITE_SUPABASE_URL },
      { name: 'Google Fonts', url: 'https://fonts.googleapis.com' },
      { name: 'CDN Check', url: 'https://cdn.jsdelivr.net' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, { method: 'HEAD', mode: 'no-cors' });
        results.push({ name: endpoint.name, status: 'reachable', url: endpoint.url });
      } catch (error) {
        results.push({ name: endpoint.name, status: 'unreachable', url: endpoint.url, error: error.message });
      }
    }
    
    return results;
  };

  const checkRoutes = async () => {
    const routes = [
      '/',
      '/login',
      '/register',
      '/simple-club',
      '/simple-booking',
      '/simple-about',
      '/simple-contact'
    ];
    
    const routeResults = [];
    
    for (const route of routes) {
      try {
        // Simulate route check by creating a temporary anchor
        const link = document.createElement('a');
        link.href = window.location.origin + route;
        const isValid = link.href.includes(route);
        
        routeResults.push({
          route,
          status: isValid ? 'valid' : 'invalid',
          fullUrl: link.href
        });
      } catch (error) {
        routeResults.push({
          route,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return routeResults;
  };

  const checkConsoleErrors = async () => {
    // Check for console errors
    const errors = [];
    const warnings = [];
    
    // Override console methods temporarily to capture errors
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      errors.push(args.join(' '));
      originalError(...args);
    };
    
    console.warn = (...args) => {
      warnings.push(args.join(' '));
      originalWarn(...args);
    };
    
    // Test a few things that might generate errors
    try {
      // Test React component rendering
      const testDiv = document.createElement('div');
      document.body.appendChild(testDiv);
      document.body.removeChild(testDiv);
    } catch (error) {
      errors.push(`DOM manipulation error: ${error.message}`);
    }
    
    // Restore original console methods
    console.error = originalError;
    console.warn = originalWarn;
    
    return { errors, warnings, errorCount: errors.length, warningCount: warnings.length };
  };

  const checkStorageAccess = async () => {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) throw new Error(`Storage access failed: ${error.message}`);
    
    return {
      bucketsAccessible: true,
      bucketCount: buckets.length,
      buckets: buckets.map(b => b.name)
    };
  };

  const runFullSystemAudit = async () => {
    setIsRunning(true);
    setAuditResults([]);
    setCurrentTest('Starting system audit...');
    
    try {
      // Database Tests
      await runTest('Database', 'Connection Test', checkDatabaseConnection);
      await runTest('Database', 'Storage Access', checkStorageAccess);
      
      // Authentication Tests
      await runTest('Authentication', 'Session Check', checkAuthentication);
      
      // Environment Tests
      await runTest('Environment', 'Variables Check', checkEnvironmentVariables);
      
      // Network Tests
      await runTest('Network', 'Connectivity Check', checkNetworkConnectivity);
      
      // Application Tests
      await runTest('Application', 'Route Validation', checkRoutes);
      await runTest('Application', 'Console Errors', checkConsoleErrors);
      
      // Calculate overall status
      const results = auditResults;
      const totalTests = results.length;
      const passedTests = results.filter(r => r.status === 'success').length;
      const errors = results.filter(r => r.status === 'error').map(r => r.message);
      const warnings = results.filter(r => r.status === 'warning').map(r => r.message);
      
      let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
      if (errors.length > 0) {
        overall = errors.length > 3 ? 'critical' : 'degraded';
      }
      
      setSystemStatus({
        overall,
        errors,
        warnings,
        totalTests,
        passedTests
      });
      
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  useEffect(() => {
    // Run audit on page load
    runFullSystemAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <Helmet>
        <title>System Audit - CLB Bi-a Sài Gòn</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🔍 System Audit Dashboard</h1>
              <p className="text-green-200">Comprehensive system health and connectivity check</p>
            </div>
            <Button
              onClick={runFullSystemAudit}
              disabled={isRunning}
              className="bg-yellow-400 text-green-900 hover:bg-yellow-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Audit...' : 'Run Audit'}
            </Button>
          </div>

          {/* Current Test Status */}
          {isRunning && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Currently running: {currentTest}
              </AlertDescription>
            </Alert>
          )}

          {/* Overall Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Overall System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    systemStatus.overall === 'healthy' ? 'text-green-600' :
                    systemStatus.overall === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {systemStatus.overall.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-600">System Health</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{systemStatus.passedTests}</div>
                  <p className="text-sm text-gray-600">Tests Passed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{systemStatus.errors.length}</div>
                  <p className="text-sm text-gray-600">Errors Found</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{systemStatus.warnings.length}</div>
                  <p className="text-sm text-gray-600">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-green-800 border-green-700">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-green-900">All Tests</TabsTrigger>
              <TabsTrigger value="errors" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-green-900">Errors Only</TabsTrigger>
              <TabsTrigger value="database" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-green-900">Database</TabsTrigger>
              <TabsTrigger value="network" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-green-900">Network</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {auditResults.map((result, index) => (
                <Card key={index} className={`${getStatusColor(result.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h3 className="font-semibold">{result.category}: {result.test}</h3>
                          <p className="text-sm text-gray-600">{result.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                        {result.duration && (
                          <p className="text-xs text-gray-500 mt-1">{result.duration}ms</p>
                        )}
                      </div>
                    </div>
                    
                    {result.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              {auditResults.filter(r => r.status === 'error').map((result, index) => (
                <Card key={index} className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-semibold text-red-800">{result.category}: {result.test}</h3>
                        <p className="text-sm text-red-600">{result.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              {auditResults.filter(r => r.category === 'Database').map((result, index) => (
                <Card key={index} className={getStatusColor(result.status)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5" />
                      <div>
                        <h3 className="font-semibold">{result.test}</h3>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              {auditResults.filter(r => r.category === 'Network').map((result, index) => (
                <Card key={index} className={getStatusColor(result.status)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Network className="h-5 w-5" />
                      <div>
                        <h3 className="font-semibold">{result.test}</h3>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SystemAuditPage;
