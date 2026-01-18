import { supabase } from './supabase';

type ClientType = 'residential' | 'commercial' | 'both' | null;

/**
 * Determines the client category from a property type
 * - residential, apartment → 'residential'
 * - small-business, office, industrial → 'commercial'
 */
export function getClientCategory(propertyType: string): 'residential' | 'commercial' | null {
    const residentialTypes = ['residential', 'apartment'];
    const commercialTypes = ['small-business', 'office', 'industrial'];

    if (residentialTypes.includes(propertyType)) {
        return 'residential';
    }
    if (commercialTypes.includes(propertyType)) {
        return 'commercial';
    }
    return null;
}

/**
 * Updates the client type for a user based on their submitted quotes
 * This should be called after a quote is submitted with a valid property type
 * 
 * @param email - The email of the user who submitted the quote
 * @param newPropertyType - The property type from the new quote
 */
export async function updateClientType(email: string, newPropertyType: string): Promise<void> {
    try {
        // Find user by email
        const { data: userData, error } = await supabase
            .from('users')
            .select('id, client_type')
            .eq('email', email)
            .maybeSingle();

        if (error || !userData) {
            // User not registered yet, nothing to update
            return;
        }

        const currentClientType = userData.client_type as ClientType;

        // Determine the category of the new property type
        const newCategory = getClientCategory(newPropertyType);
        if (!newCategory) {
            // Invalid or empty property type, skip
            return;
        }

        let updatedClientType: ClientType = newCategory;

        // If user already has a client type, check if we need to update to 'both'
        if (currentClientType) {
            if (currentClientType === 'both') {
                // Already 'both', no change needed
                return;
            }
            if (currentClientType !== newCategory) {
                // User has submitted for a different category, update to 'both'
                updatedClientType = 'both';
            } else {
                // Same category, no change needed
                return;
            }
        }

        // Update the user document
        await supabase
            .from('users')
            .update({ client_type: updatedClientType })
            .eq('id', userData.id);

        console.log(`Updated clientType for ${email}: ${currentClientType} → ${updatedClientType}`);
    } catch (error) {
        console.error('Error updating client type:', error);
        // Don't throw - this is a non-critical operation
    }
}

/**
 * Associates all existing quotes with a newly registered user
 * Called after successful user registration
 * 
 * @param userId - The user ID of the new user
 * @param email - The email of the new user
 */
export async function associateQuotesWithUser(userId: string, email: string): Promise<void> {
    try {
        // Find all quotes with this email
        const { data: quotes, error } = await supabase
            .from('quotes')
            .select('id, property_type, user_id')
            .eq('email', email);

        if (error || !quotes || quotes.length === 0) {
            console.log(`No existing quotes found for ${email}`);
            return;
        }

        // Collect all property types to determine clientType
        const propertyTypes: string[] = [];

        // Update each quote with userId
        // Doing loop to minimize logic changes, but could be one update query
        const quotesToUpdate = quotes.filter(q => !q.user_id).map(q => q.id);

        if (quotesToUpdate.length > 0) {
            await supabase
                .from('quotes')
                .update({ user_id: userId })
                .in('id', quotesToUpdate);
        }

        quotes.forEach(q => {
            if (q.property_type) propertyTypes.push(q.property_type);
        });

        console.log(`Associated ${quotes.length} quotes with user ${userId}`);

        // Calculate clientType from all historical property types
        if (propertyTypes.length > 0) {
            let hasResidential = false;
            let hasCommercial = false;

            for (const pt of propertyTypes) {
                const category = getClientCategory(pt);
                if (category === 'residential') hasResidential = true;
                if (category === 'commercial') hasCommercial = true;
            }

            let clientType: ClientType = null;
            if (hasResidential && hasCommercial) {
                clientType = 'both';
            } else if (hasResidential) {
                clientType = 'residential';
            } else if (hasCommercial) {
                clientType = 'commercial';
            }

            if (clientType) {
                await supabase
                    .from('users')
                    .update({ client_type: clientType })
                    .eq('id', userId);

                console.log(`Set clientType for ${email}: ${clientType}`);
            }
        }
    } catch (error) {
        console.error('Error associating quotes with user:', error);
        // Don't throw - this is a non-critical operation
    }
}

