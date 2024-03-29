Let's assume you have a "Student" label and a "Department" label. Also, we'll create a relationship called "BELONGS_TO" to represent the association between a student and a department.

1. Create a Department:
cypher code
```
 CREATE (:Department {name: 'Computer Science'})
```
3. Create Students:
cypher  code
```
CREATE (:Student {name: 'John Doe', age: 20})
CREATE (:Student {name: 'Jane Smith', age: 22})
```
5. Connect Students to a Department:
Assuming you have the unique identifier for the "Computer Science" department, you can connect students to the department using the BELONGS_TO relationship:

cypher code
```
MATCH (s:Student), (d:Department)
WHERE d.name = 'Computer Science' AND s.name = 'John Doe'
CREATE (s)-[:BELONGS_TO]->(d)
```
Repeat this process for other students as needed. This query creates a relationship between a student and a department.

4. Query to Retrieve Students and Their Departments:
To retrieve students and their departments, you can use a MATCH statement:

cypher  code
```
MATCH (s:Student)-[:BELONGS_TO]->(d:Department)
RETURN s.name AS student_name, d.name AS department_name
```
This will return a list of students along with the departments they belong to.

Adjust the property names and values according to your specific requirements. This is a basic example, and depending on your data model, you might need to include additional properties or labels for a more complex representation.
