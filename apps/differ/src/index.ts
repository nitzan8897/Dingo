import 'dotenv/config';
import { fetchNewCases } from './fetchCases';
import { analyzeCaseWithAI } from './analyzeCase';
import { saveCaseAnalysis } from './saveToDb';

async function main() {
  console.log('');
  console.log('🦴 ════════════════════════════════════════════════════════');
  console.log('🦴  Differ - Dingo Court Case Analysis Service');
  console.log('🦴 ════════════════════════════════════════════════════════');
  console.log('');

  const startTime = Date.now();

  try {
    // ========================================================================
    // STEP 1: Fetch new cases
    // ========================================================================
    console.log('📥 STEP 1: Fetching new cases...');
    const cases = await fetchNewCases();
    console.log(`   Found ${cases.length} cases to process`);
    console.log('');

    if (cases.length === 0) {
      console.log('✅ No new cases to process. Exiting.');
      return;
    }

    // ========================================================================
    // STEP 2: Process each case
    // ========================================================================
    console.log('🤖 STEP 2: Analyzing and saving cases...');
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < cases.length; i++) {
      const rawCase = cases[i];
      const caseNum = i + 1;

      console.log(`─────────────────────────────────────────────────────────`);
      console.log(`Processing case ${caseNum}/${cases.length}: ${rawCase.id}`);
      console.log(`─────────────────────────────────────────────────────────`);

      try {
        // Analyze the case with AI
        const analysis = await analyzeCaseWithAI(rawCase.text);
        console.log(`  📋 Title: ${analysis.title}`);
        console.log(`  ⚖️  Specialty: ${analysis.specialty}`);
        console.log(`  🏆 Result: ${analysis.result}`);
        console.log(`  👨‍⚖️ Judge: ${analysis.judgeName || 'N/A'}`);
        console.log(`  👥 Lawyers: ${analysis.lawyers.length}`);
        console.log('');

        // Save to database via API
        await saveCaseAnalysis(rawCase, analysis);
        console.log('');

        successCount++;
      } catch (err) {
        errorCount++;
        console.error(`❌ Failed to process case ${rawCase.id}:`);
        console.error(`   ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('');

        // Continue processing other cases even if one fails
        if (process.env.STOP_ON_ERROR === 'true') {
          throw err;
        }
      }
    }

    // ========================================================================
    // STEP 3: Summary
    // ========================================================================
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('════════════════════════════════════════════════════════');
    console.log('📊 Processing Summary');
    console.log('════════════════════════════════════════════════════════');
    console.log(`✅ Successfully processed: ${successCount} cases`);
    console.log(`❌ Failed: ${errorCount} cases`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log('════════════════════════════════════════════════════════');
    console.log('');

    if (errorCount === 0) {
      console.log('🎉 All cases processed successfully!');
    } else {
      console.log('⚠️  Some cases failed to process. Review the logs above.');
    }
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════');
    console.error('💥 Fatal Error in Differ');
    console.error('═══════════════════════════════════════════════════════');
    console.error(error);
    console.error('');
    process.exit(1);
  }
}

// ============================================================================
// Entry point
// ============================================================================

main().catch((err) => {
  console.error('Uncaught error:', err);
  process.exit(1);
});
