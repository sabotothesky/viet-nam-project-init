
import { useEffect } from 'react';
import { useMarketplaceItems } from './marketplace/useMarketplaceItems';
import { useMyMarketplaceItems } from './marketplace/useMyMarketplaceItems';
import { useMarketplaceTransactions } from './marketplace/useMarketplaceTransactions';
import { useAuth } from './useAuth';

export const useMarketplace = () => {
  const { user } = useAuth();
  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    fetchItems,
    incrementViews,
  } = useMarketplaceItems();

  const {
    myItems,
    loading: myItemsLoading,
    error: myItemsError,
    fetchMyItems,
    createItem,
    updateItem,
  } = useMyMarketplaceItems();

  const {
    myTransactions,
    loading: transactionsLoading,
    error: transactionsError,
    fetchMyTransactions,
  } = useMarketplaceTransactions();

  const loading = itemsLoading || myItemsLoading || transactionsLoading;
  const error = itemsError || myItemsError || transactionsError;

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchItems(), fetchMyItems(), fetchMyTransactions()]);
    };

    loadData();
  }, [user]);

  return {
    items,
    myItems,
    myTransactions,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    incrementViews,
    refreshMyItems: fetchMyItems,
    refreshTransactions: fetchMyTransactions,
  };
};

// Export types for backward compatibility
export type { MarketplaceItem } from './marketplace/types';
export type { MarketplaceTransaction } from './marketplace/useMarketplaceTransactions';
