# Security Specification - Arham Builds Store

## Data Invariants
1. Products must have a valid slug, title, and non-negative price.
2. Orders must include customer details and at least one item.
3. Access to write products or read all orders is restricted to verified admins.
4. Admins are identified by their UID in the `/admins/` collection.

## The "Dirty Dozen" Payloads (Deny List)
1. Creating a product without a slug.
2. Updating a product's ID (immutability).
3. Creating an order with a zero/negative amount.
4. An unauthenticated user attempting to list products (if we want to restrict list, but usually products are public).
5. A non-admin user attempting to write a product.
6. An admin attempting to change their own role to 'superadmin' without authorization.
7. Injecting arbitrary fields into an order document.
8. Creating an order with a future timestamp.
9. Deleting a product while not being an admin.
10. Reading all orders as a standard user.
11. Spoofing admin status by creating a document in `/admins/`.
12. Updating an order's `totalPrice` after it's been completed.

## Test Strategy
- Verify that only users in the `admins` collection can write to `products`.
- Verify that orders can be created but not edited by regular users.
- Verify strict schema validation for both products and orders.
