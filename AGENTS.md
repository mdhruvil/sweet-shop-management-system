# Guidelines for Sweet Shop Management System

## Objective

Create a simple Sweet Shop Management System following TDD that allows users to perform basic operations such as adding sweets, updating sweet details, deleting sweets, searching, sorting, and viewing available sweets. Optionally, you may implement a basic front-end interface.

---

## Requirements

### 1. Operations

**Add Sweets:**

- Users should be able to add new sweets to the shop.
  - Each sweet should have a unique identifier (e.g., ID), name, category (e.g., chocolate, candy, pastry), price, and quantity in stock.

**Delete Sweets:**

- Users should be able to remove sweets from the shop.

**View Sweets:**

- Users should be able to view a list of all sweets currently available in the shop.

---

### 2. Search & Sort Features

**Search:**

- Users should be able to search for sweets by name, category, or price range.

---

### 3. Inventory Management

**Purchase Sweets:**

- Users can purchase sweets, which decreases the quantity of them in stock.
- The system should ensure enough stock is available before allowing a purchase.
- If there is not enough stock, the system should raise an appropriate error.

**Restock Sweets:**

- Users can restock sweets, increasing their quantity of stock.

---

### 4. (Optional) Frontend

- You may implement a simple front-end interface (webapp) to interact with the system, extra points for making it look pretty, and show us your creativity.

---

## Instructions

### Test-Driven Development (TDD)

- Write tests before implementing the functionality. Follow the three laws of TDD.
- Ensure that all tests pass before considering the implementation complete.
- Aim for high test coverage and meaningful test cases.

### Clean Coding Practices

- Write clean, readable, and maintainable code.
- Follow SOLID principles and other best practices in software design.
- Ensure the code is well-documented with meaningful comments and clear variable/method names.

---

**Assessment Focus:**

- Adherence to TDD principles.
- Frequency and quality of Git commits.
- Clean coding practices.
- Proper use of language-specific features and idioms is important.

## Tech Stack

- vitest v3.2.4 for testing
- typescript

## Project Structure

```bash
.
├── AGENTS.md
├── eslint.config.js
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│   ├── index.ts
│   ├── models
│   │   └── sweet.model.ts
│   ├── repositories
│   │   └── sweet.repository.ts
│   ├── routes
│   └── services
│       └── sweet.service.ts
├── tests
│   └── math.test.ts
├── tsconfig.json
└── vitest.config.ts
```

**Model Responsibilities:**

- Define data structure (properties)
- Data validation (Zod schemas)
- Basic entity behavior (can this sweet be purchased?)
- State changes (purchase, restock)

**Repository Responsibilities:**

- Data persistence (save, update, delete), in our case, in-memory storage
- Data retrieval (find by ID, find all, search)
- Query operations (filter, sort at data level)
- Data access abstraction (hide storage details)

**Service Responsibilities**

- Business workflows (purchase process, inventory management)
- Business rules (bulk purchase limits, business hours)
- Complex validation (duplicate names, stock levels)
- Coordinate between multiple entities/repositories
- Business logic (sorting, filtering, reporting)
- Error handling for business scenarios
