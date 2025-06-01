# Admin - Template Management Screen

## Screen Description
The Template Management screen enables administrators to create, edit, and organize audit templates used throughout the QuickAudit system. It provides powerful tools for designing structured audit forms with customizable sections, questions, and scoring methods.

## UI Elements

### Header
- "Template Management" title
- Search templates field
- Category filter dropdown
- "Create New Template" primary button
- Import/Export buttons

### Template Library
- Grid/List view toggle
- Template cards showing:
  - Template name
  - Category/type
  - Last modified date
  - Usage statistics
  - Preview thumbnail
  - Favorite toggle
  - Status indicator (Draft, Published, Archived)
- Sorting options (Name, Date, Usage, Category)
- Folder organization system

### Template Editor (when creating/editing)
- Template name and description fields
- Category assignment dropdown
- Visibility and access controls
- Section builder
  - Add/remove/reorder sections
  - Section title and description
  - Conditional logic options
- Question builder
  - Question text editor with formatting
  - Response type selector (Yes/No, Multiple Choice, Scale, Text, Photo, etc.)
  - Required toggle
  - Scoring weight input
  - Reference materials attachment
  - Help text field
- Scoring system configuration
  - Calculation method
  - Weighting options
  - Passing threshold
  - Risk categorization

### Template Preview
- Mobile device frame showing live preview
- Desktop preview toggle
- Test mode for interaction testing
- Preview as different user roles

### Version Control Panel
- Version history with timestamps
- Author information
- Restore version option
- Compare versions feature
- Release notes field

### Navigation Sidebar
- Dashboard
- Users & Teams
- Templates & Forms (active)
- Reports & Analytics
- Settings
- Integrations
- Help & Support

## Behavior
- Drag-and-drop interface for building templates
- Real-time preview updates
- Autosave functionality
- Duplicate template option
- Template sharing and collaboration

## Color Scheme
- Background: Light gray (#F8FAFC)
- Editor: White (#FFFFFF) with section dividers
- Primary actions: Primary Blue (#2563EB)
- Template status: Draft (gray), Published (green), Archived (neutral)
- Question types: Color-coded by response format

## Accessibility Considerations
- All builder controls are keyboard accessible
- Template structure is semantically organized
- Preview mode includes accessibility checker
- Color contrast verification for all elements

## Platform-Specific Adaptations
- Mobile: Simplified template browser with limited editing
- Tablet: Split-screen editor and preview
- Desktop: Full-featured editor with multi-pane layout
