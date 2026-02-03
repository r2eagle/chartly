# Webflow Chart Designer Extension
## Project Plan & Development Roadmap

---

## 1. Project Overview

### 1.1 Vision
Build a native Webflow Designer Extension that allows users to visually create, customize, and embed dynamic charts directly onto their Webflow pages—without writing code.

### 1.2 Core Value Proposition
- **No-code chart creation** directly in Webflow Designer
- **CMS data binding** for dynamic, auto-updating charts
- **Visual customization** matching Webflow's design philosophy
- **Native integration** (not an iframe/embed workaround)

### 1.3 Target Users
- Webflow designers building client dashboards
- Marketing teams displaying metrics/KPIs
- Startups showcasing growth data
- Agencies needing reusable chart solutions

---

## 2. Technical Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | React 18+ | Official Webflow template support |
| Language | TypeScript | Type safety, better debugging |
| Chart Library | Chart.js 4.x | Small bundle (~47KB), proven Webflow compatibility |
| React Wrapper | react-chartjs-2 | Simplifies Chart.js in React |
| Styling | Tailwind CSS | Rapid UI development |
| Build Tool | Vite | Fast builds, included in Webflow CLI |
| API | Webflow Designer API | Canvas manipulation |
| Data | Webflow CMS API | Dynamic data binding |

---

## 3. Development Phases

---

### PHASE 1: Environment Setup & Learning
**Duration: 1 week**

#### 1.1 Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Code editor (VS Code recommended)
- [ ] Webflow account (any paid plan for CMS access)
- [ ] GitHub account for version control

#### 1.2 Webflow Developer Setup
- [ ] Create Webflow Workspace (if not existing)
- [ ] Register at developers.webflow.com
- [ ] Create new App in Developer Dashboard
- [ ] Configure App settings:
  - App name: "ChartFlow" (or your chosen name)
  - App type: Designer Extension
  - Redirect URI: `http://localhost:1337/callback`
  - Scopes: `sites:read`, `cms:read`, `cms:write`

#### 1.3 Project Initialization
```bash
# Install Webflow CLI globally
npm install -g @webflow/webflow-cli

# Create new extension project
webflow extension init chartflow-app --template=react

# Navigate to project
cd chartflow-app

# Install dependencies
npm install

# Install chart dependencies
npm install chart.js react-chartjs-2

# Install utility dependencies
npm install @types/node
```

#### 1.4 Learning Tasks
- [ ] Complete Webflow Designer API documentation review
- [ ] Build "Hello World" extension that inserts a div
- [ ] Study Chart.js basics (1-2 tutorials)
- [ ] Understand element presets and DOM manipulation

#### 1.5 Deliverables
- [ ] Working development environment
- [ ] Test extension loading in Webflow Designer
- [ ] Basic Chart.js chart rendering in isolation

---

### PHASE 2: Core Extension Architecture
**Duration: 2 weeks**

#### 2.1 Project Structure
```
chartflow-app/
├── src/
│   ├── components/
│   │   ├── App.tsx                 # Main extension container
│   │   ├── ChartTypeSelector.tsx   # Chart type picker
│   │   ├── DataEditor.tsx          # Manual data input
│   │   ├── StyleEditor.tsx         # Colors, fonts, sizes
│   │   ├── PreviewPanel.tsx        # Live chart preview
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── ColorPicker.tsx
│   │       └── Select.tsx
│   ├── hooks/
│   │   ├── useWebflow.ts           # Webflow API wrapper
│   │   ├── useChartConfig.ts       # Chart state management
│   │   └── useCMSData.ts           # CMS data fetching
│   ├── utils/
│   │   ├── chartDefaults.ts        # Default configurations
│   │   ├── colorPalettes.ts        # Pre-built color schemes
│   │   ├── validators.ts           # Input validation
│   │   └── serializers.ts          # Config to JSON conversion
│   ├── types/
│   │   ├── chart.types.ts          # TypeScript interfaces
│   │   └── webflow.types.ts        # Webflow API types
│   ├── constants/
│   │   └── chartTypes.ts           # Supported chart definitions
│   └── index.tsx                   # Entry point
├── public/
│   └── runtime/
│       └── chart-init.js           # Published site script
├── webflow.json                    # Extension configuration
└── package.json
```

#### 2.2 Data Model Design

```typescript
// types/chart.types.ts

interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  data: ChartData;
  options: ChartOptions;
  dataSource: DataSource;
  createdAt: string;
  updatedAt: string;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: LegendOptions;
    title: TitleOptions;
  };
  scales?: ScaleOptions;
}

interface DataSource {
  type: 'manual' | 'cms';
  collectionId?: string;
  labelField?: string;
  valueField?: string;
  refreshInterval?: number;
}
```

#### 2.3 Core Features to Build

**Week 1: Extension Shell**
- [ ] Main App component with navigation tabs
- [ ] Chart type selection grid (4 types)
- [ ] Basic state management for chart config
- [ ] Preview panel with live Chart.js rendering
- [ ] Webflow API connection test

**Week 2: Data & Style Editors**
- [ ] Manual data editor (add/remove/edit data points)
- [ ] Label editor with drag-to-reorder
- [ ] Color picker for datasets
- [ ] Basic style options (title, legend position)
- [ ] "Insert Chart" button functionality

#### 2.4 Webflow Integration Code

```typescript
// hooks/useWebflow.ts

import { useCallback } from 'react';

export const useWebflow = () => {
  
  const insertChart = useCallback(async (config: ChartConfig) => {
    // Get selected element or root
    const selectedElement = await webflow.getSelectedElement();
    
    // Create container div
    const container = await webflow.elementPresets.DOM({
      tag: 'div',
      attributes: {
        'data-chartflow-id': config.id,
        'data-chartflow-config': JSON.stringify(config),
        class: 'chartflow-container'
      }
    });
    
    // Create canvas element inside
    const canvas = await webflow.elementPresets.DOM({
      tag: 'canvas',
      attributes: {
        id: `chart-${config.id}`,
        'aria-label': config.title
      }
    });
    
    // Insert canvas into container
    await container.append(canvas);
    
    // Insert container into page
    if (selectedElement && selectedElement.children) {
      await selectedElement.append(container);
    } else {
      const body = await webflow.getBody();
      await body.append(container);
    }
    
    // Add runtime script reference (if not exists)
    await ensureRuntimeScript();
    
    return container;
  }, []);
  
  const ensureRuntimeScript = async () => {
    // Check if script already added to page settings
    // If not, prompt user to add CDN links
  };
  
  return { insertChart };
};
```

#### 2.5 Deliverables
- [ ] Fully functional extension UI
- [ ] Chart preview working in extension panel
- [ ] Successful chart insertion into Webflow canvas
- [ ] Configuration saved as element attributes

---

### PHASE 3: Runtime Chart Rendering
**Duration: 1 week**

#### 3.1 Runtime Script Development

```javascript
// public/runtime/chart-init.js

(function() {
  'use strict';
  
  // Wait for DOM and Chart.js
  function init() {
    if (typeof Chart === 'undefined') {
      console.error('ChartFlow: Chart.js not loaded');
      return;
    }
    
    // Find all chart containers
    const containers = document.querySelectorAll('[data-chartflow-config]');
    
    containers.forEach(container => {
      try {
        const config = JSON.parse(container.dataset.chartflowConfig);
        const canvas = container.querySelector('canvas');
        
        if (!canvas) {
          console.error('ChartFlow: Canvas not found');
          return;
        }
        
        // Initialize Chart.js
        new Chart(canvas, {
          type: config.type,
          data: config.data,
          options: config.options
        });
        
      } catch (error) {
        console.error('ChartFlow: Failed to render chart', error);
      }
    });
  }
  
  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

#### 3.2 User Setup Instructions
Create in-app instructions for users to add to their Webflow project:

**Page Settings → Custom Code → Before </body>:**
```html
<!-- Chart.js Library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

<!-- ChartFlow Runtime -->
<script src="https://your-cdn.com/chartflow-runtime.js"></script>
```

#### 3.3 Testing Checklist
- [ ] Charts render on published site
- [ ] Charts are responsive (resize with container)
- [ ] Multiple charts on same page work
- [ ] Charts work on mobile devices
- [ ] No console errors in production

#### 3.4 Deliverables
- [ ] Runtime script hosted on CDN
- [ ] Charts rendering on published Webflow sites
- [ ] Setup documentation for users

---

### PHASE 4: CMS Data Integration
**Duration: 2 weeks**

#### 4.1 CMS Connection Flow

```
User Flow:
1. User selects "CMS" as data source
2. Extension fetches available collections
3. User selects collection
4. User maps fields (label field, value field)
5. Preview updates with live CMS data
6. Chart config includes CMS binding info
7. Runtime script fetches fresh CMS data
```

#### 4.2 CMS Data Hook

```typescript
// hooks/useCMSData.ts

import { useState, useEffect } from 'react';

interface CMSCollection {
  id: string;
  displayName: string;
  slug: string;
  fields: CMSField[];
}

interface CMSField {
  id: string;
  displayName: string;
  type: string;
}

export const useCMSData = () => {
  const [collections, setCollections] = useState<CMSCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCollections = async () => {
    setLoading(true);
    try {
      // Use Webflow API to get site collections
      const siteInfo = await webflow.getSiteInfo();
      
      // Fetch collections via Data API
      const response = await fetch(
        `https://api.webflow.com/v2/sites/${siteInfo.siteId}/collections`,
        {
          headers: {
            'Authorization': `Bearer ${await webflow.getAccessToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      setCollections(data.collections);
    } catch (err) {
      setError('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCollectionItems = async (collectionId: string) => {
    // Fetch items from specific collection
    const siteInfo = await webflow.getSiteInfo();
    
    const response = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items`,
      {
        headers: {
          'Authorization': `Bearer ${await webflow.getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.json();
  };
  
  return {
    collections,
    loading,
    error,
    fetchCollections,
    fetchCollectionItems
  };
};
```

#### 4.3 CMS Selector Component

```typescript
// components/CMSDataSource.tsx

import React, { useEffect, useState } from 'react';
import { useCMSData } from '../hooks/useCMSData';

interface Props {
  onConfigChange: (config: CMSConfig) => void;
}

export const CMSDataSource: React.FC<Props> = ({ onConfigChange }) => {
  const { collections, fetchCollections, fetchCollectionItems } = useCMSData();
  const [selectedCollection, setSelectedCollection] = useState('');
  const [labelField, setLabelField] = useState('');
  const [valueField, setValueField] = useState('');
  const [previewData, setPreviewData] = useState(null);
  
  useEffect(() => {
    fetchCollections();
  }, []);
  
  const handleCollectionChange = async (collectionId: string) => {
    setSelectedCollection(collectionId);
    
    // Fetch sample data for preview
    const items = await fetchCollectionItems(collectionId);
    setPreviewData(items);
  };
  
  const handleFieldMapping = () => {
    onConfigChange({
      type: 'cms',
      collectionId: selectedCollection,
      labelField,
      valueField
    });
  };
  
  return (
    <div className="cms-data-source">
      <h3>Connect to CMS Collection</h3>
      
      <label>Select Collection</label>
      <select 
        value={selectedCollection}
        onChange={(e) => handleCollectionChange(e.target.value)}
      >
        <option value="">Choose a collection...</option>
        {collections.map(col => (
          <option key={col.id} value={col.id}>
            {col.displayName}
          </option>
        ))}
      </select>
      
      {selectedCollection && (
        <>
          <label>Label Field (X-axis / Categories)</label>
          <select value={labelField} onChange={(e) => setLabelField(e.target.value)}>
            {/* Render field options */}
          </select>
          
          <label>Value Field (Y-axis / Numbers)</label>
          <select value={valueField} onChange={(e) => setValueField(e.target.value)}>
            {/* Render numeric field options */}
          </select>
          
          <button onClick={handleFieldMapping}>
            Apply CMS Binding
          </button>
        </>
      )}
    </div>
  );
};
```

#### 4.4 Runtime CMS Fetching

```javascript
// Enhanced runtime script with CMS support

async function initCMSChart(container, config) {
  const { dataSource } = config;
  
  if (dataSource.type !== 'cms') {
    return initStaticChart(container, config);
  }
  
  try {
    // Fetch live CMS data
    const response = await fetch(
      `/api/chartflow/cms/${dataSource.collectionId}`
    );
    const items = await response.json();
    
    // Transform CMS data to chart format
    const chartData = {
      labels: items.map(item => item[dataSource.labelField]),
      datasets: [{
        ...config.data.datasets[0],
        data: items.map(item => parseFloat(item[dataSource.valueField]))
      }]
    };
    
    // Render chart
    const canvas = container.querySelector('canvas');
    new Chart(canvas, {
      type: config.type,
      data: chartData,
      options: config.options
    });
    
  } catch (error) {
    console.error('ChartFlow: CMS fetch failed', error);
    // Fallback to static data
    initStaticChart(container, config);
  }
}
```

#### 4.5 Deliverables
- [ ] CMS collection selector working
- [ ] Field mapping interface complete
- [ ] Live preview with CMS data
- [ ] Runtime CMS data fetching
- [ ] Error handling for CMS failures

---

### PHASE 5: Polish & UX Enhancement
**Duration: 1 week**

#### 5.1 UI/UX Improvements
- [ ] Loading states for all async operations
- [ ] Error messages with recovery suggestions
- [ ] Tooltips for all controls
- [ ] Keyboard navigation support
- [ ] Undo/redo for data changes

#### 5.2 Chart Customization Options

| Category | Options to Add |
|----------|----------------|
| **Colors** | 10 pre-built palettes, custom color picker |
| **Typography** | Font family, size, weight for titles/labels |
| **Layout** | Legend position (top/bottom/left/right/none) |
| **Axes** | Min/max values, grid lines, tick formatting |
| **Animation** | Enable/disable, duration, easing |
| **Interaction** | Hover effects, click handlers, tooltips |

#### 5.3 Template System
Create starter templates for common use cases:

```typescript
const chartTemplates = [
  {
    name: 'Sales Dashboard',
    type: 'bar',
    colors: ['#3B82F6', '#10B981', '#F59E0B'],
    sampleData: { /* ... */ }
  },
  {
    name: 'Traffic Analytics',
    type: 'line',
    colors: ['#8B5CF6'],
    sampleData: { /* ... */ }
  },
  {
    name: 'Market Share',
    type: 'pie',
    colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
    sampleData: { /* ... */ }
  },
  {
    name: 'Goal Progress',
    type: 'doughnut',
    colors: ['#10B981', '#E5E7EB'],
    sampleData: { /* ... */ }
  }
];
```

#### 5.4 Accessibility Checklist
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader labels on charts
- [ ] Focus indicators visible
- [ ] Error messages announced to screen readers

#### 5.5 Deliverables
- [ ] Polished, professional UI
- [ ] 4+ chart templates
- [ ] Full accessibility compliance
- [ ] Comprehensive error handling

---

### PHASE 6: Testing & Quality Assurance
**Duration: 1 week**

#### 6.1 Testing Matrix

| Test Type | Tools | Coverage |
|-----------|-------|----------|
| Unit Tests | Jest, React Testing Library | Components, hooks, utils |
| Integration | Cypress | User flows, Webflow API |
| Visual | Chromatic/Percy | UI regression |
| Performance | Lighthouse | Bundle size, load time |
| Cross-browser | BrowserStack | Chrome, Firefox, Safari, Edge |

#### 6.2 Test Scenarios

**Extension Tests:**
- [ ] Extension loads without errors
- [ ] All chart types render correctly
- [ ] Data input validates properly
- [ ] CMS connection authenticates
- [ ] Chart insertion succeeds
- [ ] Configuration saves correctly

**Runtime Tests:**
- [ ] Charts render on page load
- [ ] Multiple charts work together
- [ ] Responsive behavior correct
- [ ] CMS data fetches successfully
- [ ] Error states handle gracefully
- [ ] Performance acceptable (<3s load)

**Edge Cases:**
- [ ] Empty data handling
- [ ] Very large datasets (100+ points)
- [ ] Special characters in labels
- [ ] Missing CMS fields
- [ ] Network failures
- [ ] Concurrent chart edits

#### 6.3 Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| Extension bundle | <3MB | 5MB |
| Runtime script | <10KB | 20KB |
| Chart.js (CDN) | ~47KB | N/A |
| Time to interactive | <2s | 3s |
| Lighthouse score | >90 | >80 |

#### 6.4 Deliverables
- [ ] All tests passing
- [ ] Performance budgets met
- [ ] Cross-browser compatibility verified
- [ ] Bug fixes documented and resolved

---

### PHASE 7: Documentation & Support
**Duration: 1 week**

#### 7.1 User Documentation

**Getting Started Guide:**
1. Installing the app
2. Creating your first chart
3. Customizing appearance
4. Connecting to CMS
5. Publishing your site

**Video Tutorials (for marketplace submission):**
- [ ] 2-minute quick start
- [ ] 5-minute full walkthrough
- [ ] CMS integration deep-dive

#### 7.2 Technical Documentation
- [ ] API reference (if applicable)
- [ ] Troubleshooting guide
- [ ] FAQ document
- [ ] Changelog

#### 7.3 Support Infrastructure
- [ ] Support email setup
- [ ] Help center / knowledge base
- [ ] Bug report template
- [ ] Feature request process

#### 7.4 Deliverables
- [ ] Complete user documentation
- [ ] Video tutorials recorded
- [ ] Support system operational

---

### PHASE 8: Marketplace Submission
**Duration: 2 weeks (including review)**

#### 8.1 Pre-Submission Checklist

**Account Requirements:**
- [ ] 2FA enabled on Webflow account
- [ ] Workspace admin access confirmed

**Technical Requirements:**
- [ ] Bundle size under 5MB
- [ ] No `eval()` statements
- [ ] No external iframes (except auth)
- [ ] All dependencies bundled
- [ ] Runtime script hosted on CDN

**Assets Required:**
- [ ] App logo: 900×900px (logomark only)
- [ ] Screenshots: 4+ at 1280×846px
- [ ] Demo video: 2-5 minutes
- [ ] Privacy policy URL
- [ ] Terms of service URL

#### 8.2 Marketplace Listing Content

**App Name:** ChartFlow (or your chosen name)

**Tagline:** Create beautiful, dynamic charts in Webflow—no code required

**Description (draft):**
```
ChartFlow brings powerful data visualization to Webflow. Create stunning bar charts, line graphs, pie charts, and more—all without writing a single line of code.

✓ Visual chart builder with live preview
✓ Connect to CMS collections for dynamic data
✓ Professional color palettes and templates
✓ Fully responsive charts
✓ Fast, lightweight runtime

Perfect for dashboards, reports, portfolios, and any site that needs to display data beautifully.
```

**Categories:** Design Tools, CMS, Productivity

**Pricing Strategy:**
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 2 charts, 4 chart types, manual data |
| Pro | $9/mo | Unlimited charts, CMS integration, templates |
| Agency | $29/mo | White-label, priority support, custom branding |

#### 8.3 Submission Process
1. [ ] Build extension: `npm run build`
2. [ ] Upload via CLI: `webflow extension upload`
3. [ ] Complete marketplace listing form
4. [ ] Upload all required assets
5. [ ] Submit for review
6. [ ] Respond to reviewer feedback
7. [ ] Approval and launch!

#### 8.4 Post-Launch
- [ ] Monitor app analytics
- [ ] Respond to user reviews
- [ ] Track bug reports
- [ ] Plan v1.1 features

---

## 4. Timeline Summary

| Phase | Duration | Key Milestone |
|-------|----------|---------------|
| 1. Setup & Learning | Week 1 | Dev environment ready |
| 2. Core Architecture | Weeks 2-3 | Extension UI complete |
| 3. Runtime Rendering | Week 4 | Charts on published sites |
| 4. CMS Integration | Weeks 5-6 | Dynamic data working |
| 5. Polish & UX | Week 7 | Professional quality |
| 6. Testing & QA | Week 8 | All tests passing |
| 7. Documentation | Week 9 | Docs complete |
| 8. Submission | Weeks 10-11 | Marketplace live |

**Total Estimated Timeline: 10-12 weeks**

---

## 5. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Webflow API changes | High | Pin API versions, monitor changelog |
| Bundle size exceeded | Medium | Tree-shaking, code splitting |
| CMS rate limits | Medium | Caching, CDN for reads |
| Review rejection | Medium | Follow guidelines strictly, test thoroughly |
| Competition launches | Low | Focus on UX differentiation |

---

## 6. Success Metrics

**Launch Goals (First 30 days):**
- 100+ app installs
- 4.0+ star rating
- <5% churn rate

**Growth Goals (First 6 months):**
- 1,000+ active users
- 50+ Pro subscribers
- Featured in Webflow marketplace

---

## 7. Resources

**Official Documentation:**
- [Webflow Developer Docs](https://developers.webflow.com)
- [Designer API Reference](https://developers.webflow.com/designer/reference)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

**Learning Resources:**
- [Webflow Apps YouTube Tutorials](https://youtube.com/webflow)
- [Chart.js Getting Started](https://www.chartjs.org/docs/latest/getting-started/)

**Community:**
- Webflow Forums - Developer category
- Discord: Webflow Developers
- GitHub: Webflow-Examples

---

*Document Version: 1.0*  
*Last Updated: January 2025*
