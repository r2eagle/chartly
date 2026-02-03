/**
 * Script constants for automatic installation via Webflow Data API
 */

// Chart.js CDN URL (hosted script)
export const CHART_JS_CDN_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
export const CHART_JS_VERSION = '4.4.1';

// ChartFlow runtime script (inline, minified to < 2000 chars)
export const CHARTFLOW_RUNTIME_SCRIPT = `(function(){'use strict';if(typeof Chart==='undefined'){console.error('ChartFlow: Chart.js required');return;}function init(){const c=document.querySelectorAll('[data-chartflow-id]');if(!c.length){console.log('ChartFlow: No charts found');return;}console.log('ChartFlow: Found '+c.length+' chart(s)');c.forEach((el,i)=>{try{const id=el.getAttribute('data-chartflow-id');const cfg=el.getAttribute('data-chartflow-config');if(!cfg){console.error('ChartFlow: No config for chart '+id);return;}const conf=JSON.parse(cfg);const canvas=el.querySelector('canvas');if(!canvas){console.error('ChartFlow: No canvas in chart '+id);return;}const ex=Chart.getChart(canvas);if(ex){console.log('ChartFlow: Chart '+id+' already initialized, skipping.');return;}const ctx=canvas.getContext('2d');if(!ctx){console.error('ChartFlow: No context for chart '+id);return;}new Chart(ctx,{type:conf.type,data:conf.data||{labels:[],datasets:[]},options:conf.options||{responsive:true,maintainAspectRatio:false}});console.log('ChartFlow: Initialized chart '+id);}catch(e){console.error('ChartFlow chart '+i+' error:',e);}});}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}if(typeof Webflow!=='undefined'){Webflow.push(init);}})();`;

export const CHARTFLOW_RUNTIME_VERSION = '1.0.0';

// Script display names for Webflow UI
export const CHART_JS_DISPLAY_NAME = 'Chart.js (ChartFlow)';
export const CHARTFLOW_RUNTIME_DISPLAY_NAME = 'ChartFlow Runtime';

// Manual installation instructions (fallback)
export const MANUAL_INSTALLATION_INSTRUCTIONS = {
  chartJs: {
    url: CHART_JS_CDN_URL,
    location: 'Page Settings → Custom Code → Before </body> tag',
  },
  runtime: {
    location: 'Page Settings → Custom Code → Before </body> tag (after Chart.js)',
    note: 'Copy the chartflow-runtime.js script from the public folder',
  },
};
