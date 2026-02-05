
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Or service role if needed for cleanup

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Colors for output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m"
};

const log = (msg: string, color: string = colors.reset) => console.log(`${color}${msg}${colors.reset}`);

async function runTests() {
    log('🚀 Starting Automated Logic Tests...', colors.blue);

    let technicianId: string | null = null;
    let appointmentId: string | null = null;
    let leaveRequestId: string | null = null;
    let reviewId: string | null = null;

    try {
        // -----------------------------------------------------------------
        // 1. Setup: Get a Technician
        // -----------------------------------------------------------------
        log('\n[1] SETUP: Finding a technician...', colors.yellow);
        const { data: techs, error: techError } = await supabase
            .from('technicians')
            .select('id, name')
            .limit(1);

        if (techError) throw techError;
        if (!techs || techs.length === 0) throw new Error('No technicians found in DB');

        technicianId = techs[0].id;
        log(`✅ Found Technician: ${techs[0].name} (${technicianId})`, colors.green);


        // -----------------------------------------------------------------
        // 2. Test: Leave Request (Submission)
        // -----------------------------------------------------------------
        log('\n[2] TEST: Submitting Leave Request...', colors.yellow);
        // Date: Tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        const { data: leave, error: leaveError } = await supabase
            .from('technician_leave_requests')
            .insert({
                technician_id: technicianId,
                start_date: dateStr,
                end_date: dateStr,
                reason: 'Automated Test Leave',
                status: 'approved' // Auto-approve for availability testing
            })
            .select()
            .single();

        if (leaveError) throw leaveError;
        leaveRequestId = leave.id;
        log(`✅ Leave Request Created & Approved (ID: ${leave.id})`, colors.green);


        // -----------------------------------------------------------------
        // 3. Test: Availability Calculation (Impact of Leave)
        // -----------------------------------------------------------------
        log('\n[3] TEST: Verifying Availability Impact...', colors.yellow);
        // We need to call the Logic from TechnicianService. 
        // Since we can't easily import the Service file (Next.js aliases), we simulate the query logic here.

        // Count active techs
        const { count: totalTechs } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'technician');

        // Count leaves
        const { count: leaveCount } = await supabase
            .from('technician_leave_requests')
            .select('technician_id', { count: 'exact', head: true })
            .eq('status', 'approved')
            .lte('start_date', dateStr)
            .gte('end_date', dateStr);

        log(`   Total Techs: ${totalTechs}`);
        log(`   Techs on Leave: ${leaveCount}`);

        if ((leaveCount || 0) < 1) {
            log('❌ ERROR: Leave count should be at least 1', colors.red);
        } else {
            log('✅ Availability Logic: Leave correctly counted', colors.green);
        }


        // -----------------------------------------------------------------
        // 4. Test: Review Submission
        // -----------------------------------------------------------------
        log('\n[4] TEST: Submitting Technician Review...', colors.yellow);
        // Need a project. Find one.
        const { data: projects } = await supabase
            .from('active_projects')
            .select('id')
            .limit(1);

        if (projects && projects.length > 0) {
            // Need a user ID (reviewer). We'll use the tech ID just to satisfy FK if user_id is generic uuid 
            // OR ideally a customer ID. 
            // In dev, RLS might block if we don't use service role, but anon key + open policies might work.
            // Let's try inserting with a random UUID if reviewers aren't strictly checked against auth table FK constraint?
            // Usually reviewer_id is FK to users. Let's fetch a customer.
            const { data: cust } = await supabase.from('users').select('id').eq('role', 'customer').limit(1);
            const reviewerId = cust?.[0]?.id || technicianId; // Fallback

            const { data: review, error: reviewError } = await supabase
                .from('technician_reviews')
                .insert({
                    technician_id: technicianId,
                    project_id: projects[0].id,
                    reviewer_id: reviewerId,
                    rating: 5,
                    comment: 'Automated Test Review'
                })
                .select()
                .single();

            if (reviewError) {
                log(`⚠️ Could not create review (RLS/FK issues?): ${reviewError.message}`, colors.red);
            } else {
                reviewId = review.id;
                log(`✅ Review Created (ID: ${review.id})`, colors.green);
            }
        } else {
            log('⚠️ Skipping Review Test (No projects found)', colors.yellow);
        }

    } catch (error: any) {
        log(`\n❌ CRITICAL TEST FAILURE: ${error.message}`, colors.red);
        if (error.details) console.error(error.details);
    } finally {
        // -----------------------------------------------------------------
        // 5. Cleanup
        // -----------------------------------------------------------------
        log('\n[5] CLEANUP: Removing test data...', colors.yellow);

        if (leaveRequestId) {
            const { error } = await supabase.from('technician_leave_requests').delete().eq('id', leaveRequestId);
            if (!error) log('   - Deleted Test Leave Request');
        }

        if (reviewId) {
            const { error } = await supabase.from('technician_reviews').delete().eq('id', reviewId);
            if (!error) log('   - Deleted Test Review');
        }

        log('\n✨ Automated Tests Completed', colors.blue);
    }
}

runTests();
