import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FaMoneyBillWave, FaUser, FaClock, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { formatCurrency } from '@/utils/format';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  userEmail?: string;
  remarks?: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(transactionsQuery);
        const transactionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Transaction));
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="p-6">
          <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium text-gray-600 border-b">
                  <div>TRANSACTION</div>
                  <div>USER</div>
                  <div>AMOUNT</div>
                  <div>STATUS</div>
                  <div>DATE</div>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm">
                    No transactions found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {transaction.type === 'deposit' ? (
                                <FaArrowDown className={`h-5 w-5 text-green-600`} />
                              ) : (
                                <FaArrowUp className={`h-5 w-5 text-red-600`} />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {transaction.id}</div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <FaUser className="mr-2 h-4 w-4" />
                          <div>
                            <div className="font-medium">{transaction.userEmail || 'Anonymous'}</div>
                            <div className="text-xs">ID: {transaction.userId}</div>
                          </div>
                        </div>

                        <div className={`text-sm font-medium ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}
                          NPR {formatCurrency(transaction.amount)}
                        </div>

                        <div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                          {transaction.remarks && (
                            <div className="text-xs text-gray-500 mt-1">
                              {transaction.remarks}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-2 h-4 w-4" />
                          {new Date(transaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
