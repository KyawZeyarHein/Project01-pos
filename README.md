# Project 01: Basic POS

## Overview
This project is a Point of Sale (POS) web application built with **React**.
The system allows users to record sales transactions, view transaction history, and analyze sales performance through summary cards, tables, and charts.

## Features
- Loads base product data from a JSON file on the **first visit**
- Light mode / Dark mode toggle
- Sales recording, visualization, and summarization
- Add new products and categories
- Uses **LocalStorage** to persist sales data, products, custom categories, and user preferences across sessions

## Deployment
GitHub Pages: https://kyawzeyarhein.github.io/pos-project01/

---

## Group Members
- #### Kyaw Zeyar Hein  6632106
- #### Min Khaung Kyaw Swar 6712164

---

## Technology Used

### Framework
| Technology | Description                 |
| ---------- | --------------------------- |
| **React**  | The main frontend framework |
### Package Manager
| Technology | Description |
| ---------- | ----------- |
| **npm**    | The package manager |
### Libraries
| Technology           | Description |
| -------------------- | ----------- |
| **react-router-dom** | Routing between pages |
| **Recharts**         | Pie charts, bar charts, and other visualizations |
| **react-select**     | Searchable dropdown with text input for creating new items |

---

## Pages

## Dashboard Page
The Dashboard provides an overview of sales performance and analytics.
It displays summary information such as total revenue, number of transactions, and total items sold.

### Light Mode
![Dashboard](screenshots/dashboard.png)  
![Dashboard 2](screenshots/dashboard-2.png)

### Dark Mode
![Dashboard Dark](screenshots/db-dark.png)  
![Dashboard Dark 2](screenshots/db-dark-2.png)

### All-Time Summary
An overview of total revenue, total transactions, and total items sold (all time).  
![Total Summary](screenshots/total-summary.png)

### Sales by Category
Sales data grouped by category, viewable in 3 chart types: Pie Chart, Bar Graph, and Horizontal Bar Graph.

#### Pie Chart View
![Sales Category Pie](screenshots/salescategory-pie.png)

#### Bar Graph View
![Sales Category Bar](screenshots/salescategory-bar.png)

#### Horizontal Bar Graph View
![Sales Category Horizontal Bar](screenshots/salescategory-hbar.png)

### Sales by Product Table
All-time sales per product.  
![Sale By Product](screenshots/sale-by-product.png)

### Top 5 Best-Selling Products
Top 5 best-selling products of all time.  
![Top 5](screenshots/top-5.png)

### Sales Trend
Sales trends displayed by **day**, **week**, or **month**.  
#### Daily
![Sales Trend Daily](screenshots/salestrend-daily.png)  
#### Weekly
![Sales Trend Weekly](screenshots/salestrend-weekly.png)  
#### Monthly
![Sales Trend Monthly](screenshots/salestrend-monthly.png)

### Daily Sales Summary
Daily summary showing revenue, quantity, and order count (by day/week/month).  
The toggle for this is tied to the Sales Trend selection.
#### Daily
![Sales Summary Daily](screenshots/daily-ss.png)  
#### Weekly
![Sales Summary Weekly](screenshots/w-ss.png)  
#### Monthly
![Sales Summary Monthly](screenshots/m-ss.png)

---

## Sales Journal Page
The Sales Journal page allows users to record sales transactions by selecting a product, entering quantity, and choosing a date.

### Light Mode
![Sales Light Mode](screenshots/sales-lightmode.png)  
![Sales Light Mode 2](screenshots/sales-lightmode2.png)

### Dark Mode
![Sales Dark Mode](screenshots/sales-darkmode.png)  
![Sales Dark Mode 2](screenshots/sales-darkmode2.png)

### Add a Sale
Users record a sale by selecting a product, entering quantity, and choosing a date.  
The system automatically calculates the total price for each transaction.  
![Select Product](screenshots/Select_product.png)

#### Success Popup
![Success Popup](screenshots/success-product.png)

#### Warning Popup
![Sales Warning](screenshots/sales-warning.png)

### Add a New Product
If the product does not exist, users can type a name into the dropdown and click **Create** (or press **Enter**).  
![Add Product](screenshots/Add-product.png)

#### Add a New Product Form
Users can add a product by providing category, unit price, inventory, and an optional description.  
![Add Product Form](screenshots/Add-product-form.png)

#### Add a New Category
If a category does not exist, users can create it by typing it into the category dropdown.  
![Add Category](screenshots/Add-Category.png)

##### Category Added
![Category Show](screenshots/category-show.png)

#### Warning Popup
![Add Warning](screenshots/add-warning.png)

#### Success Popup
![Success Popup](screenshots/success-product.png)

#### Added Product Information
![New Product Info](screenshots/np-info.png)

### Sales History Table
All recorded sales are displayed in a table that includes: Date, Product, Category, Quantity, Unit Price, and Total Amount.  
Sales can be sorted by date.

#### Sort: Newest First
![Sort New](screenshots/sort_new.png)

#### Sort: Oldest First
![Sort Old](screenshots/sort_old.png)
