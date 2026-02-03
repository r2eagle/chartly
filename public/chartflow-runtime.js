/**
 * ChartFlow Runtime Script
 * This script runs on published Webflow sites to render charts created with the ChartFlow extension
 *
 * Requirements:
 * - Chart.js must be loaded before this script
 * - Include this script in Page Settings > Custom Code > Before </body>
 */

(function() {
  'use strict';

  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.error('ChartFlow: Chart.js is not loaded. Please include Chart.js before the ChartFlow runtime script.');
    return;
  }

  // Initialize all charts on the page
  function initializeCharts() {
    // Find all chart containers
    const chartContainers = document.querySelectorAll('[data-chartflow-id]');

    if (chartContainers.length === 0) {
      console.log('ChartFlow: No charts found on this page.');
      return;
    }

    console.log(`ChartFlow: Found ${chartContainers.length} chart(s) to initialize.`);

    chartContainers.forEach((container, index) => {
      try {
        const chartId = container.getAttribute('data-chartflow-id');
        const configStr = container.getAttribute('data-chartflow-config');

        if (!configStr) {
          console.error(`ChartFlow: No configuration found for chart ${chartId}`);
          return;
        }

        // Parse the chart configuration
        const config = JSON.parse(configStr);

        // Find the canvas element
        const canvas = container.querySelector('canvas');
        if (!canvas) {
          console.error(`ChartFlow: No canvas element found in container ${chartId}`);
          return;
        }

        // Check if chart already exists on this canvas (prevents double-initialization)
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
          console.log(`ChartFlow: Chart ${chartId} already initialized, skipping.`);
          return;
        }

        // Get the canvas context
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error(`ChartFlow: Could not get 2D context for canvas ${chartId}`);
          return;
        }

        // Create the chart with the configuration from the extension
        // The config already contains the complete Chart.js structure
        new Chart(ctx, {
          type: config.type,
          data: config.data || {labels: [], datasets: []},
          options: config.options || {
            responsive: true,
            maintainAspectRatio: false
          }
        });

        console.log(`ChartFlow: Successfully initialized chart ${chartId}`);

      } catch (error) {
        console.error(`ChartFlow: Error initializing chart ${index + 1}:`, error);
      }
    });
  }

  // Initialize charts when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCharts);
  } else {
    // DOM is already ready, initialize immediately
    initializeCharts();
  }

  // Re-initialize charts on Webflow interactions (optional)
  // This helps if charts are inside tabs, dropdowns, or other dynamic content
  if (typeof Webflow !== 'undefined') {
    Webflow.push(function() {
      console.log('ChartFlow: Webflow ready, initializing charts...');
      initializeCharts();
    });
  }

})();
