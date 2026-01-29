# Project 01: Ba POS (Updated)

## Technology Used
| Category           | Technology           |
|--------------------|----------------------|
| Main Framework     | React                |
| Routing Library    | react-router-dom     | 
| Chart Library      | Recharts             | 
| UI Utility Library | react-select         | 
| Package Manager    | npm                  | 

## Group Members
- Kyaw Zeyar Hein 
- Min Khaung Kyaw Swar 

Overview
This project is a Point of Sale (POS) web application developed using React. It allows users to record sales transactions, manage product sales, and analyze sales performance through clear summaries, tables, and interactive charts.

The application features a dashboard that displays total revenue, number of transactions, and total items sold. It also includes sales trend analysis (daily, weekly, and monthly), sales by category with multiple chart views (pie, bar, and horizontal bar), and a top-selling products list.

A Sales Journal page is provided for adding and viewing transactions, where users can select products, enter quantities, choose dates, and automatically calculate totals. All sales data is stored using browser LocalStorage, so no backend server or database is required.

The system also includes a light mode and dark mode toggle to improve usability and readability.

Features
--Dashboard

The Dashboard provides an overview of sales performance and analytics.
It displays summary information such as total revenue, number of transactions, and total items sold.

The dashboard also includes:
Sales by category displayed as a chart
Sales trends shown by day, week, or month
Sales by product table
Top 5 best-selling products
Daily sales summary showing revenue, quantity, and order count
### Dashboard
![Dashboard](screenshots/dashboard.png)
![Dashboard2](screenshots/dashboard-2.png)

--Sales 

The Sales Journal page allows users to record sales transactions by selecting a product, entering quantity, and choosing a date.
The system automatically calculates the total price for each transaction.

All recorded transactions are displayed in a table that includes:Date, Product, Category, Quantity, Unit Price and Total Amount
### Sales Trend
![salestrenddaily](screenshots/salestrend-daily.png)
![salestrendweekly](screenshots/salestrend-weekly.png)
![salestrendmonthly](screenshots/salestrend-monthly.png)

### Sales Category
![salescategory](screenshots/salescategory-pie.png)
![salescategorybar](screenshots/salescategory-bar.png)
![salescategoryhbar](screenshots/salescategory-hbar.png)

### Sales Journal
![Sales Journal](screenshots/sales-journal.png)

--Dark Mode

The application includes a light mode and dark mode toggle to improve user experience and readability.
### Dark Mode
![Dark Mode](screenshots/dark-mode.png)


