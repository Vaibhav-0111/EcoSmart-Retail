# EcoSmart Retail

Welcome to EcoSmart Retail, an AI-powered platform designed to revolutionize retail operations through sustainable practices and enhanced customer experiences. This application showcases a sophisticated suite of tools for both internal employee management and public customer interaction.

## Core Technologies

*   **Frontend:** Next.js, React, TypeScript
*   **AI/Backend:** Google AI via Genkit
*   **UI:** ShadCN UI Components, Tailwind CSS, Lucide Icons

---

## In-Depth Feature Breakdown

The application is divided into two main parts: the internal **Employee Dashboard** and the public-facing **Customer Experience**.

### Part 1: Employee Dashboard & Operations Suite (`/dashboard`)

This is the internal-facing part of the application, designed to help employees manage reverse logistics, analyze performance, and gain strategic insights.

#### **1. Dashboard Overview (`/dashboard`)**
This is the central landing page for employees, providing a high-level, at-a-glance summary of key operations.
*   **Key Performance Indicators (KPIs):** Four prominent cards display real-time metrics:
    *   **Total Returns:** A count of all processed items.
    *   **Items Redirected:** The number of items saved from landfill.
    *   **Cost Savings:** Total revenue recovered from reselling and repairing items.
    *   **Waste Reduction:** The percentage of items diverted from landfill.
*   **Recent Returns Table:** A live-updating list of the 5 most recently processed items, showing their name, condition, value, and the AI-recommended action (e.g., Resell, Repair).
*   **Sustainability Impact Card:** A summary of the total items processed and the overall waste reduction percentage, including a breakdown of actions taken (resell, repair, recycle counts).

#### **2. Returns Management (`/dashboard/logistics`)**
This is the core operational hub where employees process incoming returned items.
*   **Item Processing List:** A table of all returned items that can be selected for action.
*   **Multi-Modal Item Entry:**
    *   **AI-Powered Scanning:** Users can use their device's camera to take a picture of a product. An AI flow (`identifyProductFromImage`) analyzes the image to automatically identify the product name, category, and estimated value, pre-filling the form.
    *   **AI Diagnostic Chat:** A conversational AI guides the employee through a series of questions to diagnose the returned item, its condition, and the reason for return. This AI (`diagnoseReturnedItem`) uses tool-calling to simulate searching for a product's price online.
    *   **Manual Entry:** A standard form for manually inputting all item details.
*   **AI Action Recommender:** For any selected item, an employee can click "Get Recommendation" to trigger an AI flow (`recommendReturnedItemAction`) that suggests the most sustainable and profitable action (Resell, Repair, Recycle, Reuse, or Landfill) based on the item's details. The AI's reasoning is displayed clearly.
*   **Dynamic Sustainability Chart:** A bar chart visualizes the breakdown of all actions taken across processed items.

#### **3. Resell Marketplace (`/dashboard/marketplace`)**
This page automatically populates with all items that the AI has recommended for "resell".
*   **AI Listing Generation:** For each item, an employee can click a button to have an AI (`generateResaleListing`) instantly write a complete, market-ready sales listing, including:
    *   A catchy, SEO-friendly title.
    *   A compelling, persuasive product description in Markdown format.
    *   A suggested resale price based on the item's condition and original value.

#### **4. Forecasting (`/dashboard/forecasting`)**
This page provides predictive analytics to help with operational planning.
*   **AI-Powered Forecasting:** An AI flow (`forecastReturns`) analyzes all historical return data to predict the volume of returns for each product category over the next 7 days.
*   **Data Visualization:** The forecast is presented through a bar chart for easy comparison across categories and detailed cards that explain the predicted trend (up, down, stable) and the AI's reasoning.

#### **5. Sustainability Hub (`/dashboard/sustainability`)**
A dedicated page to visualize the positive environmental impact of the operations.
*   **Dynamic Impact Metrics:** Displays key environmental savings (CO2, Waste Diverted, Water Saved, Trees Saved) calculated dynamically based on the actions taken on returned items.
*   **AI-Generated Narrative Report:** Users can click a button to have an AI (`generateSustainabilityReport`) draft a full, narrative-style sustainability report in Markdown, summarizing the key achievements and action breakdown.

#### **6. Performance Analytics (`/dashboard/analytics`)**
This page offers a deeper dive into the financial and operational performance.
*   **Advanced Metrics:** Includes cards for metrics like Average Processing Time and Success Rate.
*   **Revenue Recovery Chart:** A stacked bar chart that dynamically visualizes the revenue recovered from reselling, repairing, and recycling activities.

#### **7. AI Strategic Recommendations (`/dashboard/recommendations`)**
This advanced feature turns data into proactive business strategy.
*   **AI Business Analyst:** An AI flow (`getInventoryRecommendations`) analyzes the entire returns dataset to identify strategic patterns and potential issues.
*   **Actionable Advice:** The AI generates specific, actionable recommendations related to Product Quality, Supply Chain, and Inventory Management.
*   **Prioritized List:** Recommendations are presented in a table with their potential impact (High, Medium, Low) and the AI's confidence level.

#### **8. AI Product Studio (`/dashboard/studio`)**
A creative suite for generating marketing assets from just an idea.
*   **Text-to-Image Generation:** Users can type a detailed description of a product concept, and an AI (`generateProductImage`) creates a professional, high-resolution product photograph.
*   **Voice-to-Text Prompting:** Users can use their microphone to speak the product description instead of typing it.
*   **Image Download:** The generated image can be downloaded directly from the interface.

---

### Part 2: Customer-Facing Experience

This is the public-facing side of the application, designed to enhance the customer's shopping journey.

#### **1. Professional Landing Page (`/`)**
A modern, attractive homepage that introduces the EcoSmart Retail concept, its mission, and its key features. It serves as the entry point to both the employee dashboard and the AI shopper.

#### **2. Stylish Login Page (`/login`)**
A secure and professional login portal for employees to access the dashboard.

#### **3. AI Personal Shopper (`/shop`)**
A dedicated, customer-facing chat interface that revolutionizes the product discovery experience.
*   **Conversational AI Assistant:** Customers interact with a sophisticated AI (`personalShopper`) that understands natural language. They can describe their needs conversationally.
*   **Intelligent Product Search:** The AI asks clarifying questions to narrow down the options and searches a simulated product catalog using an AI tool.
*   **In-Chat Product Recommendations:** The AI presents recommended products directly within the chat interface, complete with images, descriptions, and prices.
*   **Customer Voice Input:** Customers can speak their requests using a microphone, making the interaction feel natural and hands-free.

---

This comprehensive suite of features creates a robust platform that leverages AI to solve real-world problems in both retail operations and customer engagement, making it a very powerful and well-rounded application.
