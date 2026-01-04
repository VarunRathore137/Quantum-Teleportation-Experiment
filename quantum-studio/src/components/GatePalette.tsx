/**
 * GatePalette.css
 * Styles for gate palette component
 */

.gate-palette {
  flex: 0 0 280px;
  background: white;
  border-right: 2px solid #ddd;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.gate-palette h2 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.palette-help {
  font-size: 0.85rem;
  color: #666;
  margin: 10px 0 20px 0;
  font-style: italic;
}

.gate-category {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.gate-category:last-child {
  border-bottom: none;
}

.gate-category h3 {
  font-size: 0.95rem;
  color: #555;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.gate-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

/* SINGLE GATE ITEM IN PALETTE */
.gate-palette-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  font-size: 0.85rem;
}

.gate-palette-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.gate-palette-item:active {
  cursor: grabbing;
}

.gate-palette-item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.gate-icon {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.gate-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.gate-angle {
  font-size: 0.65rem;
  margin-top: 2px;
  opacity: 0.8;
}

/* PARAMETRIC GATES SECTION */
.parametric-gate-section {
  margin-bottom: 15px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.parametric-gate-section label {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.angle-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  margin-top: 6px;
}

.angle-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  transition: all 0.2s;
}

.angle-slider::-webkit-slider-thumb:hover {
  background: #764ba2;
  transform: scale(1.2);
}

.angle-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.angle-slider::-moz-range-thumb:hover {
  background: #764ba2;
  transform: scale(1.2);
}

.parametric-gate-section .gate-palette-item {
  margin-top: 8px;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .gate-palette {
    flex: 0 0 250px;
    padding: 15px;
  }

  .gate-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .gate-palette {
    flex: 0 0 auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 2px solid #ddd;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .gate-category {
    margin-right: 20px;
    display: inline-block;
    vertical-align: top;
  }

  .gate-grid {
    display: flex;
    gap: 8px;
  }

  .parametric-gate-section {
    display: inline-block;
    margin-right: 15px;
  }
}
