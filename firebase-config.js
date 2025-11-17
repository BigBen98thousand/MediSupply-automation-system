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

// Initialize default chart of accounts if not exists
function initializeChartOfAccounts() {
    const defaultAccounts = [
        // Assets
        { code: "1001", name: "Cash", type: "asset", category: "current_asset", balance: 0 },
        { code: "1002", name: "Bank Account", type: "asset", category: "current_asset", balance: 0 },
        { code: "1101", name: "Accounts Receivable", type: "asset", category: "current_asset", balance: 0 },
        { code: "1201", name: "Inventory", type: "asset", category: "current_asset", balance: 0 },
        { code: "1301", name: "Equipment", type: "asset", category: "fixed_asset", balance: 0 },
        { code: "1302", name: "Furniture & Fixtures", type: "asset", category: "fixed_asset", balance: 0 },
        
        // Liabilities
        { code: "2001", name: "Accounts Payable", type: "liability", category: "current_liability", balance: 0 },
        { code: "2002", name: "Loans Payable", type: "liability", category: "current_liability", balance: 0 },
        { code: "2101", name: "VAT Payable", type: "liability", category: "current_liability", balance: 0 },
        
        // Equity
        { code: "3001", name: "Owner's Capital", type: "equity", category: "capital", balance: 0 },
        { code: "3002", name: "Owner's Drawings", type: "equity", category: "capital", balance: 0 },
        { code: "3101", name: "Retained Earnings", type: "equity", category: "retained_earnings", balance: 0 },
        
        // Revenue
        { code: "4001", name: "Medical Supplies Sales", type: "revenue", category: "sales", balance: 0 },
        { code: "4002", name: "Equipment Sales", type: "revenue", category: "sales", balance: 0 },
        { code: "4003", name: "Service Revenue", type: "revenue", category: "sales", balance: 0 },
        
        // Expenses
        { code: "5001", name: "Cost of Goods Sold", type: "expense", category: "cogs", balance: 0 },
        { code: "5101", name: "Transport Expenses", type: "expense", category: "operating", balance: 0 },
        { code: "5102", name: "Utilities", type: "expense", category: "operating", balance: 0 },
        { code: "5103", name: "Marketing & Advertising", type: "expense", category: "operating", balance: 0 },
        { code: "5104", name: "Salaries & Wages", type: "expense", category: "operating", balance: 0 },
        { code: "5105", name: "Rent Expense", type: "expense", category: "operating", balance: 0 },
        { code: "5106", name: "Office Supplies", type: "expense", category: "operating", balance: 0 },
        { code: "5107", name: "Maintenance & Repairs", type: "expense", category: "operating", balance: 0 },
        { code: "5108", name: "Insurance", type: "expense", category: "operating", balance: 0 },
        { code: "5109", name: "Professional Fees", type: "expense", category: "operating", balance: 0 },
        { code: "5110", name: "Bank Charges", type: "expense", category: "operating", balance: 0 }
    ];

    defaultAccounts.forEach(account => {
        db.collection('companies').doc(COMPANY_ID).collection('chart_of_accounts')
            .doc(account.code)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    account.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    db.collection('companies').doc(COMPANY_ID).collection('chart_of_accounts')
                        .doc(account.code)
                        .set(account)
                        .then(() => {
                            console.log('Account created: ' + account.code + ' - ' + account.name);
                        })
                        .catch(error => {
                            console.error('Error creating account: ', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking account: ', error);
            });
    });
}

// Initialize default products if not exists
function initializeDefaultProducts() {
    const defaultProducts = [
        {
            name: "Medical Gloves",
            category: "Medical Consumables",
            stockQuantity: 1000,
            unitCost: 80,
            sellingPrice: 150,
            reorderLevel: 100
        },
        {
            name: "Face Masks",
            category: "PPE",
            stockQuantity: 2000,
            unitCost: 30,
            sellingPrice: 50,
            reorderLevel: 200
        },
        {
            name: "COVID-19 Test Kits",
            category: "Diagnostic",
            stockQuantity: 500,
            unitCost: 1200,
            sellingPrice: 1800,
            reorderLevel: 50
        },
        {
            name: "Hand Sanitizer",
            category: "Medical Consumables",
            stockQuantity: 300,
            unitCost: 400,
            sellingPrice: 600,
            reorderLevel: 30
        }
    ];

    // Check if products collection is empty
    db.collection('companies').doc(COMPANY_ID).collection('products')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                // Add default products
                defaultProducts.forEach(product => {
                    product.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    product.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    
                    db.collection('companies').doc(COMPANY_ID).collection('products')
                        .add(product)
                        .then(() => {
                            console.log('Default product added: ' + product.name);
                        })
                        .catch(error => {
                            console.error('Error adding default product: ', error);
                        });
                });
            }
        })
        .catch(error => {
            console.error('Error checking products: ', error);
        });
}

// Initialize some sample data for demonstration
function initializeSampleData() {
    // Check if we have any journal entries
    db.collection('companies').doc(COMPANY_ID).collection('journal_entries')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                // Add initial capital investment
                const initialCapitalEntry = {
                    date: new Date(),
                    reference: 'INIT-001',
                    description: 'Initial capital investment to start business',
                    lineItems: [
                        {
                            accountCode: '1001',
                            accountName: 'Cash',
                            accountType: 'asset',
                            debit: 7500000,
                            credit: 0,
                            amount: 7500000,
                            description: 'Initial capital cash injection'
                        },
                        {
                            accountCode: '3001',
                            accountName: "Owner's Capital",
                            accountType: 'equity',
                            debit: 0,
                            credit: 7500000,
                            amount: 7500000,
                            description: 'Initial capital investment'
                        }
                    ],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: 'System'
                };

                db.collection('companies').doc(COMPANY_ID).collection('journal_entries')
                    .add(initialCapitalEntry)
                    .then(() => {
                        console.log('Initial capital entry added');
                        
                        // Update account balances
                        db.collection('companies').doc(COMPANY_ID).collection('chart_of_accounts')
                            .doc('1001')
                            .update({ balance: 7500000 });
                            
                        db.collection('companies').doc(COMPANY_ID).collection('chart_of_accounts')
                            .doc('3001')
                            .update({ balance: 7500000 });
                    })
                    .catch(error => {
                        console.error('Error adding initial capital: ', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error checking journal entries: ', error);
        });
}

// Initialize when app starts
document.addEventListener('DOMContentLoaded', function() {
    initializeChartOfAccounts();
    initializeDefaultProducts();
    
    // Wait a bit before initializing sample data to ensure accounts are created
    setTimeout(initializeSampleData, 2000);
});

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

// Utility function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.seconds ? 
        new Date(timestamp.seconds * 1000) : 
        new Date(timestamp);
    
    return date.toLocaleDateString('en-NG');
}

// Utility function to get current month and year for reports
function getCurrentMonthYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return year + '-' + month;
}

// Export for use in other files (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { db, COMPANY_ID, formatCurrency, formatDate };
            }
