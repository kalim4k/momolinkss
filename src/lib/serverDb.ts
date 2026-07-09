/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'server_db.json');

// Ensure data directory exists
const dir = path.dirname(DB_FILE_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export interface ServerPurchase {
  id: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerFirstName: string;
  buyerLastName: string;
  contentId: string;
  status: 'pending' | 'completed' | 'failed';
  paymentReference: string; // cartId
  amountPaid: number;
  commissionAmount: number;
  creatorNetAmount: number;
  createdAt: string;
  purchasedAt?: string;
}

export interface ServerTransaction {
  id: string;
  provider: 'maketou';
  providerTransactionId: string; // cartId
  status: 'pending' | 'success' | 'failed';
  type: 'purchase' | 'subscription';
  createdAt: string;
}

export interface ServerSubscription {
  id: string;
  creatorId: string;
  transactionId?: string | null;
  amountPaid: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
}


export interface ServerNotification {
  id: string;
  userId: string; // creator's user_id or creator_id
  type: 'new_sale' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DBStructure {
  purchases: ServerPurchase[];
  transactions: ServerTransaction[];
  notifications: ServerNotification[];
  subscriptions: ServerSubscription[];
}

function loadDB(): DBStructure {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const defaultDB: DBStructure = { purchases: [], transactions: [], notifications: [], subscriptions: [] };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultDB, null, 2), 'utf-8');
    return defaultDB;
  }
  try {
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const db = JSON.parse(content);
    db.subscriptions = db.subscriptions || [];
    return db;
  } catch (err) {
    console.error('Error loading server DB:', err);
    return { purchases: [], transactions: [], notifications: [], subscriptions: [] };
  }
}


function saveDB(db: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving server DB:', err);
  }
}

export const serverDb = {
  getPurchases(): ServerPurchase[] {
    return loadDB().purchases;
  },

  getPurchase(id: string): ServerPurchase | undefined {
    return loadDB().purchases.find(p => p.id === id);
  },

  getPurchaseByCart(cartId: string): ServerPurchase | undefined {
    return loadDB().purchases.find(p => p.paymentReference === cartId);
  },

  addPurchase(purchase: Omit<ServerPurchase, 'id' | 'createdAt'> & { id?: string }): ServerPurchase {
    const db = loadDB();
    const newPurchase: ServerPurchase = {
      buyerPhone: purchase.buyerPhone,
      buyerEmail: purchase.buyerEmail,
      buyerFirstName: purchase.buyerFirstName,
      buyerLastName: purchase.buyerLastName,
      contentId: purchase.contentId,
      status: purchase.status,
      paymentReference: purchase.paymentReference,
      amountPaid: purchase.amountPaid,
      commissionAmount: purchase.commissionAmount,
      creatorNetAmount: purchase.creatorNetAmount,
      id: purchase.id || `purchase_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString()
    };
    db.purchases.push(newPurchase);
    saveDB(db);
    return newPurchase;
  },

  updatePurchase(id: string, updates: Partial<ServerPurchase>): ServerPurchase | null {
    const db = loadDB();
    const idx = db.purchases.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.purchases[idx] = { ...db.purchases[idx], ...updates };
    saveDB(db);
    return db.purchases[idx];
  },

  addTransaction(tx: Omit<ServerTransaction, 'id' | 'createdAt'>): ServerTransaction {
    const db = loadDB();
    const newTx: ServerTransaction = {
      ...tx,
      id: `tx_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString()
    };
    db.transactions.push(newTx);
    saveDB(db);
    return newTx;
  },

  updateTransactionByCart(cartId: string, updates: Partial<ServerTransaction>): ServerTransaction | null {
    const db = loadDB();
    const idx = db.transactions.findIndex(t => t.providerTransactionId === cartId);
    if (idx === -1) return null;
    db.transactions[idx] = { ...db.transactions[idx], ...updates };
    saveDB(db);
    return db.transactions[idx];
  },

  addNotification(notif: Omit<ServerNotification, 'id' | 'createdAt' | 'isRead'>): ServerNotification {
    const db = loadDB();
    const newNotif: ServerNotification = {
      ...notif,
      id: `notif_${Math.random().toString(36).substring(2, 11)}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.push(newNotif);
    saveDB(db);
    
    // Also push to local storage in demo mode if on the client-side
    return newNotif;
  },

  getNotifications(userId: string): ServerNotification[] {
    return loadDB().notifications.filter(n => n.userId === userId);
  },

  getSubscriptions(): ServerSubscription[] {
    return loadDB().subscriptions;
  },

  getCreatorSubscriptions(creatorId: string): ServerSubscription[] {
    return loadDB().subscriptions.filter(s => s.creatorId === creatorId);
  },

  addSubscription(sub: Omit<ServerSubscription, 'id' | 'createdAt'>): ServerSubscription {
    const db = loadDB();
    const newSub: ServerSubscription = {
      ...sub,
      id: `sub_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString()
    };
    db.subscriptions.push(newSub);
    saveDB(db);
    return newSub;
  },

  updateSubscription(id: string, updates: Partial<ServerSubscription>): ServerSubscription | null {
    const db = loadDB();
    const idx = db.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.subscriptions[idx] = { ...db.subscriptions[idx], ...updates };
    saveDB(db);
    return db.subscriptions[idx];
  },

  isCreatorSubscribed(creatorId: string): boolean {
    const db = loadDB();
    const now = Date.now();
    const graceLimit = now - 3 * 24 * 60 * 60 * 1000; // 3 days ago
    
    // Returns true if there is any subscription WHERE creatorId = $1 AND status = 'active' AND endDate > graceLimit
    return db.subscriptions.some(
      s => s.creatorId === creatorId && 
           s.status === 'active' && 
           new Date(s.endDate).getTime() > graceLimit
    );
  }
};

