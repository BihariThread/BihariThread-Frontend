# BihariThread

BihariThread is a premium streetwear brand rooted in the culture and heritage of Bihar, designed for the modern world. This Next.js application delivers a high-end e-commerce experience with liquid glass aesthetics, 3D product interactions, and a seamless shopping journey.

## Features

-   **Premium UI/UX**: "Liquid Glass" aesthetics, smooth transitions, and a modern dark/light mode adaptable interface.
-   **3D Product Interactions**: Interactive 3D tilt effects on product cards for an engaging user experience.
-   **Dynamic Navbar**: Smart navigation that adapts style based on scroll position for optimal visibility.
-   **E-commerce Functionality**:
    -   Featured Collections & New Arrivals
    -   Detailed Product Pages with Size & Quantity selection
    -   Cart Management (Zustand state management)
    -   User Authentication (AuthModal)
    -   Custom Print Order Flow

## Tech Stack

-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

-   Node.js 18.17 or later
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/biharithread.git
    cd biharithread
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `/app`: Next.js App Router pages and layouts.
-   `/components`: Reusable UI components (Navbar, ProductCard, AuthModal, etc.).
-   `/lib`: Utility functions and mock API data.
-   `/store`: Global state management stores (cart, auth).
-   `/public`: Static assets (images, logos).

## contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
