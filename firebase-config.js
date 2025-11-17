// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB42anRB-kvcpXwvOgRMRYnKiCoFYSkf7I",
    authDomain: "business-manager-f5b68.firebaseapp.com",
    projectId: "business-manager-f5b68",
    storageBucket: "business-manager-f5b68.firebasestorage.app",
    messagingSenderId: "426725406348",
    appId: "1:426725406348:web:10f303180e4143a052ada9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();

// Company ID - since no authentication, we use a fixed company
const COMPANY_ID = "medisupply_hub_company";

// Initialize essential accounts with 5 million seed capital
function initializeEssentialAccounts() {
    const essentialAccounts = [
        // Only keep essential accounts
        { code: "1001", name: "Cash", type: "asset", category: "current_asset", balance: 5000000 },
        { code: "3001", name: "Owner's Capital", type: "equity", category: "capital", balance: 5000000 },
        { code: "6000", name: "Expense Account", type: "expense", category: "operating", balance: 0 }
    ];

    essentialAccounts.forEach(account => {
        db.collection('companies').doc(COMPANY_ID).collection('chart_of_accounts')
            .doc(account.code)
            .set(account)
            .then(() => {
                console.log('Account created: ' + account.code + ' - ' + account.name);
            })
            .catch(error => {
                console.error('Error creating account: ', error);
            });
    });
}

// Check and initialize essential accounts when app starts
document.addEventListener('DOMContentLoaded', function() {
    // Check if essential accounts exist, if not create them
    db.collection('companies').doc(COMPANY_ID).collection('chart_of_accounts').doc('1001')
        .get()
        .then(doc => {
            if (!doc.exists) {
                initializeEssentialAccounts();
            }
        })
        .catch(error => {
            console.error('Error checking accounts:', error);
            initializeEssentialAccounts();
        });
});

// Utility function to format currency
function formatCurrency(amount) {
    return '₦' + (amount || 0).toLocaleString();
}

// Utility function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.seconds ? 
        new Date(timestamp.seconds * 1000) : 
        new Date(timestamp);
    
    return date.toLocaleDateString('en-NG');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { db, COMPANY_ID, formatCurrency, formatDate };
}
