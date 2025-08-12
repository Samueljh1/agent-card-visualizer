'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AgentCard } from '@/types/agentCard';
import { validateAgentCard, getValidationSummary, ValidationError } from '@/utils/validation';
import { AlertCircle, CheckCircle, Copy, Eye, Globe, Shield, Code, Zap, AlertTriangle, Info, HammerIcon, ArrowRightLeft } from 'lucide-react';

export default function AgentCardVisualizer() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedCard, setParsedCard] = useState<AgentCard | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validationSummary = useMemo(() => {
    if (!parsedCard) return null;
    return getValidationSummary(validationErrors);
  }, [parsedCard, validationErrors]);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    
    if (!value.trim()) {
      setParsedCard(null);
      setValidationErrors([]);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      const errors = validateAgentCard(parsed);
      
      setParsedCard(parsed);
      setValidationErrors(errors);
    } catch {
      setParsedCard(null);
      setValidationErrors([{ path: 'root', message: 'Invalid JSON format', severity: 'error' }]);
    }
  };

  const loadExampleCard = () => {
    const exampleCard = {
      "name": "Recipe Assistant",
      "description": "An AI agent that helps users find and create recipes based on their preferences and available ingredients",
      "version": "1.2.0",
      "protocolVersion": "0.3.0",
      "url": "https://api.recipe-assistant.com/a2a/v1",
      "preferredTransport": "JSONRPC",
      "iconUrl": "https://api.recipe-assistant.com/icon.png",
      "documentationUrl": "https://docs.recipe-assistant.com",
      "capabilities": {
        "streaming": true,
        "pushNotifications": false,
        "stateTransitionHistory": true,
        "extensions": []
      },
      "skills": [
        {
          "id": "recipe-search",
          "name": "Recipe Search",
          "description": "Search for recipes based on ingredients, cuisine, or dietary restrictions",
          "tags": ["cooking", "search", "ingredients"],
          "examples": ["Find me a pasta recipe", "What can I make with chicken and rice?"]
        },
        {
          "id": "meal-planning",
          "name": "Meal Planning",
          "description": "Create weekly meal plans based on preferences and constraints",
          "tags": ["planning", "nutrition", "weekly"],
          "examples": ["Plan meals for this week", "Create a vegetarian meal plan"]
        }
      ],
      "defaultInputModes": ["text/plain", "application/json"],
      "defaultOutputModes": ["text/plain", "application/json"],
      "provider": {
        "organization": "Recipe Labs Inc",
        "url": "https://recipe-labs.com"
      }
    };
    
    setJsonInput(JSON.stringify(exampleCard, null, 2));
    handleJsonChange(JSON.stringify(exampleCard, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Agent Card Visualizer</h1>
          <p className="text-slate-600 text-lg">
            Debug and preview A2A Agent Cards with a clean, modern interface
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-full">
          {/* Left Panel - JSON Input */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Agent Card JSON
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadExampleCard}
                  >
                    Load Example
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    disabled={!jsonInput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your Agent Card JSON here..."
                value={jsonInput}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
              />
              
              {/* Validation Status */}
              <div className="mt-4 flex items-center gap-2">
                {validationSummary?.isValid && parsedCard ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Valid Agent Card</span>
                    {validationSummary.warnings > 0 && (
                      <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                        {validationSummary.warnings} warning{validationSummary.warnings > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </>
                ) : validationSummary && !validationSummary.isValid ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {validationSummary.errors} error{validationSummary.errors > 1 ? 's' : ''}
                    </span>
                    {validationSummary.warnings > 0 && (
                      <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                        {validationSummary.warnings} warning{validationSummary.warnings > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </>
                ) : null}
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mt-3"><ErrorList errors={validationErrors} /></div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Visualized Output */}
          <div className="space-y-6">
            {parsedCard ? (
              <>
                {/* Agent Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {parsedCard.iconUrl && (
                          <img 
                            src={parsedCard.iconUrl} 
                            alt={parsedCard.name}
                            className="w-12 h-12 rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <CardTitle className="text-2xl">{parsedCard.name}</CardTitle>
                          <p className="text-slate-600 mt-1">{parsedCard.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary">v{parsedCard.version}</Badge>
                        {parsedCard.protocolVersion && (
                          <Badge variant="outline" className="text-xs">
                            A2A {parsedCard.protocolVersion}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Endpoint</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-mono">{parsedCard.url}</span>
                        </div>
                      </div>
                      {parsedCard.preferredTransport && (
                        <div>
                          <label className="text-sm font-medium text-slate-700">Transport</label>
                          <div className="mt-1">
                            <Badge variant="outline">{parsedCard.preferredTransport}</Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {parsedCard.provider && (
                      <div className="mt-4 pt-4 border-t">
                        <label className="text-sm font-medium text-slate-700">Provider</label>
                        <div className="mt-1">
                          <a 
                            href={parsedCard.provider.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {parsedCard.provider.organization}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tabs for detailed information */}
                <Tabs defaultValue="capabilities" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="io">Input/Output</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="capabilities">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Capabilities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {validationErrors.find(e => e.path === 'capabilities') ? (
                          <ErrorList errors={validationErrors.filter(e => e.path === 'capabilities')} />
                        ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                            <span>Streaming</span>
                            <Badge variant={parsedCard.capabilities.streaming ? "default" : "secondary"}>
                              {parsedCard.capabilities.streaming ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                            <span>Push Notifications</span>
                            <Badge variant={parsedCard.capabilities.pushNotifications ? "default" : "secondary"}>
                              {parsedCard.capabilities.pushNotifications ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded col-span-2">
                            <span>State Transition History</span>
                            <Badge variant={parsedCard.capabilities.stateTransitionHistory ? "default" : "secondary"}>
                              {parsedCard.capabilities.stateTransitionHistory ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                        </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills">
                    {validationErrors.find(e => e.path === 'skills') ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <HammerIcon className="h-5 w-5" />
                            Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ErrorList errors={validationErrors.filter(e => e.path === 'skills')} />
                          </CardContent>
                        </Card>
                    ) : (
                      <div className="space-y-4">
                        {parsedCard.skills.map((skill) => (
                          <Card key={skill.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                                  <p className="text-slate-600 text-sm mt-1">{skill.description}</p>
                                </div>
                                <Badge variant="outline">{skill.id}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Tags</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {skill.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                {skill.examples && skill.examples.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium text-slate-700">Examples</label>
                                    <div className="space-y-2 mt-1">
                                      {skill.examples.map((example, exIndex) => (
                                        <div key={exIndex} className="p-2 bg-slate-50 rounded text-sm font-mono">
                                          &quot;{example}&quot;
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="io">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ArrowRightLeft className="h-5 w-5" />
                          Input/Output Modes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {validationErrors.find(e => e.path === 'defaultInputModes' || e.path === 'defaultOutputModes') && (
                          <div className="mb-6">
                            <ErrorList errors={validationErrors.filter(e => e.path === 'defaultInputModes' || e.path === 'defaultOutputModes')} />
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-6">
                          {!validationErrors.find(e => e.path === 'defaultInputModes') && (
                            <div>
                              <label className="text-sm font-medium text-slate-700">Default Input Modes</label>
                              <div className="space-y-2 mt-2">
                                {parsedCard.defaultInputModes.map((mode) => (
                                  <div key={mode} className="p-2 bg-green-50 rounded border border-green-200">
                                    <code className="text-sm text-green-800">{mode}</code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {!validationErrors.find(e => e.path === 'defaultOutputModes') && (
                            <div>
                              <label className="text-sm font-medium text-slate-700">Default Output Modes</label>
                              <div className="space-y-2 mt-2">
                                {parsedCard.defaultOutputModes.map((mode) => (
                                  <div key={mode} className="p-2 bg-blue-50 rounded border border-blue-200">
                                    <code className="text-sm text-blue-800">{mode}</code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Security Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {parsedCard.security && parsedCard.security.length > 0 ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-slate-700">Security Requirements</label>
                              <div className="space-y-2 mt-2">
                                {parsedCard.security.map((req, index) => (
                                  <div key={index} className="p-3 bg-amber-50 rounded border border-amber-200">
                                    <pre className="text-sm text-amber-800 font-mono">
                                      {JSON.stringify(req, null, 2)}
                                    </pre>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No security requirements specified</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent>
                  <div className="text-center text-slate-500">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Agent Card to display</p>
                    <p className="text-sm mt-1">Paste a valid Agent Card JSON to see the visualization</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorList({ errors }: { errors: ValidationError[] }) {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {errors.map((error, index) => {
        const isError = error.severity === 'error';
        const isWarning = error.severity === 'warning';
        const isInfo = error.severity === 'info';
        
        return (
          <div 
            key={index} 
            className={`flex items-start gap-2 p-2 rounded border-l-4 ${
              isError ? 'bg-red-50 border-red-500' : 
              isWarning ? 'bg-yellow-50 border-yellow-500' : 
              'bg-blue-50 border-blue-500'
            }`}
          >
            {isError && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
            {isWarning && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
            {isInfo && <Info className="h-4 w-4 text-blue-600 mt-0.5" />}
            <div>
              <p className={`text-sm ${
                isError ? 'text-red-600' : 
                isWarning ? 'text-yellow-600' : 
                'text-blue-600'
              }`}>
                {error.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}