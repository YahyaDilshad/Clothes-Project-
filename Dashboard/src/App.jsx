import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';

// Dashboard & Core Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProductsListPage } from './pages/Products/ProductsListPage';
import { AddEditProductPage } from './pages/Products/AddEditProductPage';
import { ProductDetailPage } from './pages/Products/ProductDetailPage';
import { OrdersListPage } from './pages/Orders/OrdersListPage';
import { OrderDetailPage } from './pages/Orders/OrderDetailPage';
import { CreateOrderPage } from './pages/Orders/CreateOrderPage';
import { InventoryPage } from './pages/Inventory/InventoryPage';

// Customer & Catalog Pages
import CustomersListPage from './pages/Customers/CustomersListPage';
import  CustomerDetailPage from './pages/Customers/CustomerDetailPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { CollectionsPage } from './pages/Collections/CollectionsPage';

// Business Operations Pages
import { DiscountsPage } from './pages/Discounts/DiscountsPage';
import { ReturnsPage } from './pages/Returns/ReturnsPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';

// Management Pages
import { WebsiteManagementPage } from './pages/Website/WebsiteManagementPage';
import { UsersRolesPage } from './pages/Users/UsersRolesPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import Stocks from './pages/Stock/Stock';
import BillingPage from './pages/Billings/billings';
import Exchange from './pages/Exchange/exchange';
import Staff from './pages/Staff/staff';
import Permissions from './pages/Permission/permission';
import Expense from './pages/Expense/expense';
import Revenue from './pages/Revenue/revenue';
import SalesPage from './pages/Sales/Sales';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard & Operations Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Index Route - Points to Dashboard */}
            <Route index element={<DashboardPage />} />
            
            <Route path="/stocks" element={<Stocks/>} />
            <Route path="/staff" element={<Staff/>} />
            <Route path="/expense" element={<Expense/>} />
            <Route path="/revenue" element={<Revenue/>} />
            <Route path="/permissions" element={<Permissions/>} />
            <Route path="/exchange" element={<Exchange/>} />
            <Route path="/billing" element={<BillingPage/>} />
            <Route path="/sales" element={<SalesPage/>} />
            {/* Dashboard Redirect */}
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            
            {/* Products Management */}
            <Route path="products">
              <Route index element={<ProductsListPage />} />
              <Route path="new" element={<AddEditProductPage />} />
              <Route path=":id" element={<ProductDetailPage />} />
              <Route path=":id/edit" element={<AddEditProductPage />} />
            </Route>

            {/* Orders Management */}
            <Route path="orders">
              <Route index element={<OrdersListPage />} />
              <Route path="new" element={<CreateOrderPage />} />
              <Route path=":id" element={<OrderDetailPage />} />
            </Route>

            {/* Inventory Section */}
            <Route path="inventory" element={<InventoryPage />} />

            {/* Customers Management */}
            <Route path="customers">
              <Route index element={<CustomersListPage />} />
              <Route path=":id" element={<CustomerDetailPage />} />
            </Route>

            {/* Catalog Management */}
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="collections" element={<CollectionsPage />} />

            {/* Marketing & Operations */}
            <Route path="discounts" element={<DiscountsPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />

            {/* Admin & Content Management */}
            <Route path="website" element={<WebsiteManagementPage />} />
            <Route path="users" element={<UsersRolesPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* 404 Fallback - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;