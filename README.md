# InstiWise Mobile App - Technical Documentation

![React Native](https://img.shields.io/badge/React_Native-v0.81.4-green)
![Expo](https://img.shields.io/badge/Expo-v54.x-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.x-blue)

InstiWise is an intelligent institute management and collaboration platform designed to enhance academic connectivity, communication, and productivity within educational institutions. The mobile app enables students and staff to access real-time academic information such as lessons, rooms, and schedules; share and explore projects; receive institute-wide news and announcements; and build meaningful student networks. The platform integrates academic management, project sharing, and social connectivity into one centralized system, promoting a smarter, more connected campus experience.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Features](#features)
- [Authentication](#authentication)
- [Theme Management](#theme-management)
- [Testing](#testing)
- [Deployment](#deployment)
- [Error Handling](#error-handling)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [Support](#support)

## Overview

The InstiWise mobile app is a React Native-based application built with Expo for cross-platform development (iOS, Android, Web). It provides a user-friendly interface for institute management, including authentication, home dashboard, calendar, projects (list, single, create), news, profile, and settings. Key features include theme switching (light/dark), search functionality, sorting, and dynamic data rendering.

## Architecture

### Components

- **Expo Router**: Handles file-based routing for screens.
- **React Navigation**: Manages bottom tabs and drawer navigation for seamless user experience.
- **NativeWind**: Integrates Tailwind CSS for styling.
- **Theme Context**: Custom context for light/dark theme switching with persistence via AsyncStorage.
- **Reusable Components**: UI components like SearchBar, EventCard, ProjectCard, NewsCard, ArrayInput for consistent design.
- **State Management**: React Hooks (useState, useEffect) for local state; Context for global theme.
- **Data Handling**: Dummy data from static/dummyData.ts for events, news, projects; interfaces in interfaces/interfaces.d.ts for type safety.

### Directory Structure

```plaintext
instiwise-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigation layout
│   │   ├── index.tsx         # Home screen
│   │   ├── calendar.tsx      # Calendar screen
│   │   ├── projects/
│   │   │   ├── _layout.tsx   # Nested project layout
│   │   │   ├── index.tsx     # Projects list
│   │   │   ├── [id].tsx      # Single project view
│   │   │   └── create.tsx    # Create project screen
│   │   ├── news.tsx          # News screen
│   │   └── profile.tsx       # Profile screen
│   ├── signup.tsx            # Signup screen
│   ├── login.tsx             # Login screen
│   └── settings.tsx          # Settings screen
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── EventCard.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ArrayInput.tsx
│   │   └── navigation/
│   │       ├── navbar.tsx
│   │       └── authbar.tsx
│   ├── context/
│   │   └── ThemeContext.ts
│   ├── constants/
│   │   └── themes.ts
│   ├── interfaces/
│   │   └── interfaces.d.ts
│   └── static/
│       └── dummyData.ts
├── assets/
│   └── images/
│       └── instiwise-icon.png
├── package.json
├── README.md
├── tsconfig.json
└── tailwind.config.js
```

## Technologies

- **React Native**: v0.81.4 for cross-platform mobile development
- **Expo**: v54.x for development tools and APIs
- **Tailwind CSS**: v3.x with NativeWind for styling
- **React Navigation**: v7.x for tabs and drawer
- **Expo Router**: v6.x for file-based routing
- **AsyncStorage**: For theme persistence
- **Expo Vector Icons**: For icons
- **Moment**: For date handling
- **TypeScript**: For type safety

## Setup Instructions

### Prerequisites

- **Node.js**: v18.x or higher (node -v to verify)
- **Expo CLI**: Install globally with `npm install -g expo-cli`

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd instiwise-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment:
    - Update `tailwind.config.js` if custom themes are needed.
    - Ensure Google Fonts (Poppins) are loaded in `app/(tabs)/_layout.tsx`.

4. Run the app:
    ```bash
    npm start
    ```

    - Use `a` for Android emulator, `i` for iOS simulator, or `w` for web.

## Project Structure

The app is structured with a modular approach, separating navigation, components, and static data. The `app/` directory contains screen definitions, while `src/` houses reusable components, context, and interfaces.

## Features

- **Authentication**: Signup and login screens with email/password.
- **Theme Switching**: Light/dark mode with persistence.
- **Home Dashboard**: Real-time info on news, events, projects, users.
- **Calendar**: Grouped events by month, search, future-only display.
- **Projects**: List with search and sorting (title, status, date, likes), single view, create with array inputs.
- **News**: List with search.
- **Profile and Settings**: Personal profile and settings.
- **Navigation**: Bottom tabs and drawer menu.

## Authentication

- **Basic email/password signup/login**.
- No backend integration shown; assume local state or integrate with Supabase/Auth0.

## Theme Management

- **Custom ThemeContext** with light/dark themes.
- **Persistence** via AsyncStorage.
- Switch in settings or drawer.

## Testing

- **Use Jest** for unit tests (configure in `jest.config.cjs`).
- Test components like `ProjectCard`, `ArrayInput`.
- Run `npm test`.

## Deployment

- **Expo EAS**: Use Expo Application Services for builds.
  - `expo build:android` or `expo build:ios`.
  - Or use EAS: `eas build --platform all`.
- Publish to App Store/Google Play.

## Error Handling

- **Basic validation** in forms.
- **Empty components** for no data (e.g., no projects found).

## Security

- **Secure password inputs** with `secureTextEntry`.
- Use JWT or Expo SecureStore for auth tokens if integrated.

## Future Improvements

- Backend integration (e.g., Supabase for data).
- Real-time updates with WebSockets.
- Push notifications.
- User authentication with Firebase.

## Support

For issues, check console logs or contact the development team. Provide error messages and device details for debugging.