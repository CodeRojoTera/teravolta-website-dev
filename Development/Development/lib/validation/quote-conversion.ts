export type QuoteConversionData = {
    service?: string | null;
    amount?: number | string | null;
    phases?: Array<any>;
    timeline?: string | null;
    budget?: string | number | null;
    projectDescription?: string | null;
    claimType?: string | null;
    distributorCompany?: string | null;
    claimAmount?: number | string | null;
    incidentDate?: string | null;
    damageDescription?: string | null;
};

type ReadinessResult = {
    ready: boolean;
    missing: string[];
    warnings: string[];
};

const EPSILON = 0.01;

const normalizeService = (service?: string | null): 'consulting' | 'advocacy' | 'efficiency' | null => {
    if (!service) return null;
    const normalized = service.toLowerCase();
    if (normalized.includes('consult')) return 'consulting';
    if (normalized.includes('advocacy') || normalized.includes('abog')) return 'advocacy';
    if (normalized.includes('efficiency') || normalized.includes('eficien')) return 'efficiency';
    return null;
};

const toNumber = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    return false;
};

const parseServiceSpecific = (input: any): Record<string, any> => {
    if (!input) return {};
    const raw = input.service_specific_fields ?? input.serviceSpecificFields;
    if (!raw) return {};
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw) || {};
        } catch {
            return {};
        }
    }
    if (typeof raw === 'object') return raw;
    return {};
};

export const normalizeQuoteForConversion = (input: QuoteConversionData | any): QuoteConversionData => {
    const serviceSpecific = parseServiceSpecific(input);

    const readValue = (camel: string, snake: string, fallbackCamel?: string, fallbackSnake?: string) => {
        return (
            input?.[camel] ??
            input?.[snake] ??
            input?.[fallbackCamel || camel] ??
            input?.[fallbackSnake || snake] ??
            serviceSpecific?.[camel] ??
            serviceSpecific?.[snake] ??
            serviceSpecific?.[fallbackCamel || camel] ??
            serviceSpecific?.[fallbackSnake || snake]
        );
    };

    const phases =
        input?.phases ??
        input?.payment_phases ??
        input?.paymentPhases ??
        serviceSpecific?.phases ??
        serviceSpecific?.payment_phases ??
        serviceSpecific?.paymentPhases ??
        [];

    return {
        service: input?.service ?? serviceSpecific?.service ?? null,
        amount: readValue('amount', 'amount', 'quoteAmount', 'quote_amount') ?? null,
        phases: Array.isArray(phases) ? phases : [],
        timeline: readValue('timeline', 'timeline', 'clientTimeline', 'client_timeline') ?? null,
        budget: readValue('budget', 'budget') ?? null,
        projectDescription: readValue('projectDescription', 'project_description', 'description', 'description') ?? null,
        claimType: readValue('claimType', 'claim_type') ?? null,
        distributorCompany: readValue('distributorCompany', 'distributor_company') ?? null,
        claimAmount: readValue('claimAmount', 'claim_amount') ?? null,
        incidentDate: readValue('incidentDate', 'incident_date') ?? null,
        damageDescription: readValue('damageDescription', 'damage_description') ?? null,
    };
};

export const getQuoteConversionReadiness = (input: QuoteConversionData | any): ReadinessResult => {
    const normalized = normalizeQuoteForConversion(input);
    const service = normalizeService(normalized.service);
    const missing = new Set<string>();
    const warnings: string[] = [];

    const requireField = (key: string, value: unknown) => {
        if (isEmpty(value)) {
            missing.add(key);
        }
    };

    if (service === 'consulting') {
        requireField('timeline', normalized.timeline);
        requireField('budget', normalized.budget);
        requireField('projectDescription', normalized.projectDescription);

        const amountValue = toNumber(normalized.amount);
        const phases = Array.isArray(normalized.phases) ? normalized.phases : [];
        const requiresPhases = amountValue !== null && amountValue > 0;

        if (requiresPhases && phases.length === 0) {
            missing.add('phases');
        }

        if (phases.length > 0) {
            let total = 0;
            let missingPhaseName = false;
            let missingPhaseAmount = false;

            phases.forEach((phase) => {
                const name = phase?.name ?? phase?.phase_name ?? phase?.title;
                const phaseAmount = toNumber(phase?.amount ?? phase?.phase_amount ?? phase?.value);

                if (isEmpty(name)) {
                    missingPhaseName = true;
                }

                if (phaseAmount === null || phaseAmount <= 0) {
                    missingPhaseAmount = true;
                }

                if (phaseAmount !== null) {
                    total += phaseAmount;
                }
            });

            if (missingPhaseName) {
                missing.add('phaseName');
            }

            if (missingPhaseAmount) {
                missing.add('phaseAmount');
            }

            if (amountValue !== null && amountValue > 0 && Math.abs(total - amountValue) > EPSILON) {
                missing.add('phaseTotals');
                warnings.push('phase_total_mismatch');
            }
        }
    }

    if (service === 'advocacy') {
        requireField('claimType', normalized.claimType);
        requireField('distributorCompany', normalized.distributorCompany);
        const claimAmount = toNumber(normalized.claimAmount);
        if (claimAmount === null || claimAmount <= 0) {
            missing.add('claimAmount');
        }
        requireField('incidentDate', normalized.incidentDate);
        requireField('damageDescription', normalized.damageDescription);
    }

    return {
        ready: missing.size === 0,
        missing: Array.from(missing),
        warnings,
    };
};
