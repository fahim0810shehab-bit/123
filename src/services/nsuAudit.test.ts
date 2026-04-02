import { describe, it, expect } from 'vitest';
import { validateNsuCourse, getGradeStatus } from './nsuAudit';

describe('NSU Audit Services', () => {
    describe('validateNsuCourse', () => {
        it('should validate correct NSU courses', () => {
            expect(validateNsuCourse('CSE115')).toBe(true);
            expect(validateNsuCourse('CSE 115')).toBe(true);
            expect(validateNsuCourse('cse115')).toBe(true);
            expect(validateNsuCourse('CSE115L')).toBe(true);
        });

        it('should reject invalid NSU courses', () => {
            expect(validateNsuCourse('INVALID101')).toBe(false);
            expect(validateNsuCourse('XYZ999')).toBe(false);
        });
    });

    describe('getGradeStatus', () => {
        it('should correctly identify passing grades', () => {
            const status = getGradeStatus('A');
            expect(status.earnsCredit).toBe(true);
            expect(status.isValid).toBe(true);
        });

        it('should correctly identify failing grades', () => {
            const status = getGradeStatus('F');
            expect(status.earnsCredit).toBe(false);
            expect(status.isValid).toBe(true);
        });

        it('should correctly identify non-credit grades', () => {
            const status = getGradeStatus('W');
            expect(status.earnsCredit).toBe(false);
            expect(status.isValid).toBe(true);
        });

        it('should reject invalid grades', () => {
            const status = getGradeStatus('Z');
            expect(status.earnsCredit).toBe(false);
            expect(status.isValid).toBe(false);
        });
    });
});
