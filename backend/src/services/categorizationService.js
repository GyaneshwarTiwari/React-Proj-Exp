// server/services/categorizationService.js
// Lightweight keyword-based categorizer. Good for MVP.
// It exposes `categorize(description, fallbackCategory)` which returns a category string.

const KEYWORD_MAP = [
    { keywords: ['grocery', 'groceries', 'supermarket', 'mart'], category: 'Food' },
    { keywords: ['uber', 'ola', 'taxi', 'cab', 'ride'], category: 'Transportation' },
    { keywords: ['rent', 'apartment', 'landlord'], category: 'Housing' },
    { keywords: ['coffee', 'starbucks', 'cafe'], category: 'Food' },
    { keywords: ['amazon', 'flipkart', 'shopping'], category: 'Shopping' },
    { keywords: ['salary', 'payroll', 'salary credit'], category: 'Income' },
    { keywords: ['gym', 'fitness'], category: 'Health' },
    // add as needed
];

/**
 * categorize
 * @param {String} description
 * @param {String} fallbackCategory
 * @returns {String}
 */
function categorize(description = '', fallbackCategory = 'Uncategorized') {
    if (!description || typeof description !== 'string') return fallbackCategory;
    const text = description.toLowerCase();

    for (const map of KEYWORD_MAP) {
        for (const kw of map.keywords) {
            if (text.includes(kw)) return map.category;
        }
    }

    return fallbackCategory;
}

module.exports = { categorize };
