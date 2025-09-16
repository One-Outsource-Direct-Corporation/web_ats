# Positions Feature - Refactored Architecture

This directory contains the refactored `CreateNewPosition` component following a feature-based architecture pattern. The original monolithic component (1000+ lines) has been broken down into smaller, focused components and hooks.

## Architecture Overview

```
src/features/positions/
├── components/           # UI Components
├── hooks/               # Custom Hooks for State Management
├── types/               # TypeScript Interfaces
├── utils/               # Utility Functions
├── views/               # Original Component (preserved)
└── index.ts            # Barrel Export
```

## Key Improvements

### 1. **Separation of Concerns**

- Each hook handles a specific domain (forms, assessments, pipeline, etc.)
- Components are focused on rendering and user interaction
- Business logic is extracted into utility functions

### 2. **Custom Hooks**

- `useFormData` - Manages form state and validation
- `useLocationsBatches` - Handles location and batch management
- `usePipelineStages` - Pipeline configuration state
- `useAssessments` - Assessment management
- `useQuestionnaires` - Questionnaire functionality
- `useQuestions` - Question management for assessments
- `useJobDescription` - Rich text editor functionality
- `useCreateNewPosition` - Main orchestrator hook

### 3. **Component Structure**

- `StepNavigation` - Reusable step navigation component
- `DetailsStep` - Step 1: Position details form
- `DescriptionStep` - Step 2: Job description editor
- `ApplicationFormStep` - Step 3: Application form configuration
- Additional step components can be easily added

### 4. **Type Safety**

- Comprehensive TypeScript interfaces in `types/createNewPositionTypes.ts`
- Strong typing throughout the application
- Better IDE support and compile-time error checking

## Usage

### Basic Usage

```tsx
import { CreateNewPositionRefactored } from "@/features/positions";

export default function PositionsPage() {
  return <CreateNewPositionRefactored />;
}
```

### Using Individual Hooks

```tsx
import { useFormData, useLocationsBatches } from "@/features/positions";

export default function CustomPositionForm() {
  const formData = useFormData();
  const locationsBatches = useLocationsBatches();

  return (
    <form>
      <input
        value={formData.formData.jobTitle}
        onChange={(e) => formData.handleInputChange("jobTitle", e.target.value)}
      />
      {/* ... */}
    </form>
  );
}
```

### Using Individual Components

```tsx
import {
  DetailsStep,
  useFormData,
  useLocationsBatches,
} from "@/features/positions";

export default function CustomStep() {
  const formData = useFormData();
  const locationsBatches = useLocationsBatches();

  return (
    <DetailsStep
      formData={formData.formData}
      onInputChange={formData.handleInputChange}
      locations={locationsBatches.locations}
      // ... other props
    />
  );
}
```

## Benefits

1. **Maintainability** - Smaller, focused components are easier to understand and modify
2. **Testability** - Each hook and component can be tested in isolation
3. **Reusability** - Components and hooks can be reused across different features
4. **Performance** - Better memoization opportunities with smaller components
5. **Developer Experience** - Better IDE support, faster builds, clearer code organization
6. **Scalability** - Easy to add new steps, modify existing functionality

## Migration Path

The original component is preserved in `views/CreateNewPosition.tsx` for reference. To migrate:

1. Import the refactored component: `CreateNewPositionRefactored`
2. Update routes to use the new component
3. Test thoroughly to ensure functionality parity
4. Remove the original component once migration is complete

## Future Improvements

1. **Modal Components** - Extract complex modals (StagePopup, AssessmentPopup, etc.) into separate components
2. **Form Validation** - Add comprehensive form validation using libraries like Zod or Yup
3. **State Persistence** - Add local storage or session storage for form state persistence
4. **Testing** - Add unit tests for hooks and components
5. **Documentation** - Add Storybook stories for components
6. **Performance** - Add React.memo and useMemo optimizations where needed

## Dependencies

The refactored components use the same UI library dependencies as the original:

- shadcn/ui components
- Lucide React icons
- React Router for navigation

No additional dependencies were introduced during the refactoring process.
