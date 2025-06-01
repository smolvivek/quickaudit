# Field Auditor - Dashboard Screen

## Screen Description
The dashboard is the main hub for field auditors after logging in. It provides a quick overview of assigned audits, recent activity, and quick access to key functions.

## UI Elements

### Header
- QuickAudit logo (smaller than on login screen)
- User profile icon/avatar in top right
- Notification bell icon with badge counter

### Welcome Section
- Personalized greeting ("Good morning, [Name]")
- Current date
- Quick status summary ("You have 3 audits scheduled today")

### Audit Tasks Section
- "Today's Audits" card with count
  - List of upcoming audits with time, location, and type
  - Color-coded priority indicators
  - Swipe actions for quick access
- "Pending Submissions" card with count
  - List of completed audits that need to be submitted
  - Progress indicators showing completion status

### Quick Actions
- "Start New Audit" primary button
- "Continue Draft" button (if applicable)
- "View Templates" button

### Recent Activity
- Timeline of recent audit activities
- Status updates on submitted audits
- Comments or feedback from supervisors

### Statistics Card
- Weekly completion rate
- Average audit duration
- Compliance score

### Bottom Navigation
- Dashboard (active)
- Audits
- Templates
- Reports
- More

## Behavior
- Pull-to-refresh updates the dashboard data
- Tapping on an audit opens its details
- Offline status indicator appears when no connection is available
- Syncing indicator shows when data is being synchronized

## Color Scheme
- Background: Light gray (#F8FAFC)
- Cards: White (#FFFFFF)
- Primary actions: Primary Blue (#2563EB)
- Priority indicators: Success (#10B981), Warning (#FBBF24), Error (#EF4444)

## Accessibility Considerations
- All interactive elements have appropriate contrast
- Icons have text labels
- Cards are clearly separated visually
- Information hierarchy is maintained for screen readers

## Platform-Specific Adaptations
- iOS: Bottom sheet for additional actions
- Android: FAB (Floating Action Button) for primary action
- Web: Sidebar navigation instead of bottom navigation
