import { AgentCapabilities, AgentCard, AgentInterface, AgentSkill } from '@/types/agentCard';

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function validateAgentCard(card: AgentCard): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Required fields validation
  const requiredFields: Array<{ field: string; type?: string }> = [
    { field: 'name', type: 'string' },
    { field: 'description', type: 'string' },
    { field: 'version', type: 'string' },
    { field: 'url', type: 'string' },
    { field: 'capabilities', type: 'object' },
    { field: 'skills', type: 'array' },
    { field: 'defaultInputModes', type: 'array' },
    { field: 'defaultOutputModes', type: 'array' }
  ];
  
  for (const { field, type } of requiredFields) {
    if (!card[field as keyof AgentCard]) {
      errors.push({ 
        path: field, 
        message: `Required field '${field}' is missing`, 
        severity: 'error' 
      });
    } else if (type && typeof card[field as keyof AgentCard] !== type && type !== 'array') {
      errors.push({ 
        path: field, 
        message: `Field '${field}' should be of type ${type}`, 
        severity: 'error' 
      });
    } else if (type === 'array' && !Array.isArray(card[field as keyof AgentCard])) {
      errors.push({ 
        path: field, 
        message: `Field '${field}' should be an array`, 
        severity: 'error' 
      });
    }
  }

  // URL validation
  if (card.url) {
    if (!isValidUrl(card.url)) {
      errors.push({ path: 'url', message: 'Invalid URL format', severity: 'error' });
    } else if (!card.url.startsWith('https://') && !card.url.startsWith('http://localhost')) {
      errors.push({ 
        path: 'url', 
        message: 'Production URLs should use HTTPS', 
        severity: 'warning' 
      });
    }
  }

  // Protocol version validation
  if (card.protocolVersion && !isValidVersion(card.protocolVersion)) {
    errors.push({ 
      path: 'protocolVersion', 
      message: 'Invalid version format. Expected semantic version (e.g., "0.3.0")', 
      severity: 'warning' 
    });
  }

  // Version validation
  if (card.version && !isValidVersion(card.version)) {
    errors.push({ 
      path: 'version', 
      message: 'Invalid version format. Expected semantic version (e.g., "1.0.0")', 
      severity: 'warning' 
    });
  }

  // Transport validation
  const validTransports = ['JSONRPC', 'GRPC', 'HTTP+JSON'];
  if (card.preferredTransport && !validTransports.includes(card.preferredTransport)) {
    errors.push({ 
      path: 'preferredTransport', 
      message: `Invalid transport. Must be one of: ${validTransports.join(', ')}`, 
      severity: 'error' 
    });
  }

  // Skills validation
  if (card.skills && Array.isArray(card.skills)) {
    if (card.skills.length === 0) {
      errors.push({ 
        path: 'skills', 
        message: 'Agent should have at least one skill', 
        severity: 'warning' 
      });
    }

    card.skills.forEach((skill: AgentSkill, index: number) => {
      const requiredSkillFields = ['id', 'name', 'description', 'tags'];
      for (const field of requiredSkillFields) {
        if (!skill[field as keyof AgentSkill]) {
          errors.push({ 
            path: `skills[${index}].${field}`, 
            message: `Required skill field '${field}' is missing`, 
            severity: 'error' 
          });
        }
      }

      // Skill ID validation
      if (skill.id && !/^[a-z0-9-]+$/.test(skill.id)) {
        errors.push({ 
          path: `skills[${index}].id`, 
          message: 'Skill ID should contain only lowercase letters, numbers, and hyphens', 
          severity: 'warning' 
        });
      }

      // Tags validation
      if (skill.tags && !Array.isArray(skill.tags)) {
        errors.push({ 
          path: `skills[${index}].tags`, 
          message: 'Tags should be an array of strings', 
          severity: 'error' 
        });
      } else if (skill.tags && skill.tags.length === 0) {
        errors.push({ 
          path: `skills[${index}].tags`, 
          message: 'Skills should have at least one tag', 
          severity: 'warning' 
        });
      }

      // Examples validation
      if (skill.examples && !Array.isArray(skill.examples)) {
        errors.push({ 
          path: `skills[${index}].examples`, 
          message: 'Examples should be an array of strings', 
          severity: 'error' 
        });
      }
    });

    // Check for duplicate skill IDs
    const skillIds = card.skills.map((s: AgentSkill) => s.id).filter(Boolean);
    const duplicateIds = skillIds.filter((id: string, index: number) => skillIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push({ 
        path: 'skills', 
        message: `Duplicate skill IDs found: ${[...new Set(duplicateIds)].join(', ')}`, 
        severity: 'error' 
      });
    }
  }

  // Capabilities validation
  if (card.capabilities) {
    const booleanFields = ['streaming', 'pushNotifications', 'stateTransitionHistory'];
    for (const field of booleanFields) {
      if (card.capabilities[field as keyof AgentCapabilities] !== undefined && typeof card.capabilities[field as keyof AgentCapabilities] !== 'boolean') {
        errors.push({ 
          path: `capabilities.${field}`, 
          message: `Field '${field}' should be a boolean`, 
          severity: 'error' 
        });
      }
    }

    if (card.capabilities.extensions && !Array.isArray(card.capabilities.extensions)) {
      errors.push({ 
        path: 'capabilities.extensions', 
        message: 'Extensions should be an array', 
        severity: 'error' 
      });
    }
  }

  // Input/Output modes validation
  const validateMimeTypes = (modes: string[], path: string) => {
    if (!Array.isArray(modes)) return;
    
    modes.forEach((mode: string, index: number) => {
      if (typeof mode !== 'string') {
        errors.push({ 
          path: `${path}[${index}]`, 
          message: 'MIME type should be a string', 
          severity: 'error' 
        });
      } else if (!isValidMimeType(mode)) {
        errors.push({ 
          path: `${path}[${index}]`, 
          message: `Invalid MIME type format: ${mode}`, 
          severity: 'warning' 
        });
      }
    });
  };

  if (card.defaultInputModes) {
    validateMimeTypes(card.defaultInputModes, 'defaultInputModes');
  }

  if (card.defaultOutputModes) {
    validateMimeTypes(card.defaultOutputModes, 'defaultOutputModes');
  }

  // Provider validation
  if (card.provider) {
    if (!card.provider.organization) {
      errors.push({ 
        path: 'provider.organization', 
        message: 'Provider organization is required', 
        severity: 'error' 
      });
    }
    if (!card.provider.url) {
      errors.push({ 
        path: 'provider.url', 
        message: 'Provider URL is required', 
        severity: 'error' 
      });
    } else if (!isValidUrl(card.provider.url)) {
      errors.push({ 
        path: 'provider.url', 
        message: 'Invalid provider URL format', 
        severity: 'error' 
      });
    }
  }

  // Additional interfaces validation
  if (card.additionalInterfaces && Array.isArray(card.additionalInterfaces)) {
    card.additionalInterfaces.forEach((iface: AgentInterface, index: number) => {
      if (!iface.url) {
        errors.push({ 
          path: `additionalInterfaces[${index}].url`, 
          message: 'Interface URL is required', 
          severity: 'error' 
        });
      } else if (!isValidUrl(iface.url)) {
        errors.push({ 
          path: `additionalInterfaces[${index}].url`, 
          message: 'Invalid interface URL format', 
          severity: 'error' 
        });
      }

      if (!iface.transport) {
        errors.push({ 
          path: `additionalInterfaces[${index}].transport`, 
          message: 'Interface transport is required', 
          severity: 'error' 
        });
      } else if (!validTransports.includes(iface.transport)) {
        errors.push({ 
          path: `additionalInterfaces[${index}].transport`, 
          message: `Invalid transport. Must be one of: ${validTransports.join(', ')}`, 
          severity: 'error' 
        });
      }
    });
  }

  console.log(errors);

  return errors;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidVersion(version: string): boolean {
  const semverRegex = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?(?:\+[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?$/;
  return semverRegex.test(version);
}

function isValidMimeType(mimeType: string): boolean {
  const mimeRegex = /^[a-zA-Z][a-zA-Z0-9][a-zA-Z0-9!#$&\-\^]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^]*$/;
  return mimeRegex.test(mimeType);
}

export function getValidationSummary(errors: ValidationError[]) {
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  const infoCount = errors.filter(e => e.severity === 'info').length;

  return {
    total: errors.length,
    errors: errorCount,
    warnings: warningCount,
    info: infoCount,
    isValid: errorCount === 0
  };
}