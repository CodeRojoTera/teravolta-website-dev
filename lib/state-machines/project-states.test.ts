// lib/state-machines/project-states.test.ts

import { describe, it, expect } from 'vitest';
import { canTransition, getValidTransitions, getInitialStatus } from './project-states';

describe('Project State Machine', () => {

  describe('canTransition - Efficiency Service', () => {
    it('allows valid transition: pending_onboarding -> pending_payment', () => {
      const result = canTransition('pending_onboarding', 'pending_payment', 'efficiency', false);
      expect(result.valid).toBe(true);
    });

    it('allows valid transition: pending_payment -> pending_scheduling', () => {
      const result = canTransition('pending_payment', 'pending_scheduling', 'efficiency', false);
      expect(result.valid).toBe(true);
    });

    it('allows transition to cancelled from any non-terminal state', () => {
      const result = canTransition('pending_scheduling', 'cancelled', 'efficiency', false);
      expect(result.valid).toBe(true);
    });

    it('blocks invalid skip: pending_onboarding -> completed', () => {
      const result = canTransition('pending_onboarding', 'completed', 'efficiency', false);
      expect(result.valid).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('blocks transition from terminal state: completed -> pending_payment', () => {
      const result = canTransition('completed', 'pending_payment', 'efficiency', false);
      expect(result.valid).toBe(false);
    });

    it('allows admin override for invalid transition', () => {
      const result = canTransition('pending_onboarding', 'completed', 'efficiency', true);
      expect(result.valid).toBe(true);
      expect(result.reason).toBe('admin_override');
    });
  });

  describe('canTransition - Consulting Service', () => {
    it('allows valid transition: pending_requirements -> requirements_defined', () => {
      const result = canTransition('pending_requirements', 'requirements_defined', 'consulting', false);
      expect(result.valid).toBe(true);
    });

    it('allows valid transition: requirements_defined -> rfp_preparation', () => {
      const result = canTransition('requirements_defined', 'rfp_preparation', 'consulting', false);
      expect(result.valid).toBe(true);
    });

    it('allows full consulting flow', () => {
      const flow = [
        'pending_requirements',
        'requirements_defined',
        'rfp_preparation',
        'rfp_published',
        'offers_evaluation',
        'supplier_selection',
        'contract_negotiation',
        'completed'
      ];

      for (let i = 0; i < flow.length - 1; i++) {
        const result = canTransition(flow[i], flow[i + 1], 'consulting', false);
        expect(result.valid).toBe(true);
      }
    });

    it('blocks skipping steps in consulting flow', () => {
      const result = canTransition('pending_requirements', 'offers_evaluation', 'consulting', false);
      expect(result.valid).toBe(false);
    });
  });

  describe('canTransition - Advocacy Service', () => {
    it('allows valid transition: pending_audit -> audit_in_progress', () => {
      const result = canTransition('pending_audit', 'audit_in_progress', 'advocacy', false);
      expect(result.valid).toBe(true);
    });

    it('allows transition to claim_filed after claim_ready', () => {
      const result = canTransition('claim_ready', 'claim_filed', 'advocacy', false);
      expect(result.valid).toBe(true);
    });

    it('blocks skipping audit: pending_audit -> claim_formulation', () => {
      const result = canTransition('pending_audit', 'claim_formulation', 'advocacy', false);
      expect(result.valid).toBe(false);
    });

    it('allows full advocacy flow', () => {
      const flow = [
        'pending_audit',
        'audit_in_progress',
        'audit_complete',
        'claim_formulation',
        'claim_ready',
        'claim_filed',
        'distributor_negotiating',
        'asep_filed',
        'asep_negotiating',
        'resolved',
        'recovery_received'
      ];

      for (let i = 0; i < flow.length - 1; i++) {
        const result = canTransition(flow[i], flow[i + 1], 'advocacy', false);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('getValidTransitions', () => {
    it('returns valid next statuses for efficiency pending_payment', () => {
      const transitions = getValidTransitions('pending_payment', 'efficiency');
      expect(transitions).toContain('pending_scheduling');
      expect(transitions).toContain('cancelled');
      expect(transitions).not.toContain('completed');
    });

    it('returns empty array for terminal states', () => {
      const transitions = getValidTransitions('completed', 'efficiency');
      expect(transitions).toEqual([]);
    });

    it('returns consulting-specific transitions', () => {
      const transitions = getValidTransitions('requirements_defined', 'consulting');
      expect(transitions).toContain('rfp_preparation');
      expect(transitions).toContain('cancelled');
    });

    it('returns advocacy-specific transitions', () => {
      const transitions = getValidTransitions('claim_ready', 'advocacy');
      expect(transitions).toContain('claim_filed');
      expect(transitions).toContain('cancelled');
    });
  });

  describe('getInitialStatus', () => {
    it('returns pending_onboarding for efficiency', () => {
      expect(getInitialStatus('efficiency')).toBe('pending_onboarding');
    });

    it('returns pending_requirements for consulting', () => {
      expect(getInitialStatus('consulting')).toBe('pending_requirements');
    });

    it('returns pending_audit for advocacy', () => {
      expect(getInitialStatus('advocacy')).toBe('pending_audit');
    });
  });

});
