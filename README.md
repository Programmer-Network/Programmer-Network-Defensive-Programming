# Defensive Programming & Guard Clause Hell

1. **Defensive Programming**:
   - **Definition**: Writing code that anticipates and handles potential errors and edge cases, often through numerous checks and validations.
   - **Problem**: While necessary, it can lead to verbose and hard-to-maintain code, commonly referred to as "defensive code bloat".

2. **Guard Clause Hell**:
   - **Definition**: Overusing guard clauses or conditionals to check for null or undefined values.
   - **Problem**: Can make functions cluttered with checks, leading to decreased readability and increased cognitive load for future maintainers.

3. **Nullish Coalescing and Optional Chaining**:
   - **Optional Chaining (`?.`)**: Allows you to safely access nested properties.
     ```javascript
     const value = obj?.property?.nestedProperty;
     ```
   - **Nullish Coalescing (`??`)**: Provides a default value if the left-hand side is null or undefined.
     ```javascript
     const value = obj.property ?? 'default';
     ```

4. **Data Validation and Schema Libraries**:
   - Tools like Joi, Yup, and Zod can be used to validate incoming data structures and ensure required properties are present.
   - Example with Joi:
     ```javascript
     const schema = Joi.object({
       x: Joi.string().required()
     });
     const { error, value } = schema.validate(data);
     if (error) throw new Error('Validation failed');
     ```

5. **TypeScript and Type Safety**:
   - Using TypeScript can help by providing compile-time checks and ensuring that objects conform to expected shapes.
   - Example with TypeScript:
     ```typescript
     interface Data {
       x: string;
     }
     const data: Data = fetchData();
     ```

### Example Scenario and Solutions

Imagine an API response where you expect an object with a property `x`.

#### Without Proper Handling
```javascript
function processData(response) {
  if (response && response.x) {
    console.log(response.x);
  } else {
    console.log('Property x is missing');
  }
}
```

#### Using Optional Chaining and Nullish Coalescing
```javascript
function processData(response) {
  const x = response?.x ?? 'default value';
  console.log(x);
}
```

#### Using a Schema Validation Library (e.g., Joi)
```javascript
const schema = Joi.object({
  x: Joi.string().required()
});

function processData(response) {
  const { error, value } = schema.validate(response);
  if (error) {
    console.log('Validation failed');
  } else {
    console.log(value.x);
  }
}
```

#### Using TypeScript for Type Safety
```typescript
interface ApiResponse {
  x: string;
}

function processData(response: ApiResponse) {
  console.log(response.x);
}
```


### Example Scenario with BigQuery

You have a scenario where BigQuery returns rows as an array or `undefined`, which can lead to unstable code when accessing properties of the response.

### Current Code

```javascript
const [response] = await bigquery.runQuery(query);
return response?.processed_at;
```

### Problems with the Current Code
1. **Unstable Response**: `response` could be `undefined`, leading to potential runtime errors if not checked.
2. **Optional Chaining Overuse**: Repeated use of optional chaining can make the code less readable and harder to maintain.
3. **Lack of Consistent Contract**: The response object structure is not guaranteed, making it less predictable.

### Solution: Abstracting the Function to Ensure Consistent Contract

You can create a wrapper function that ensures the response always has a consistent structure. This function can provide a default object if the response is `undefined`.

### Improved Code

#### Step 1: Create a Wrapper Function

```javascript
async function runQueryWithDefaults(query) {
  const [response] = await bigquery.runQuery(query);
  return {
    processed_at: response?.processed_at ?? null,
    // Add other properties as needed with default values
  };
}
```

#### Step 2: Use the Wrapper Function

```javascript
const result = await runQueryWithDefaults(query);
return result.processed_at;
```

### Full Example

Let's create a full example to demonstrate this concept:

```javascript
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

async function runQueryWithDefaults(query) {
  try {
    const [response] = await bigquery.query(query);
    return {
      processed_at: response?.processed_at ?? null,
      // Add other properties as needed with default values
    };
  } catch (error) {
    console.error('Query failed:', error);
    return {
      processed_at: null,
      // Add other properties with default error values
    };
  }
}

async function main() {
  const query = 'SELECT processed_at FROM your_table LIMIT 1';
  const result = await runQueryWithDefaults(query);
  console.log(result.processed_at);
}

main();
```