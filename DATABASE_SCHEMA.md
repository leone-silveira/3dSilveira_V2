# Database Schema Documentation

## Overview
This document describes all the tables and relationships in the 3dSilveira kitchen and money management system.

## Tables

### Users (Existing)
Stores user account information.
- **id**: Primary key
- **username**: Unique username
- **password**: Hashed password
- **email**: Unique email address
- **role**: User role (admin, user, etc.)
- **activate**: Account status

### Foods (Existing)
Stores food recipes and nutritional information.
- **id**: Primary key
- **name**: Food name
- **food_type**: Category (meat, vegetable, etc.)
- **quantity**: Default quantity
- **calories, protein, carbohydrate, fat, fiber**: Nutritional values

### StockFoods (Existing)
Tracks current food inventory.
- **id**: Primary key
- **name**: Item name
- **food_type**: Category
- **quantity**: Current quantity
- **unit**: Measurement unit (kg, L, pieces, etc.)
- **expiry**: Expiration date

### CreditCards (NEW)
Manages user credit cards.
- **id**: Primary key
- **user_id**: Foreign key to Users
- **name**: Card name/label
- **card_number**: Last 4 digits (masked)
- **bank**: Bank name
- **limit**: Credit limit
- **current_balance**: Current balance
- **due_day**: Monthly due day
- **is_active**: Card status
- **created_at, updated_at**: Timestamps

### Expenses (NEW)
Tracks individual expenses.
- **id**: Primary key
- **user_id**: Foreign key to Users
- **description**: Expense description
- **amount**: Expense amount
- **category**: Category (groceries, utilities, entertainment, etc.)
- **date**: Transaction date
- **credit_card_id**: Associated credit card (optional)
- **is_recurring**: Whether it's a recurring expense
- **notes**: Additional notes
- **created_at, updated_at**: Timestamps

### Budgets (NEW)
Monthly/yearly budget limits by category.
- **id**: Primary key
- **user_id**: Foreign key to Users
- **category**: Budget category
- **limit_amount**: Budget limit for period
- **current_amount**: Current spending in period
- **month**: Month (1-12)
- **year**: Year
- **created_at, updated_at**: Timestamps

### RecurringExpenses (NEW)
Manages recurring expenses (subscriptions, rent, etc.).
- **id**: Primary key
- **user_id**: Foreign key to Users
- **description**: Expense description
- **amount**: Amount per recurrence
- **category**: Category
- **recurrence_type**: daily, weekly, biweekly, monthly, quarterly, yearly
- **next_due_date**: Next scheduled payment date
- **is_active**: Whether recurring is active
- **created_at, updated_at**: Timestamps

### ShoppingLists (NEW)
Creates organized shopping lists.
- **id**: Primary key
- **user_id**: Foreign key to Users
- **name**: List name
- **is_completed**: Whether list is completed
- **created_at, updated_at**: Timestamps

### ShoppingListItems (NEW)
Items in a shopping list.
- **id**: Primary key
- **shopping_list_id**: Foreign key to ShoppingLists
- **item_name**: Item name
- **quantity**: Quantity needed
- **unit**: Measurement unit
- **estimated_price**: Estimated cost
- **is_completed**: Whether item is checked off
- **created_at, updated_at**: Timestamps

### FamilyGroups (NEW)
Groups users for shared family management.
- **id**: Primary key
- **name**: Group name
- **created_by**: Creator user ID
- **created_at, updated_at**: Timestamps

### FamilyGroupMembers (NEW)
Links users to family groups.
- **id**: Primary key
- **family_group_id**: Foreign key to FamilyGroups
- **user_id**: Foreign key to Users
- **role**: Member role within group (admin, member, etc.)
- **joined_at**: Join timestamp

## Relationships

- **Users** → **CreditCards**: One user has many credit cards
- **Users** → **Expenses**: One user has many expenses
- **Users** → **Budgets**: One user has many budgets
- **Users** → **RecurringExpenses**: One user has many recurring expenses
- **Users** → **ShoppingLists**: One user has many shopping lists
- **Users** → **FamilyGroups**: One user creates many family groups
- **Users** → **FamilyGroupMembers**: One user is member of many groups

- **CreditCards** → **Expenses**: One card has many expenses
- **ShoppingLists** → **ShoppingListItems**: One list has many items

## Database Migration

Run the Alembic migration to create these tables:
```bash
cd backend
alembic upgrade head
```

## API Endpoints

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all user expenses
- `GET /api/expenses/{expense_id}` - Get specific expense
- `PUT /api/expenses/{expense_id}` - Update expense
- `DELETE /api/expenses/{expense_id}` - Delete expense
- `GET /api/expenses/category/{category}` - Get expenses by category

### Credit Cards
- `POST /api/credit_cards` - Create credit card
- `GET /api/credit_cards` - Get all user cards
- `GET /api/credit_cards/{card_id}` - Get specific card
- `PUT /api/credit_cards/{card_id}` - Update card
- `DELETE /api/credit_cards/{card_id}` - Delete card
- `GET /api/credit_cards/total/balance` - Get total balance

## Categories

Available expense categories:
- groceries
- utilities
- transportation
- entertainment
- healthcare
- education
- household
- dining
- shopping
- other

## Recurrence Types

- daily
- weekly
- biweekly
- monthly
- quarterly
- yearly
