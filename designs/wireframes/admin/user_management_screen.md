# Admin - User Management Screen

## Screen Description
The User Management screen allows administrators to create, edit, and manage all users within the QuickAudit system. It provides comprehensive tools for role assignment, permission control, and team organization.

## UI Elements

### Header
- "User Management" title
- Search users field
- Filter dropdown (Active, Inactive, Role-based)
- "Add New User" primary button
- Bulk actions dropdown

### User List Table
- Sortable columns:
  - Username/Email (with profile thumbnail)
  - Full Name
  - Role (Admin, Supervisor, Field Auditor, Client)
  - Team/Department
  - Status (Active/Inactive)
  - Last Active
  - Audits Completed
  - Performance Score
- Row actions (Edit, Deactivate, Reset Password, Delete)
- Pagination controls
- Items per page selector

### User Details Panel (appears when user is selected)
- Profile information section
  - Profile picture
  - Contact information
  - Account creation date
  - Authentication method
- Role and Permissions section
  - Role selector
  - Custom permission toggles
  - Access level controls
- Team Assignment section
  - Team selector (multiple)
  - Position/title field
  - Reporting hierarchy
- Activity Log
  - Recent actions
  - Login history
  - Device information

### Batch Operations Panel
- Import users from CSV
- Export user list
- Bulk role assignment
- Bulk team assignment
- Send announcements

### Navigation Sidebar
- Dashboard
- Users & Teams (active)
- Templates & Forms
- Reports & Analytics
- Settings
- Integrations
- Help & Support

## Behavior
- Real-time search filtering
- Inline editing for quick changes
- Confirmation dialogs for critical actions
- Drag-and-drop for team assignments
- Permission inheritance visualization

## Color Scheme
- Background: Light gray (#F8FAFC)
- Table: White (#FFFFFF) with alternating row shading
- Primary actions: Primary Blue (#2563EB)
- Status indicators: Success green (#10B981), Neutral gray (#64748B)
- Permission levels: Color-coded by access level

## Accessibility Considerations
- Table is navigable via keyboard
- All actions have text alternatives to icons
- Status changes are announced to screen readers
- Focus management for modal dialogs

## Platform-Specific Adaptations
- Mobile: Simplified list view with essential actions
- Tablet: Responsive table with collapsible details
- Desktop: Full-featured table with side panel details
