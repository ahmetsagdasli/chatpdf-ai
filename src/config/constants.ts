
export const MOCK_PDF_CONTENT = `
React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.

React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js. Because React is only concerned with the user interface and rendering components to the DOM, React applications often rely on libraries for routing and other client-side functionality.

Key Features of React:

Components:
React's application logic is built using components. Components are self-contained, reusable pieces of code that can manage their own state. A component can be a class-based component or a function component. Since the introduction of Hooks, function components are more commonly used. Components are designed to be composed together to build complex UIs. For example, a button component can be used within a form component.

JSX (JavaScript XML):
JSX is a syntax extension for JavaScript recommended for use with React. It looks similar to HTML but allows developers to write markup directly in their JavaScript code. This allows for the logic and the view layer to be closely coupled. JSX is not a requirement for using React, but it is the most common and recommended approach. Babel transpiles JSX into standard JavaScript calls to React.createElement().

Virtual DOM:
React creates an in-memory data structure cache, computes the resulting differences, and then updates the browser's displayed DOM efficiently. This process is known as reconciliation. This allows the programmer to write code as if the entire page is rendered on each change, while the React libraries only render subcomponents that actually change. This selective rendering provides a major performance boost.

Hooks:
Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8. Hooks do not work inside classes — they let you use React without classes. The most common hooks are useState for managing local component state, and useEffect for performing side effects (like data fetching or subscriptions) in components. Other built-in hooks include useContext, useReducer, useCallback, and useMemo.

React's unidirectional data flow (also known as one-way data binding) means that data has one, and only one, way to be transferred to other parts of the application. In a React application, data is typically passed down from parent components to child components via props (properties). This makes the application's logic more predictable and easier to debug.
`;
