
---

# USCH1B - G¨¦nie Logiciel 1: Principles of Database and application - SQL

## Database Project

### 1. Project Overview

The manager of a store selling farm products wants to create a web application (JavaScript, NodeJS, MySQL). The purpose of this application is to easily store and retrieve information related to products, loyal customers, partially manage stock, and generate some daily sales statistics.

### 2. Data Requirements

**Products**
The products sold are as follows :

* Cheese (comt¨¦, reblochon, raclette, tomme)
* Milk
* Yogurts
* Cottage cheese
* Meat
* Jams
* Eggs

Naturally, this list of products may evolve over time.

For each product, we know its:

* Name
* Unit price (excluding tax)
* The VAT rate (5.5%) applied at the time of sale
* The quantity in stock (changes according to restocking and sales).



**Customers**
Some customers (not all) are loyal customers of the store. For these customers, the only known information is:

* Gender ()
* Last name
* First name

We want to track their purchases to possibly expand the application in the future to manage discount coupons (which is beyond the scope of this project).

**Stock Management**
Each product's stock may vary due to restocking from the farm for regular sales (the most common case).

### 3. Functional Requirements

The application must allow for:

**Part 1 (Essential):**

1. Adding new products and displaying each product's characteristics.


2. Manually increasing or decreasing stock (in cases of restocking from the farm).


3. Viewing current stock.



**Part 2 (Optional/Extra Credit):**
4.  Recording sales history, displaying sold products and their quantities, the sale date, and customer information (if the buyer is a registered loyal customer).
5.  Entering/modifying and viewing a loyal customer's information.
6.  Displaying daily and date-range sales statistics (including total cash amount received).

### 4. Required Work (Deliverables for Part 1)

The required work consists of:

1. 
**ER Diagram:** Creating an entity-relationship diagram based on the needs analysis.


2. 
**Relational Schema:** Writing the normalized relational schema derived from the entity-relationship diagram, indicating primary and secondary keys for the chosen relationships.


3. 
**Database Implementation:** Implementing the database in MySQL and populating it (with data of your choice but including at least the products mentioned above).


4. **Web Development:** Creating a set of HTML pages or forms, as well as the corresponding JavaScript NodeJS scripts to achieve the application's objectives. Comment on the scripts or HTML pages as much as possible.


5. 
**Report:** Writing a report (a few pages) covering steps 1 to 4, justifying the main choices made, and attaching the listings of the HTML pages/forms/scripts.



**Note:**

* An optional additional task can be completed for Part 2. These points will be counted as extra credit.


* The development part (JS & HTML) will focus on essential aspects as covered in the course.



