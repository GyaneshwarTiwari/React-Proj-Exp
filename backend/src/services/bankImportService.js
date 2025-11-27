// server/services/bankImportService.js
// Mocked bank import service for MVP. Returns an array of transactions
// Each returned transaction includes an externalId (stable across imports)
// In production integrate with Plaid-like services and OAuth flows.

const { v4: uuidv4 } = require('uuid');

/**
 * importFromBank (mock)
 * @param {String} bankAccountId
 * @param {ObjectId} userId
 * @returns {Promise<Array<Object>>} array of transactions
 *
 * Each transaction:
 * {
 *   externalId: 'bank-<bankAccountId>-<unique>',
 *   amount: Number,
 *   date: ISOString,
 *   description: String,
 *   category: String | null
 * }
 */
async function importFromBank(bankAccountId, userId) {
    // Simulate calling external bank API and mapping the response.
    // IMPORTANT: The externalId MUST be stable for a given transaction so imports are idempotent.
    // Here we simply mock a few transactions — in real life you'd map bank txn id -> externalId.

    // Example mocked transactions; in a real connector you would parse bank-provided IDs
    const now = new Date();
    const sample = [
        {
            externalId: `bank_${bankAccountId}_txn_${uuidv4()}`,
            amount: 250.0,
            date: new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 3)).toISOString(),
            description: 'Grocery Store',
            merchant: 'Grocery Store',
            category: null // leave for categorization service to fill
        },
        {
            externalId: `bank_${bankAccountId}_txn_${uuidv4()}`,
            amount: 1200.0,
            date: new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 10)).toISOString(),
            description: 'Monthly Rent',
            merchant: 'Landlord',
            category: 'Housing'
        }
    ];

    // simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 250));

    return sample;
}

module.exports = {
    importFromBank
};