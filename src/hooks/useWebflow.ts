import { useCallback } from 'react';
import { ChartConfig } from '../types/chart.types';
import { CHART_JS_CDN_URL } from '../constants/scripts';

export const useWebflow = () => {

  const insertChart = useCallback(async (config: ChartConfig) => {
    try {
      console.log('Inserting chart with config:', config);

      // Generate unique ID for this chart instance
      const chartId = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create container div with chart configuration using elementBuilder
      const containerBuilder = webflow.elementBuilder(webflow.elementPresets.DOM);
      containerBuilder.setTag('div');
      containerBuilder.setAttribute('data-chartflow-id', chartId);
      containerBuilder.setAttribute('data-chartflow-config', JSON.stringify(config));
      containerBuilder.setAttribute('class', 'chartflow-container');

      // Add minimal inline styles - users can style via Webflow Designer
      containerBuilder.setAttribute('style', 'width: 100%; min-height: 400px;');

      // Create canvas element as a child
      const canvasPreset = webflow.elementPresets.DOM;
      const canvasBuilder = webflow.elementBuilder(canvasPreset);
      canvasBuilder.setTag('canvas');
      canvasBuilder.setAttribute('id', chartId);
      canvasBuilder.setAttribute('aria-label', config.title || 'Chart');
      canvasBuilder.setAttribute('style', 'width: 100%; height: 100%; min-height: 300px;');

      // Append canvas preset to container (canvas will be configured after insertion)
      containerBuilder.append(canvasPreset);

      // Try to insert into selected element
      const selectedElement = await webflow.getSelectedElement();

      if (selectedElement && 'children' in selectedElement && selectedElement.children) {
        const insertedContainer = await selectedElement.append(containerBuilder);

        // Configure the canvas element after insertion
        const children = await (insertedContainer as any).getChildren();
        if (children && children.length > 0) {
          const canvasElement = children[0];
          await canvasElement.setTag('canvas');
          await canvasElement.setAttribute('id', chartId);
          await canvasElement.setAttribute('aria-label', config.title || 'Chart');
          await canvasElement.setAttribute('style', 'width: 100%; height: 100%; min-height: 300px;');
        }
      } else {
        // If no element selected, notify user to select an element
        await webflow.notify({
          type: 'Error',
          message: 'Please select an element on the page where you want to insert the chart.'
        });
        return false;
      }

      await webflow.notify({
        type: 'Success',
        message: 'Chart inserted! Add scripts to Page Settings to see it on published site.'
      });

      // Log manual setup instructions
      console.log('%c✅ Chart Inserted Successfully!', 'font-size: 16px; font-weight: bold; color: #10b981;');
      console.log('%cChart ID:', 'font-weight: bold;', chartId);
      console.log('\n');

      console.log('%c📋 SETUP REQUIRED: Add Scripts to Page Settings', 'font-size: 14px; font-weight: bold; color: #f59e0b;');
      console.log('%cTo see charts on your published site, follow these steps:', 'color: #6b7280;');
      console.log('\n');

      console.log('%c1️⃣ Open Page Settings:', 'font-weight: bold;');
      console.log('   Pages panel → Hover over page → Gear icon (⚙️) → Custom Code tab');
      console.log('   Scroll to "Before </body> tag" section');
      console.log('\n');

      console.log('%c2️⃣ Add Chart.js CDN (First Script):', 'font-weight: bold;');
      console.log(`   <script src="${CHART_JS_CDN_URL}"></script>`);
      console.log('\n');

      console.log('%c3️⃣ Add ChartFlow Runtime CDN (Second Script):', 'font-weight: bold;');
      console.log('   <script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0.0/dist/runtime.min.js"></script>');
      console.log('\n');

      console.log('%c4️⃣ Save & Publish:', 'font-weight: bold;');
      console.log('   Click Save → Publish your site (Cmd+Shift+P)');
      console.log('\n');

      console.log('%c💡 Pro Tips:', 'font-weight: bold; color: #3b82f6;');
      console.log('   • Add scripts ONCE per page - all charts will work automatically');
      console.log('   • For site-wide charts, add to Site Settings → Custom Code instead');
      console.log('   • Use pinned versions (@1.0.0) for stable, predictable behavior');
      console.log('   • See SETUP.md for detailed instructions and version options');
      console.log('   • Latest version info: https://www.npmjs.com/package/@r2eagle/chartflow');
      console.log('\n');

      return true;
    } catch (error) {
      console.error('Error inserting chart:', error);
      await webflow.notify({
        type: 'Error',
        message: `Failed to insert chart: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  }, []);

  const getSelectedElement = useCallback(async () => {
    try {
      return await webflow.getSelectedElement();
    } catch (error) {
      console.error('Error getting selected element:', error);
      return null;
    }
  }, []);

  return {
    insertChart,
    getSelectedElement
  };
};