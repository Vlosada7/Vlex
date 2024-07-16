# Jurisdiction Selector Component

## Overview

This project implements a Jurisdiction Selector component using React and TypeScript. The component allows users to select jurisdictions and their sub-jurisdictions using checkboxes. It interacts with a provided fake API to fetch and display the data.

## Features

- **Hierarchical Jurisdiction Selection**: Users can expand and collapse jurisdictions and sub-jurisdictions.
- **Checkboxes for Selection**: Jurisdictions and sub-jurisdictions can be selected using checkboxes.
- **Asynchronous Data Fetching**: Fetches data from a fake API to display sub-jurisdictions dynamically.
- **Loading and Error States**: Provides feedback during data fetching and displays error messages if something goes wrong.
- **Clear Selection**: Users can clear their current selection using a dedicated button.

## Approach

### Component Setup

- Created a React functional component called `JurisdictionSelector` with TypeScript to ensure type safety.
- Extended the existing `Jurisdiction` interface to include additional states (`isExpanded`, `isChecked`, etc.) to manage each jurisdiction's UI state effectively.

### Data Fetching

- On component mount, used `useEffect` to fetch the top-level jurisdictions using the `fetchJurisdictions` function.
- Handled loading and error states to provide feedback during the data fetching process.

### State Management

- Used React's `useState` hook to manage the jurisdictions, loading, error, and selected jurisdiction ID states.
- Jurisdictions are stored in a hierarchical structure to allow for nested sub-jurisdictions that can be expanded or collapsed.

### User Interaction

- Implemented checkboxes for each jurisdiction, ensuring they start off unchecked as specified in the exercise.
- Click handlers manage the expansion and collapse of jurisdictions and sub-jurisdictions, and they also fetch sub-jurisdictions asynchronously when a jurisdiction is checked.

### Collapsing Logic

- Created a recursive function `collapseOthers` to collapse other jurisdictions when a new one is expanded.
- `collapseAll` is used to collapse and uncheck all sub-jurisdictions when a jurisdiction is unchecked.

### Rendering

- Jurisdictions and their nested sub-jurisdictions are rendered recursively, with clear styling to distinguish between different levels.
- Included a clear selection button that resets the selected jurisdiction and collapses all expanded jurisdictions.

### Error Handling

- Displayed error messages if there are issues fetching jurisdictions or sub-jurisdictions from the API.

### User Feedback

- Loading indicators are shown while fetching data to keep the user informed.
- The full path of the selected jurisdiction is displayed in a fixed sidebar, providing a clear context of the selection.

