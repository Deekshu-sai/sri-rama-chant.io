/**
 * Virtualized Grid Module
 * Efficiently renders thousands of cells using windowing/virtualization
 */

import { getConfig } from './config.js';

class VirtualizedGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id '${containerId}' not found`);
    }

    this.totalCells = options.totalCells || getConfig('app.defaultGoal');
    this.visibleRows = 0;
    this.cellSize = 0;
    this.scrollTop = 0;
    this.cells = new Array(this.totalCells).fill(null);
    this.filledCells = new Set();
    this.onCellClick = options.onCellClick || null;

    this.init();
  }

  /**
   * Initialize grid
   */
  init() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    // Calculate grid layout
    this.cols = this.calculateColumns();
    this.rows = Math.ceil(this.totalCells / this.cols);
    this.cellSize = this.calculateCellSize();

    // Create spacer to set total height
    this.spacer = document.createElement('div');
    this.spacer.style.height = `${this.rows * this.cellSize}px`;
    this.spacer.style.width = '100%';
    this.spacer.style.position = 'relative';
    this.container.appendChild(this.spacer);

    // Create visible cells container
    this.visibleContainer = document.createElement('div');
    this.visibleContainer.style.position = 'absolute';
    this.visibleContainer.style.top = '0';
    this.visibleContainer.style.left = '0';
    this.visibleContainer.style.right = '0';
    this.container.appendChild(this.visibleContainer);

    this.calculateVisibleRows();
    this.render();
  }

  /**
   * Calculate number of columns based on screen width
   */
  calculateColumns() {
    const width = this.container.clientWidth;
    const breakpoints = getConfig('grid.breakpoints');

    for (const [maxWidth, cols] of Object.entries(breakpoints)) {
      if (width <= parseInt(maxWidth)) {
        return cols;
      }
    }

    return getConfig('grid.defaultCols');
  }

  /**
   * Calculate cell size based on container width
   */
  calculateCellSize() {
    const containerWidth = this.container.clientWidth;
    const gap = 1.5;
    const cellWidth = (containerWidth - (this.cols - 1) * gap) / this.cols;
    return Math.max(cellWidth, 8); // Minimum size
  }

  /**
   * Calculate number of visible rows
   */
  calculateVisibleRows() {
    const containerHeight = this.container.clientHeight || 400;
    this.visibleRows = Math.ceil(containerHeight / this.cellSize) + 2; // +2 buffer
  }

  /**
   * Render visible cells
   */
  render() {
    // Clear current visible cells
    this.visibleContainer.innerHTML = '';

    // Calculate visible range
    const startRow = Math.floor(this.scrollTop / this.cellSize);
    const endRow = Math.min(startRow + this.visibleRows, this.rows);

    const fragment = document.createDocumentFragment();

    for (let row = startRow; row < endRow; row++) {
      const startIdx = row * this.cols;
      const endIdx = Math.min(startIdx + this.cols, this.totalCells);

      for (let i = startIdx; i < endIdx; i++) {
        const cell = this.createCell(i);
        fragment.appendChild(cell);
      }
    }

    this.visibleContainer.appendChild(fragment);

    // Position visible container
    this.visibleContainer.style.transform = `translateY(${startRow * this.cellSize}px)`;
  }

  /**
   * Create a cell element
   */
  createCell(index) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.position = 'absolute';
    cell.style.width = `${this.cellSize}px`;
    cell.style.height = `${this.cellSize}px`;
    cell.style.left = `${(index % this.cols) * (this.cellSize + 1.5)}px`;
    cell.style.top = `${Math.floor(index / this.cols) * this.cellSize}px`;

    if (this.filledCells.has(index)) {
      cell.innerHTML = 'శ్రీరామ';
      cell.classList.add('f');
    } else {
      cell.innerHTML = '<span style="opacity:.15">రా</span>';
    }

    if (this.onCellClick) {
      cell.addEventListener('click', () => this.onCellClick(index));
    }

    this.cells[index] = cell;
    return cell;
  }

  /**
   * Mark cell as filled
   */
  fillCell(index, animate = false) {
    if (index < 0 || index >= this.totalCells) return;

    this.filledCells.add(index);
    const cell = this.cells[index];

    if (cell && this.isCellVisible(index)) {
      cell.innerHTML = 'శ్రీరామ';
      cell.className = 'cell f' + (animate ? ' pop' : '');
    }
  }

  /**
   * Check if cell is currently visible
   */
  isCellVisible(index) {
    const row = Math.floor(index / this.cols);
    const startRow = Math.floor(this.scrollTop / this.cellSize);
    const endRow = startRow + this.visibleRows;
    return row >= startRow && row < endRow;
  }

  /**
   * Set scroll position and re-render
   */
  setScrollTop(scrollTop) {
    this.scrollTop = scrollTop;
    this.render();
  }

  /**
   * Update total cells (e.g., when goal changes)
   */
  setTotalCells(total) {
    this.totalCells = total;
    this.filledCells.clear();
    this.cells = new Array(total).fill(null);
    this.init();
  }

  /**
   * Reset all cells to unfilled
   */
  reset() {
    this.filledCells.clear();
    this.render();
  }

  /**
   * Fill cells up to count
   */
  fillUpTo(count) {
    for (let i = 0; i < count; i++) {
      this.filledCells.add(i);
    }
    this.render();
  }

  /**
   * Handle resize
   */
  handleResize() {
    const newCols = this.calculateColumns();
    if (newCols !== this.cols) {
      this.cols = newCols;
      this.init();
    } else {
      this.cellSize = this.calculateCellSize();
      this.calculateVisibleRows();
      this.render();
    }
  }

  /**
   * Get filled count
   */
  getFilledCount() {
    return this.filledCells.size;
  }

  /**
   * Scroll to specific row
   */
  scrollToRow(row) {
    this.setScrollTop(row * this.cellSize);
  }
}

export default VirtualizedGrid;