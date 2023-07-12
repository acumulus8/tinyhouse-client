# TinyHouse - Client-Side Code

> A fullstack React GraphQL TypeScript Airbnb Clone.
>
> -   View the live project [here](https://tiny-house-app.com/).
> -   View the API code and documentation [here](https://github.com/acumulus8/tinyhouse-server).

-   [Overview](#overview)
-   [Features](#features)
-   [Code Structure](#code-structure)
-   [Authentication](#authentication)
-   [License](#license)

## Overview

The client-side code is bootstrapped with create-react-app-typescript and uses the following technologies:

-   React
-   TypeScript
-   GraphQL
-   Apollo Client
-   Ant Design

Types, queries, and mutations are defined in the server-side code and are automatically generated client-side using the graphql-codegen library.

## Features

Users can view available listings, search by location, and book a listing for a fee.

Users can login with Google and create their own listings to be booked by other users. Booking transactions and payments are handled by Stripe.

Authentication is handled by passing a randomly generated token and cookie between the client and server. This process determines the `viewer` and what protected content they are able to access. A session is maintained for the lifetime of the cookie and token, and terminated upon logging out. Learn more about authentication at the server-side documentation [here](https://github.com/acumulus8/tinyhouse-server).

The app is fully responsive and works on all screen sizes.

## Code Structure

```
├── src
│   ├── lib             # library of functonality and components
│   	├── components  # The smallest reusable bytes of UI
│   	├── graphql     # All generated types and queries/mutations
│   	├── hooks       # custom hooks
│   	├── utils       # Global utility functions
│   ├── sections        # The large, single-use portions of UI and app routes
│   ├── styles          # Global styles and assets
└──...
```

The Router is simple, along with the supporting markup and folder structure. All assets are scoped locally to their respective components. The only global styles are in the `styles` folder, which contains predefined CSS global styles. The `viewer` object lives at the highest level and is the only piece of global state. It is used to determine if the user is logged in and authorized to view certain pieces of information.

The `hooks` folder currently holds the `ScrollToTop` hook, but any additional reusable functionality would be stored here. The `utils` folder holds global functions that are used throughout the app, such as `formatListingPrice` and `displayErrorMessage`.

<br>

## License

This project is licensed under the [MIT License](LICENSE).

<br>
<br>
<br>
